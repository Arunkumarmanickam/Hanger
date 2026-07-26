import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ASSETS_DIR = path.resolve(__dirname, '..', 'assets')
const OUTPUT = path.resolve(__dirname, '..', 'client', 'public', 'catalog.json')

const categories = []

const entries = fs.readdirSync(ASSETS_DIR, { withFileTypes: true })
for (const entry of entries) {
  if (!entry.isDirectory()) continue

  const catDir = path.join(ASSETS_DIR, entry.name)
  const tracks = []
  const catEntries = fs.readdirSync(catDir, { withFileTypes: true })

  for (const catEntry of catEntries) {
    const fullPath = path.join(catDir, catEntry.name)
    if (catEntry.isDirectory()) {
      const album = catEntry.name
      const files = fs.readdirSync(fullPath).filter(f => f.endsWith('.mp3'))
      for (const f of files) {
        const title = path.parse(f).name
        tracks.push({ id: title, title, category: entry.name, album, file: title })
      }
    } else if (catEntry.name.endsWith('.mp3')) {
      const title = path.parse(catEntry.name).name
      tracks.push({ id: title, title, category: entry.name, file: title })
    }
  }

  categories.push({
    id: entry.name,
    name: entry.name,
    description: `${tracks.length} songs`,
    tracks,
  })
}

fs.writeFileSync(OUTPUT, JSON.stringify({ categories }, null, 2))
console.log(`Catalog generated: ${categories.length} categories, ${categories.reduce((s, c) => s + c.tracks.length, 0)} tracks`)
console.log(`Output: ${OUTPUT}`)
