# ---------------- os imports ----------------
import os
import json
import asyncio
from pathlib import Path
from typing import Optional, Dict, Any, Tuple
from time import time as now_ts
from datetime import datetime, timezone

# ---------------- other imports ----------------
import httpx
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

# ---------------- fastapi conf ----------------
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_methods=["GET"],
    allow_headers=["*"],
)

# ---------------- paths / storage ----------------
STORAGE_DIR = Path("storage")
STORAGE_DIR.mkdir(parents=True, exist_ok=True)

TOKEN_FILE          = STORAGE_DIR / "spotify_token_storage.json"
SPOTIFY_CACHE_FILE  = STORAGE_DIR / "currently_playing.json"
WEATHER_CACHE_FILE  = STORAGE_DIR / "weather.json"

# ---------------- env ----------------
def create_env_if_not_exists():
    env_path = Path(__file__).with_name(".env")
    example_path = Path(__file__).with_name(".env.example")
    
    if not env_path.exists() and example_path.exists():
        print(f".env file not found. Creating from .env.example...")
        try:
            with open(example_path, "r", encoding="utf-8") as example_file:
                content = example_file.read()
            
            with open(env_path, "w", encoding="utf-8") as env_file:
                env_file.write(content)
                
            print(f"Created .env file. Please edit it with your actual credentials.")
            exit
        except Exception as e:
            print(f"Failed to create .env file: {str(e)}")
            exit

def validate_env_vars():
    warnings = []
    if not OWM_KEY:
        warnings.append("OPENWEATHER_API_KEY is not set - weather features will not work")
    if not OWM_LAT or not OWM_LON:
        warnings.append("OPENWEATHER_LAT/LON not set - using default Moscow coordinates")
    if not SPOTIFY_CLIENT_ID or not SPOTIFY_CLIENT_SECRET:
        warnings.append("Spotify credentials not set - music features will not work")
    if warnings:
        print("\nEnvironment configuration warnings:")
        for warning in warnings:
            print(warning)
        print(f"\nEdit backend/.env to configure these values\n")

create_env_if_not_exists()
validate_env_vars()

load_dotenv(dotenv_path=Path(__file__).with_name(".env"), override=True)

# Default values for environment variables
SPOTIFY_POLL_INTERVAL = float(os.getenv("SPOTIFY_POLL_INTERVAL") or "")

SPOTIFY_CLIENT_ID     = os.getenv("SPOTIFY_CLIENT_ID") or ""
SPOTIFY_CLIENT_SECRET = os.getenv("SPOTIFY_CLIENT_SECRET") or ""
SPOTIFY_REFRESH_TOKEN = os.getenv("SPOTIFY_REFRESH_TOKEN") or ""

OWM_KEY   = os.getenv("OPENWEATHER_API_KEY") or ""
OWM_LAT   = os.getenv("OPENWEATHER_LAT") or ""
OWM_LON   = os.getenv("OPENWEATHER_LON") or ""
OWM_UNITS = os.getenv("OPENWEATHER_UNITS") or ""
OWM_LANG  = os.getenv("OPENWEATHER_LANG") or ""
WEATHER_POLL_INTERVAL = int(os.getenv("WEATHER_POLL_INTERVAL") or "")

# ---------------- models ----------------
class TokenStorage(BaseModel):
    access_token: str

class TrackItem(BaseModel):
    track_id: str
    title: str
    release_date: str
    artist: str
    image: str
    is_playing: bool
    explicit: bool
    duration: int
    progress: int

class TrackData(BaseModel):
    is_active: bool
    track: Optional[TrackItem] = None

# ---------------- io utils ----------------
def atomic_write_json(path: Path, payload: Dict[str, Any]) -> None:
    tmp = path.with_suffix(path.suffix + ".tmp")
    with open(tmp, "w", encoding="utf-8") as f:
        json.dump(payload, f, ensure_ascii=False)
    os.replace(tmp, path)

def read_json_or(path: Path, default: Dict[str, Any]) -> Dict[str, Any]:
    if not path.exists():
        return default
    try:
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return default

def read_spotify_cache() -> TrackData:
    data = read_json_or(SPOTIFY_CACHE_FILE, {"is_active": False, "track": None})
    try:
        return TrackData(**data)
    except Exception:
        return TrackData(is_active=False)

def write_spotify_cache(td: TrackData) -> None:
    atomic_write_json(SPOTIFY_CACHE_FILE, td.model_dump())

def read_token() -> TokenStorage:
    if not TOKEN_FILE.exists():
        access = refresh_spotify_token_sync()
        write_token(access)
    with open(TOKEN_FILE, "r", encoding="utf-8") as f:
        data = json.load(f)
    return TokenStorage(**data)

def write_token(access_token: str) -> None:
    atomic_write_json(TOKEN_FILE, {"access_token": access_token})

