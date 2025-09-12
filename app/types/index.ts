export interface SpotifyTrack {
  track_id: string
  title: string
  release_date: string
  artist: string
  image: string
  is_playing: boolean
  explicit: boolean
  duration: number
  progress: number
}

export interface SpotifyResponse {
  is_active: boolean
  track: SpotifyTrack | null
}

export interface WeatherResponse {
  description_ru: string | null
  description_en: string | null
  temp: number | null
  d: string | null
}