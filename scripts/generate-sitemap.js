import { createRequire } from 'module'
import { createWriteStream, writeFileSync } from 'fs'
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

links.forEach(link => sitemap.write(link))
sitemap.end()

streamToPromise(sitemap).then(() => {
  // Generate properly structured sitemap.xml
  const urlEntries = links.map(link =>
    `  <url>\n    <loc>${SITE_URL}${link.url}</loc>\n    <changefreq>${link.changefreq}</changefreq>\n    <priority>${link.priority}</priority>\n  </url>`
  ).join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>
`
  writeFileSync('./dist/sitemap.xml', xml)

  // Generate sitemap.txt (plain text format)
  const sitemapTxt = links.map(link => `${SITE_URL}${link.url}`).join('\n') + '\n'
  writeFileSync('./dist/sitemap.txt', sitemapTxt)

  console.log(`✅ sitemap.xml and sitemap.txt generated in dist/ (${links.length} URLs)`)
})