# ---------------- debug state ----------------
TOKEN_STATUS: Dict[str, Any] = {
    "has_token_file": TOKEN_FILE.exists(),
    "last_refresh_status": None,
    "last_refresh_ok": None,
    "last_refresh_at": None,
}
SPOTIFY_FETCH_STATUS: Dict[str, Any] = {
    "last_status": None,
    "last_when": None,
}

def _now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()

def _record_token_refresh(status: int, ok: bool) -> None:
    TOKEN_STATUS.update({
        "has_token_file": TOKEN_FILE.exists(),
        "last_refresh_status": status,
        "last_refresh_ok": ok,
        "last_refresh_at": _now_iso(),
    })

def _record_fetch_status(status: int) -> None:
    SPOTIFY_FETCH_STATUS.update({
        "last_status": status,
        "last_when": _now_iso(),
    })

# ---------------- spotify token ----------------
def _spotify_env_missing() -> list[str]:
    missing = []
    if not SPOTIFY_CLIENT_ID:     missing.append("SPOTIFY_CLIENT_ID")
    if not SPOTIFY_CLIENT_SECRET: missing.append("SPOTIFY_CLIENT_SECRET")
    if not SPOTIFY_REFRESH_TOKEN: missing.append("SPOTIFY_REFRESH_TOKEN")
    return missing

def refresh_spotify_token_sync() -> str:
    miss = _spotify_env_missing()
    if miss:
        _record_token_refresh(0, False)
        raise HTTPException(status_code=500, detail=f"Missing env: {', '.join(miss)}")

    url  = "https://accounts.spotify.com/api/token"
    data = {"grant_type": "refresh_token", "refresh_token": SPOTIFY_REFRESH_TOKEN}
    with httpx.Client(timeout=10) as c:
        r = c.post(url, data=data, auth=(SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET))
    _record_token_refresh(r.status_code, r.status_code == 200)
    if r.status_code != 200:
        try:
            detail = r.json()
        except Exception:
            detail = r.text
        raise HTTPException(status_code=401, detail={"reason": "refresh_failed", "response": detail})
    return r.json()["access_token"]

async def refresh_spotify_token_async() -> str:
    miss = _spotify_env_missing()
    if miss:
        _record_token_refresh(0, False)
        raise HTTPException(status_code=500, detail=f"Missing env: {', '.join(miss)}")

    url  = "https://accounts.spotify.com/api/token"
    data = {"grant_type": "refresh_token", "refresh_token": SPOTIFY_REFRESH_TOKEN}
    async with httpx.AsyncClient(timeout=10) as c:
        r = await c.post(url, data=data, auth=(SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET))
    _record_token_refresh(r.status_code, r.status_code == 200)
    if r.status_code != 200:
        try:
            detail = r.json()
        except Exception:
            detail = r.text
        raise HTTPException(status_code=401, detail={"reason": "refresh_failed", "response": detail})
    return r.json()["access_token"]


# ---------------- spotify parsing ----------------
def pick_image(images: list) -> str:
    if not images:
        return ""
    if len(images) > 1:
        return images[1].get("url", "") or images[0].get("url", "")
    return images[0].get("url", "")

def build_track_data(payload: Dict[str, Any]) -> TrackData:
    item = payload.get("item")
    if not item:
        return TrackData(is_active=False)
    return TrackData(
        is_active=True,
        track=TrackItem(
            track_id=item.get("id", ""),
            title=item.get("name", ""),
            release_date=item.get("album", {}).get("release_date", ""),
            artist=(item.get("artists") or [{}])[0].get("name", ""),
            image=pick_image(item.get("album", {}).get("images", [])),
            is_playing=payload.get("is_playing", False),
            explicit=item.get("explicit", False),
            duration=item.get("duration_ms", 0),
            progress=payload.get("progress_ms", 0),
        ),
    )

# ---------------- spotify polling ----------------
poller_task: Optional[asyncio.Task] = None

async def fetch_spotify_once(token: str, etag: Optional[str]) -> Tuple[Optional[str], Optional[TrackData], int]:
    url = "https://api.spotify.com/v1/me/player/currently-playing"
    headers = {"Authorization": f"Bearer {token}"}
    if etag:
        headers["If-None-Match"] = etag
    async with httpx.AsyncClient(timeout=10) as client:
        r = await client.get(url, headers=headers)
    _record_fetch_status(r.status_code)

    if r.status_code == 200:
        return r.headers.get("ETag"), build_track_data(r.json()), r.status_code
    if r.status_code in (204, 304, 401, 403, 429):
        return etag, None, r.status_code
    return etag, None, r.status_code

