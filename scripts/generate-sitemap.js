import { createRequire } from 'module'
import { createWriteStream } from 'fs'
import { SitemapStream, streamToPromise } from 'sitemap'

const require = createRequire(import.meta.url)
const config = require('../src/config.json')

const SITE_URL = 'https://mcfunctions.com'
const convertFormats = ['give-command', 'loot-table', 'item-modifier', 'recipe-output']

const staticPages = ['generators', 'worldgen', 'partners', 'sounds', 'changelog', 'versions', 'guides', 'transformation', 'customized']

const links = [
  // Homepage
  '/',
  // Static pages
  ...staticPages.map(id => `/${id}/`),
  // Generator pages (from config)
  ...config.generators.map(m => `/${m.url}/`),
  // Convert pages
  ...convertFormats.flatMap(s =>
    convertFormats.filter(t => s !== t).map(t => `/convert/${s}-to-${t}/`)
  ),
  // Legacy guide pages
  ...config.legacyGuides.map(g => `/guides/${g.id}/`),
].map(url => ({
  url,
  changefreq: 'weekly',
  priority: 0.7,
}))

const sitemap = new SitemapStream({ hostname: SITE_URL })
const writeStream = createWriteStream('./dist/sitemap.xml')

sitemap.pipe(writeStream)
links.forEach(link => sitemap.write(link))
sitemap.end()

streamToPromise(sitemap).then(() => {
  console.log(`✅ sitemap.xml generated in dist/ (${links.length} URLs)`)
})
