export function useSearchConfig() {
  const CONFIG: SearchConfig = {
    commandPathDelimiter: '/',
    commandSearchDelimiter: ' ',
    defaultSearchTemplate: 'https://www.google.com/search?q={}',
    openLinksInNewTab: false,
    suggestionLimit: 5,
  }

  const COMMANDS = new Map<string, CommandEntry>([
    // github
    ['g', { name: 'github', searchTemplate: '/search?q={}', suggestions: ['g/wiyba', 'g/bx-team', 'g/trending'], url: 'https://github.com' }],

    // reddit
    ['f', { name: 'forum', suggestions: ['f/reddit', 'f/4ch', 'f/2ch'], searchTemplate: '/search?q={}', url: 'https://reddit.com' }],
    ['f/reddit', { searchTemplate: '/search?q={}', url: 'https://reddit.com' }],
    ['f/4ch', { searchTemplate: 'https://4chansearch.com/?q={}', url: 'https://4chan.org' }],
    ['f/2ch', { url: 'https://2ch.su' }],

    // roblox
    ['r', { name: 'roblox', suggestions: ['r/nn', 'r/utg', 'r/pof', 'r/grace', 'r/delulu'], searchTemplate: '/discover/?Keyword={}', url: 'https://www.roblox.com'}],
    ['r/nn', { url: 'https://www.roblox.com/games/10118559731' }],
    ['r/utg', { url: 'https://www.roblox.com/games/14044547200' }],
    ['r/pof', { url: 'https://www.roblox.com/games/14044547200' }],
    ['r/grace', { url: 'https://www.roblox.com/games/138837502355157' }],
    ['r/delulu', { url: 'https://www.roblox.com/games/18749553947' }],

    // youtube
    ['y', { name: 'youtube', searchTemplate: '/results?search_query={}', url: 'https://www.youtube.com' }],

    // twitch
    ['t', { name: 'twitch', suggestions: ['t/valorant', 't/stintik', 't/5opka'], searchTemplate: '/search?term={}', url: 'https://twitch.tv' }],
    ['t/valorant', { url: 'https://twitch.tv/valorant' }],
    ['t/stintik', { url: 'https://twitch.tv/stintik' }],
    ['t/5opka', { url: 'https://twitch.tv/5opka' }],

    // ai
    ['a', { name: 'ai', searchTemplate: '/search/new?q={}', suggestions: ['a/perplexity', 'a/chatgpt', 'a/grok', 'a/copilot'], url: 'https://www.perplexity.ai' }],
    ['a/claude', { searchTemplate: '/new?q={}', url: 'https://claude.ai' }],
    ['a/perplexity', { searchTemplate: '/search/new?q={}', url: 'https://www.perplexity.ai' }],
    ['a/chatgpt', { searchTemplate: '/?temporary-chat=true&q={}', url: 'https://chatgpt.com/?temporary-chat=true' }],
    ['a/grok', { searchTemplate: '/?q={}', url: 'https://grok.com' }],
    ['a/copilot', { url: 'https://github.com/copilot' }],

    // sdamgia
    ['s', { name: 'sdamgia', suggestions: ['s/math', 's/russian', 's/informatics', 's/physics'], url: 'https://sdamgia.ru' }],
    ['s/math', { url: 'https://math-ege.sdamgia.ru' }],
    ['s/russian', { url: 'https://rus-ege.sdamgia.ru' }],
    ['s/informatics', { url: 'https://inf-ege.sdamgia.ru' }],
    ['s/physics', { url: 'https://phys-ege.sdamgia.ru' }],

    // localhost
    ['l', { name: 'localhost', url: 'http://localhost' }],
  ])

  return { CONFIG, COMMANDS } as const
}