async def poll_spotify_loop():
    token = read_token().access_token
    etag: Optional[str] = None
    backoff = SPOTIFY_POLL_INTERVAL

    while True:
        next_sleep = SPOTIFY_POLL_INTERVAL
        try:
            etag_out, td, status = await fetch_spotify_once(token, etag)

            if status == 401:
                token = await refresh_spotify_token_async()
                write_token(token)
                etag = None
                etag_out, td, status = await fetch_spotify_once(token, etag)

            if status == 429:
                next_sleep = max(2.0, SPOTIFY_POLL_INTERVAL)
            elif status == 204:
                write_spotify_cache(TrackData(is_active=False))
                etag = None
            elif status == 304:
                pass
            elif status == 200 and td:
                etag = etag_out
                write_spotify_cache(td)
                backoff = SPOTIFY_POLL_INTERVAL
            else:
                backoff = min(8.0, max(backoff * 1.5, SPOTIFY_POLL_INTERVAL))
                next_sleep = backoff

        except Exception:
            backoff = min(8.0, max(backoff * 1.5, SPOTIFY_POLL_INTERVAL))
            next_sleep = backoff

        await asyncio.sleep(next_sleep)

# ---------------- weather polling ----------------
weather_task: Optional[asyncio.Task] = None

def read_weather_cache() -> Dict[str, Any]:
    raw = read_json_or(WEATHER_CACHE_FILE, {
        "description_ru": None,
        "description_en": None,
        "temp": None,
    })
    return {
        "description_ru": raw.get("description_ru"),
        "description_en": raw.get("description_en"),
        "temp": raw.get("temp"),
    }

def write_weather_cache( description_ru: Optional[str], temp: Optional[float], description_en: Optional[str] = None) -> None:
    atomic_write_json( WEATHER_CACHE_FILE, {"description_ru": description_ru, "description_en": description_en, "temp": temp})


async def poll_weather_loop():
    url = "https://api.openweathermap.org/data/2.5/weather"
    params = {
        "appid": OWM_KEY,
        "lat": OWM_LAT,
        "lon": OWM_LON,
        "units": OWM_UNITS,
        "lang": OWM_LANG,
    }
    params_no_lang = {k: v for k, v in params.items() if k != "lang"}

    first_try = True
    retry_backoff = 30

    async with httpx.AsyncClient(timeout=10) as client:
        while True:
            try:
                r = await client.get(url, params=params)
                if r.status_code == 200:
                    j = r.json()
                    desc = (j.get("weather") or [{}])[0].get("description")
                    temp = j.get("main", {}).get("temp")

                    desc_en = None
                    try:
                        r2 = await client.get(url, params=params_no_lang)
                        if r2.status_code == 200:
                            j2 = r2.json()
                            desc_en = (j2.get("weather") or [{}])[0].get("description")
                    except Exception:
                        desc_en = None

                    write_weather_cache(desc, temp, desc_en)
                    sleep_for = WEATHER_POLL_INTERVAL
                    first_try = False
                else:
                    sleep_for = retry_backoff if first_try else min(120, retry_backoff)
            except Exception:
                sleep_for = retry_backoff if first_try else min(120, retry_backoff)

            await asyncio.sleep(sleep_for)


# ---------------- lifecycle ----------------
@app.on_event("startup")
async def on_startup():
    try:
        access = await refresh_spotify_token_async()
        write_token(access)
    except Exception:
        pass

    if not SPOTIFY_CACHE_FILE.exists():
        write_spotify_cache(TrackData(is_active=False))
    if not WEATHER_CACHE_FILE.exists():
        write_weather_cache(None, None)

    global poller_task, weather_task
    poller_task = asyncio.create_task(poll_spotify_loop())
    weather_task = asyncio.create_task(poll_weather_loop())


@app.on_event("shutdown")
async def on_shutdown():
    global poller_task, weather_task
    for t in (poller_task, weather_task):
        if t:
            t.cancel()
            try:
                await t
            except asyncio.CancelledError:
                pass

# ---------------- endpoints ----------------
@app.get("/spotify", response_model=TrackData)
async def get_spotify():
    return read_spotify_cache()

@app.get("/spotify/debug")
async def spotify_debug():
    return {
        "token": {
            "has_token_file": TOKEN_STATUS["has_token_file"],
            "last_refresh_status": TOKEN_STATUS["last_refresh_status"],
            "last_refresh_ok": TOKEN_STATUS["last_refresh_ok"],
            "last_refresh_at": TOKEN_STATUS["last_refresh_at"],
        },
        "fetch": {
            "last_status": SPOTIFY_FETCH_STATUS["last_status"],
            "last_when": SPOTIFY_FETCH_STATUS["last_when"],
        }
    }

@app.get("/spotify/refresh")
async def spotify_refresh():
    access = await refresh_spotify_token_async()
    write_token(access)
    return {"ok": True, "refreshed_at": _now_iso()}

@app.get("/weather")
async def weather():
    return read_weather_cache()
