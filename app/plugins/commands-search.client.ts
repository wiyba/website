import { useSearchConfig } from '~/composables/useSearchConfig'

export default defineNuxtPlugin(() => {
  const { CONFIG, COMMANDS } = useSearchConfig()
  ;(window as any).CONFIG = CONFIG
  ;(window as any).COMMANDS = COMMANDS

  function injectTemplate(id: string, html: string) {
    if (document.getElementById(id)) return
    const t = document.createElement('template')
    t.id = id
    t.innerHTML = html
    document.body.appendChild(t)
  }

  // === commands-template ===
  injectTemplate('commands-template', `
    <style>
      :host {
        --color-background: var(--wc-bg, var(--color-background));
        --color-text: #ffffff;
        --color-text-subtle: var(--wc-text-subtle, var(--color-text-subtle));
        --font-family: var(--wc-font, var(--font-family));
      }
      nav {
        align-items: center;
        box-sizing: border-box;
        display: flex;
        justify-content: center;
        min-height: 100dvh;
        padding: 4rem 0;
        width: 100%;
      }
      .commands {
        display: inline-grid;
        grid-template-columns: 1fr 1fr;
        list-style: none;
        margin: 0;
        padding: 0;
      }
      .command {
        align-items: center;
        color: var(--color-text);
        display: flex;
        height: 4em;
        justify-content: center;
        outline: 0;
        position: relative;
        text-align: center;
        text-decoration: none;
        width: 4em;
        font-family: var(--font-family, inherit);
      }
      .key {
        color: var(--color-text-subtle);
        position: absolute;
        transition: all var(--transition-speed);
        font-size: 1.3rem;
      }
      .command:where(:focus, :hover) .key {
        opacity: 0;
        pointer-events: none;
        transform: translateY(1.5em) scale(0.9);
      }
      .name {
        opacity: 0;
        pointer-events: none;
        transform: translateY(-1.5em) scale(0.9);
        transition: all var(--transition-speed);
      }
      .command:where(:focus, :hover) .name {
        opacity: 1;
        transform: translateY(0);
      }
      @media (min-width: 35rem) {
        .commands { grid-template-columns: repeat(7, 1fr); }
      }
    </style>
    <nav>
      <menu class="commands"></menu>
    </nav>
  `)

  injectTemplate('command-template', `
    <li>
      <a class="command" rel="noopener noreferrer">
        <span class="key"></span>
        <span class="name"></span>
      </a>
    </li>
  `)

  // === search-template ===
  injectTemplate('search-template', `
    <style>
        :host {
            --wc-text: #a3a3a3;
            --wc-text-subtle: #525252;
            --wc-accent: #a3a3a3;
            --wc-accent-text: #0a0a0a;
            --wc-input-size: 2rem;
            --wc-transition: 150ms;
            --wc-pill-radius: 0.2em;
        }

        input, button {
            -moz-appearance: none;
            -webkit-appearance: none;
            background: transparent;
            border: 0;
            display: block;
            outline: 0;
            font-family: var(--wc-font);
        }

        .dialog {
            align-items: center;
            background: var(--wc-bg);
            border: none;
            display: none;
            flex-direction: column;
            height: 100%;
            justify-content: center;
            left: 0;
            padding: 0;
            top: 0;
            width: 100%;
        }
        .dialog[open] { display: flex; }

        .form { width: 100%; }

        .input {
            color: var(--wc-text);
            font-size: var(--wc-input-size);
            font-weight: bold;
            padding: 0;
            text-align: center;
            width: 100%;
        }

        .suggestions {
            align-items: center;
            display: flex;
            flex-direction: column;
            flex-wrap: wrap;
            justify-content: center;
            list-style: none;
            margin: 1rem 0 0;
            overflow: hidden;
            padding: 0;
        }

        .suggestion {
            color: var(--wc-text);
            cursor: pointer;
            font-size: 1rem;
            padding: 1rem;
            position: relative;
            transition: color var(--wc-transition);
            white-space: nowrap;
            z-index: 1;
            font-family: var(--wc-font);
        }

        .suggestion:where(:focus, :hover) { color: var(--wc-accent-text); }

        .suggestion::before {
            background-color: var(--wc-accent);
            border-radius: var(--wc-pill-radius);
            content: ' ';
            inset: 0.9em 0.5em;
            opacity: 0;
            position: absolute;
            transform: translateY(0.3em) scale(0.9);
            transition: all var(--wc-transition);
            z-index: -1;
        }
        .suggestion:where(:focus, :hover)::before {
            opacity: 1;
            transform: translateY(0);
        }

        .match {
            color: var(--wc-text-subtle);
            transition: color var(--wc-transition);
        }
        .suggestion:where(:focus, :hover) .match { color: var(--wc-accent-text); }

        @media (min-width: 700px) {
            .suggestions { flex-direction: row; }
        }
        </style>

    <dialog class="dialog">
      <form autocomplete="off" class="form" method="dialog" spellcheck="false">
        <input class="input" title="search" type="text" />
        <menu class="suggestions"></menu>
      </form>
    </dialog>
  `)

  injectTemplate('suggestion-template', `
    <li><button class="suggestion" type="button"></button></li>
  `)

  injectTemplate('match-template', `<span class="match"></span>`)

  const WCONFIG = (window as any).CONFIG
  const WCOMMANDS = (window as any).COMMANDS

  class Commands extends HTMLElement {
    constructor() {
      super()
      this.attachShadow({ mode: 'open' })
      const template = document.getElementById('commands-template') as HTMLTemplateElement
      const clone = template.content.cloneNode(true) as DocumentFragment
      const commands = (clone as any).querySelector('.commands') as HTMLElement
      const itemTpl = document.getElementById('command-template') as HTMLTemplateElement
      for (const [key, { name, url }] of WCOMMANDS.entries()) {
        if (!name || !url) continue
        const li = itemTpl.content.cloneNode(true) as DocumentFragment
        const a = (li as any).querySelector('.command') as HTMLAnchorElement
        a.href = url
        if (WCONFIG.openLinksInNewTab) a.target = '_blank'
        ;(li as any).querySelector('.key').innerText = key
        ;(li as any).querySelector('.name').innerText = name
        commands.append(li)
      }
      this.shadowRoot!.append(clone)
    }
  }
  if (!customElements.get('commands-component')) customElements.define('commands-component', Commands)

  class Search extends HTMLElement {
    #dialog!: HTMLDialogElement
    #form!: HTMLFormElement
    #input!: HTMLInputElement
    #suggestions!: HTMLElement
    constructor() {
      super()
      this.attachShadow({ mode: 'open' })
      const template = document.getElementById('search-template') as HTMLTemplateElement
      const clone = template.content.cloneNode(true) as DocumentFragment
      this.#dialog = (clone as any).querySelector('.dialog')
      this.#form = (clone as any).querySelector('.form')
      this.#input = (clone as any).querySelector('.input')
      this.#suggestions = (clone as any).querySelector('.suggestions')
      this.#form.addEventListener('submit', this.#onSubmit as EventListener, false)
      this.#input.addEventListener('input', this.#onInput as EventListener)
      this.#suggestions.addEventListener('click', this.#onSuggestionClick as EventListener)
      document.addEventListener('keydown', this.#onKeydown as EventListener)
      this.shadowRoot!.append(clone)
    }
    static #escape(s: string) { return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') }
    static #ddg(search: string) {
      return new Promise<string[]>((resolve) => {
        ;(window as any).autocompleteCallback = (res: Array<{ phrase: string }>) => {
          const out: string[] = []
          for (const item of res) if (item.phrase !== search.toLowerCase()) out.push(item.phrase)
          resolve(out)
        }
        const script = document.createElement('script')
        document.head.appendChild(script)
        script.src = `https://duckduckgo.com/ac/?callback=autocompleteCallback&q=${encodeURIComponent(search)}`
        script.onload = () => script.remove()
      })
    }
    static #fmt(tpl: string, s: string) { return tpl.replace(/{}/g, encodeURIComponent(s)) }
    static #hasProto(s: string) { return /^[a-zA-Z]+:\/\//i.test(s) }
    static #isUrl(s: string) { return /^((https?:\/\/)?[\w-]+(\.[\w-]+)+\.?(:\d+)?(\/\S*)?)$/i.test(s) }
    static #parse = (raw: string) => {
      const query = raw.trim()
      if (this.#isUrl(query)) {
        const url = this.#hasProto(query) ? query : `https://${query}`
        return { query, url }
      }
      if (WCOMMANDS.has(query)) {
        const { key, url } = WCOMMANDS.get(query)
        return { key, query, url }
      }
      let splitBy = WCONFIG.commandSearchDelimiter
      const [searchKey, rawSearch] = query.split(new RegExp(`${splitBy}(.*)`))
      if (WCOMMANDS.has(searchKey)) {
        const cmd = WCOMMANDS.get(searchKey)
        const tpl = new URL(cmd.searchTemplate ?? '', cmd.url)
        const search = (rawSearch || '').trim()
        const url = this.#fmt(decodeURI(tpl.href), search)
        return { key: searchKey, query, search, splitBy, url }
      }
      splitBy = WCONFIG.commandPathDelimiter
      const [pathKey, path] = query.split(new RegExp(`${splitBy}(.*)`))
      if (WCOMMANDS.has(pathKey)) {
        const cmd = WCOMMANDS.get(pathKey)
        const url =
          pathKey === '0' ? `http://localhost:${path}` :
          pathKey === 'r' ? `https://www.reddit.com/r/${path}` :
          `${new URL(cmd.url).origin}/${path}`
        return { key: pathKey, path, query, splitBy, url }
      }
      const url = this.#fmt(WCONFIG.defaultSearchTemplate, query)
      return { query, search: query, url }
    }
    #close() {
      this.#input.value = ''
      this.#input.blur()
      this.#dialog.close()
      this.#suggestions.innerHTML = ''
    }
    #execute(query: string) {
      const target = WCONFIG.openLinksInNewTab ? '_blank' : '_self'
      // @ts-expect-error
      window.open(Search.#parse(query).url, target, 'noopener noreferrer')
      this.#close()
    }
    #focusNext(prev = false) {
      // @ts-expect-error
      const active = this.shadowRoot!.activeElement as HTMLElement
      let nextIndex: number
      // @ts-expect-error
      if (active?.dataset?.index) {
        const i = Number(active.dataset.index)
        nextIndex = prev ? i - 1 : i + 1
      } else {
        nextIndex = prev ? this.#suggestions.childElementCount - 1 : 0
      }
      const next = this.#suggestions.children[nextIndex] as HTMLElement | undefined
      if (next) (next.querySelector('.suggestion') as HTMLButtonElement).focus()
      else this.#input.focus()
    }
    #onInput = async () => {
      const oq = Search.#parse(this.#input.value)
      if (!oq.query) { this.#close(); return }
      let list = WCOMMANDS.get(oq.query)?.suggestions ?? []
      if (oq.search && list.length < WCONFIG.suggestionLimit) {
        const res = await Search.#ddg(oq.search)
        list = list.concat(oq.splitBy ? res.map((s) => `${oq.key}${oq.splitBy}${s}`) : res)
      }
      const nq = Search.#parse(this.#input.value)
      if (nq.query !== oq.query) return
      this.#render(list, oq.query)
    }
    #onKeydown = (e: KeyboardEvent) => {
      if (!this.#dialog.open) {
        this.#dialog.show()
        this.#input.focus()
        requestAnimationFrame(() => { if (!this.#input.value) this.#close() })
        return
      }
      if (e.key === 'Escape') { this.#close(); return }
      const mod = `${e.altKey?'alt-':''}${e.ctrlKey?'ctrl-':''}${e.metaKey?'meta-':''}${e.shiftKey?'shift-':''}${e.key}`
      if (/^(ArrowDown|Tab|ctrl-n)$/.test(mod)) { e.preventDefault(); this.#focusNext(false); return }
      if (/^(ArrowUp|ctrl-p|shift-Tab)$/.test(mod)) { e.preventDefault(); this.#focusNext(true) }
    }
    #onSubmit = () => { this.#execute(this.#input.value) }
    #onSuggestionClick = (e: Event) => {
      const ref = (e.target as HTMLElement).closest('.suggestion') as HTMLElement | null
      if (!ref) return
      // @ts-expect-error
      this.#execute(ref.dataset.suggestion)
    }
    #render(list: string[], query: string) {
      this.#suggestions.innerHTML = ''
      const sliced = list.slice(0, WCONFIG.suggestionLimit)
      const tpl = document.getElementById('suggestion-template') as HTMLTemplateElement
      for (const [index, suggestion] of sliced.entries()) {
        const frag = tpl.content.cloneNode(true) as DocumentFragment
        const btn = (frag as any).querySelector('.suggestion') as HTMLButtonElement
        // @ts-expect-error
        btn.dataset.index = index
        // @ts-expect-error
        btn.dataset.suggestion = suggestion
        const escaped = Search.#escape(query)
        const m = suggestion.match(new RegExp(escaped, 'i'))
        if (m) {
          const mTpl = document.getElementById('match-template') as HTMLTemplateElement
          const mFrag = mTpl.content.cloneNode(true) as DocumentFragment
          const ref = (mFrag as any).querySelector('.match') as HTMLElement
          const pre = suggestion.slice(0, m.index!)
          const post = suggestion.slice(m.index! + m[0].length)
          ref.innerText = m[0]
          ref.insertAdjacentHTML('beforebegin', pre)
          ref.insertAdjacentHTML('afterend', post)
          btn.append(mFrag)
        } else {
          btn.innerText = suggestion
        }
        this.#suggestions.append(frag)
      }
    }
  }
  if (!customElements.get('search-component')) customElements.define('search-component', Search)
})
