import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import express from 'express'
import cors from 'cors'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ASSETS_DIR = path.resolve(__dirname, '..', 'assets')
const DATA_DIR = path.resolve(__dirname, 'data')
const PLAYLISTS_FILE = path.join(DATA_DIR, 'playlists.json')

fs.mkdirSync(DATA_DIR, { recursive: true })
if (!fs.existsSync(PLAYLISTS_FILE)) {
  fs.writeFileSync(PLAYLISTS_FILE, JSON.stringify([], null, 2))
}

const app = express()
app.use(cors())
app.use(express.json())

// Prevent browser caching of API responses
app.use('/api', (req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate')
  next()
})

// Serve static assets (MP3 files)
app.use('/assets', express.static(ASSETS_DIR, {
  setHeaders(res, filePath) {
    if (filePath.endsWith('.mp3')) {
      res.set('Content-Type', 'audio/mpeg')
      res.set('Accept-Ranges', 'bytes')
    }
  }
}))

// Get all categories (music directors)
app.get('/api/assets/categories', (req, res) => {
  try {
    const entries = fs.readdirSync(ASSETS_DIR, { withFileTypes: true })
    const categories = entries
      .filter(e => e.isDirectory())
      .map(dir => {
        const dirPath = path.join(ASSETS_DIR, dir.name)
        const trackCount = countMp3Files(dirPath)
        return {
          id: dir.name,
          name: dir.name,
          description: `${trackCount} songs`
        }
      })
    res.json({ categories })
  } catch (err) {
    console.error('Error reading categories:', err)
    res.status(500).json({ error: 'Failed to read categories' })
  }
})

// Get tracks for a category (director)
app.get('/api/assets/categories/:id', (req, res) => {
  try {
    const catDir = path.join(ASSETS_DIR, req.params.id)
    if (!fs.existsSync(catDir) || !fs.statSync(catDir).isDirectory()) {
      return res.status(404).json({ error: 'Category not found' })
    }
    const tracks = scanTracks(catDir, req.params.id)
    res.json({
      category: { name: req.params.id, description: `${tracks.length} songs` },
      tracks
    })
  } catch (err) {
    console.error('Error reading category:', err)
    res.status(500).json({ error: 'Failed to read category' })
  }
})

// Search
app.get('/api/search', (req, res) => {
  try {
    const q = (req.query.q || '').toLowerCase()
    if (!q) return res.json({ tracks: [] })

    const allTracks = []
    const dirs = fs.readdirSync(ASSETS_DIR, { withFileTypes: true })
      .filter(e => e.isDirectory())
    for (const dir of dirs) {
      const dirPath = path.join(ASSETS_DIR, dir.name)
      allTracks.push(...scanTracks(dirPath, dir.name))
    }

    const results = allTracks.filter(t =>
      t.title.toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q)
    )
    res.json({ tracks: results })
  } catch (err) {
    console.error('Search error:', err)
    res.status(500).json({ error: 'Search failed' })
  }
})

// Playlists
app.get('/api/playlists', (req, res) => {
  const playlists = JSON.parse(fs.readFileSync(PLAYLISTS_FILE, 'utf-8'))
  res.json({ playlists })
})

app.post('/api/playlists', (req, res) => {
  const playlists = JSON.parse(fs.readFileSync(PLAYLISTS_FILE, 'utf-8'))
  const { name, description } = req.body
  const playlist = {
    id: Date.now().toString(),
    name,
    description: description || '',
    tracks: [],
    createdAt: new Date().toISOString()
  }
  playlists.push(playlist)
  fs.writeFileSync(PLAYLISTS_FILE, JSON.stringify(playlists, null, 2))
  res.json({ playlist })
})

app.get('/api/playlists/:id', (req, res) => {
  const playlists = JSON.parse(fs.readFileSync(PLAYLISTS_FILE, 'utf-8'))
  const playlist = playlists.find(p => p.id === req.params.id)
  if (!playlist) return res.status(404).json({ error: 'Not found' })
  res.json({ playlist })
})

app.post('/api/playlists/:id/tracks', (req, res) => {
  const playlists = JSON.parse(fs.readFileSync(PLAYLISTS_FILE, 'utf-8'))
  const playlist = playlists.find(p => p.id === req.params.id)
  if (!playlist) return res.status(404).json({ error: 'Not found' })
  playlist.tracks.push(req.body.track)
  fs.writeFileSync(PLAYLISTS_FILE, JSON.stringify(playlists, null, 2))
  res.json({ playlist })
})

app.delete('/api/playlists/:id/tracks/:trackId', (req, res) => {
  const playlists = JSON.parse(fs.readFileSync(PLAYLISTS_FILE, 'utf-8'))
  const playlist = playlists.find(p => p.id === req.params.id)
  if (!playlist) return res.status(404).json({ error: 'Not found' })
  playlist.tracks = playlist.tracks.filter(t => t.id !== req.params.trackId)
  fs.writeFileSync(PLAYLISTS_FILE, JSON.stringify(playlists, null, 2))
  res.json({ playlist })
})

app.delete('/api/playlists/:id', (req, res) => {
  let playlists = JSON.parse(fs.readFileSync(PLAYLISTS_FILE, 'utf-8'))
  playlists = playlists.filter(p => p.id !== req.params.id)
  fs.writeFileSync(PLAYLISTS_FILE, JSON.stringify(playlists, null, 2))
  res.json({ success: true })
})

// Helpers
function scanTracks(dirPath, categoryName) {
  const tracks = []
  const entries = fs.readdirSync(dirPath, { withFileTypes: true })
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name)
    if (entry.isDirectory()) {
      // Album subfolder
      const albumTracks = fs.readdirSync(fullPath)
        .filter(f => f.endsWith('.mp3'))
        .map(f => ({
          id: path.parse(f).name,
          title: path.parse(f).name,
          file: entry.name + '/' + encodeURIComponent(path.parse(f).name),
          category: categoryName,
          album: entry.name
        }))
      tracks.push(...albumTracks)
    } else if (entry.name.endsWith('.mp3')) {

      // Direct song file (no album subfolder)
      tracks.push({
        id: path.parse(entry.name).name,
        title: path.parse(entry.name).name,
        file: encodeURIComponent(path.parse(entry.name).name),
        category: categoryName
      })
    }
  }
  return tracks
}

function countMp3Files(dirPath) {
  let count = 0
  try {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true })
    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name)
      if (entry.isDirectory()) {
        count += countMp3Files(fullPath)
      } else if (entry.name.endsWith('.mp3')) {
        count++
      }
    }
  } catch { }
  return count
}

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Hanger server running on http://localhost:${PORT}`)
  console.log(`Serving assets from: ${ASSETS_DIR}`)
})
