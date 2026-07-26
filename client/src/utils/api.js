const GITHUB_USER = 'Arunkumarmanickam'
const GITHUB_REPO = 'Hanger-Music'
const BASE_AUDIO_URL = `https://cdn.jsdelivr.net/gh/${GITHUB_USER}/${GITHUB_REPO}@main/assets`

let catalog = null
let catalogPromise = null

const STORAGE_KEY = 'hanger_playlists'

function getStoredPlaylists() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  } catch { return [] }
}

function savePlaylists(playlists) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(playlists))
}

export async function loadCatalog() {
  if (catalog) return catalog
  if (catalogPromise) return catalogPromise
  catalogPromise = (async () => {
    try {
      const res = await fetch('catalog.json')
      if (!res.ok) throw new Error('Failed to load catalog')
      catalog = await res.json()
      return catalog
    } catch (err) {
      console.error('Failed to load catalog:', err)
      catalog = { categories: [] }
      return catalog
    }
  })()
  return catalogPromise
}

export async function getCategories() {
  const data = await loadCatalog()
  return data.categories.map(({ id, name, description }) => ({ id, name, description }))
}

export async function getCategoryTracks(categoryId) {
  const data = await loadCatalog()
  const cat = data.categories.find(c => c.id === categoryId)
  if (!cat) return { category: null, tracks: [] }
  return { category: { name: cat.name, description: cat.description }, tracks: cat.tracks || [] }
}

export async function getCategoryTracksPreview(categoryId) {
  return getCategoryTracks(categoryId)
}

export function getAudioUrl(track) {
  const parts = [track.category]
  if (track.album) parts.push(track.album)
  parts.push(track.file + '.mp3')
  const path = parts.map(s => encodeURIComponent(s)).join('/')
  return `${BASE_AUDIO_URL}/${path}`
}

export async function searchTracks(query) {
  if (!query.trim()) return []
  const q = query.toLowerCase()
  const data = await loadCatalog()
  const results = []
  for (const cat of data.categories) {
    for (const track of cat.tracks || []) {
      if (track.title.toLowerCase().includes(q) || track.category.toLowerCase().includes(q)) {
        results.push(track)
      }
    }
  }
  return results
}

export function getThumbnailUrl(track) {
  return `https://img.youtube.com/vi/${track.id}/hqdefault.jpg`
}

export async function getPlaylists() {
  return getStoredPlaylists()
}

export async function createPlaylist(name, description) {
  const playlists = getStoredPlaylists()
  const playlist = {
    id: Date.now().toString(),
    name,
    description: description || '',
    tracks: [],
    createdAt: new Date().toISOString()
  }
  playlists.push(playlist)
  savePlaylists(playlists)
  return playlist
}

export async function getPlaylist(id) {
  const playlists = getStoredPlaylists()
  return playlists.find(p => p.id === id) || null
}

export async function addTrackToPlaylist(playlistId, track) {
  const playlists = getStoredPlaylists()
  const playlist = playlists.find(p => p.id === playlistId)
  if (!playlist) return null
  playlist.tracks.push(track)
  savePlaylists(playlists)
  return playlist
}

export async function removeTrackFromPlaylist(playlistId, trackId) {
  const playlists = getStoredPlaylists()
  const playlist = playlists.find(p => p.id === playlistId)
  if (!playlist) return null
  playlist.tracks = playlist.tracks.filter(t => t.id !== trackId)
  savePlaylists(playlists)
  return playlist
}

export async function deletePlaylist(id) {
  const playlists = getStoredPlaylists()
  savePlaylists(playlists.filter(p => p.id !== id))
}
