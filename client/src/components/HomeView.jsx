import { useState, useEffect, useRef } from 'react'
import { Disc3, Music, Library, ListMusic } from 'lucide-react'
import { getCategories, getPlaylists } from '../utils/api'

const CARD_GRADIATES = [
  ['from-rose-600 to-pink-500'],
  ['from-violet-600 to-purple-500'],
  ['from-blue-600 to-cyan-500'],
  ['from-amber-600 to-orange-500'],
  ['from-emerald-600 to-teal-500'],
  ['from-fuchsia-600 to-pink-500'],
  ['from-indigo-600 to-blue-500'],
  ['from-orange-600 to-amber-500'],
  ['from-teal-600 to-emerald-500'],
  ['from-purple-600 to-fuchsia-500'],
  ['from-rose-600 to-red-500'],
]

export default function HomeView({ setActiveView }) {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const mountedRef = useRef(false)

  useEffect(() => {
    mountedRef.current = true
    return () => { mountedRef.current = false }
  }, [])

  useEffect(() => {
    const loadData = async () => {
      try {
        const [cats, playlists] = await Promise.all([getCategories(), getPlaylists()])
        if (!mountedRef.current) return
        const sorted = [...cats].sort((a, b) => a.name.localeCompare(b.name))
        const mixed = playlists.find(p => p.id === 'mixed')
        if (mixed) {
          sorted.push({
            id: 'playlist-mixed',
            name: mixed.name,
            description: `${mixed.tracks.length} songs`,
            isPlaylist: true
          })
        }
        setCategories(sorted)
      } catch (err) {
        console.error('Failed to load:', err)
      } finally {
        if (mountedRef.current) setLoading(false)
      }
    }
    loadData()
  }, [])

  const totalSongs = categories.reduce((s, c) => s + (parseInt(c.description) || 0), 0)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-2xl accent-gradient flex items-center justify-center animate-pulse">
            <Disc3 size={24} className="text-white animate-spin-slow" />
          </div>
          <p className="text-hanger-muted text-sm">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="flex items-center gap-4 mb-6">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full glass-card">
          <Library size={13} className="text-white/60" />
          <span className="text-xs text-white/50">{categories.length} directors</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full glass-card">
          <Disc3 size={13} className="text-white/40" />
          <span className="text-xs text-white/50">{totalSongs} songs</span>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {categories.map((cat, idx) => {
          const [gradient] = CARD_GRADIATES[idx % CARD_GRADIATES.length]
          const isMixed = cat.isPlaylist
          return (
            <button
              key={cat.id}
              onClick={() => setActiveView(cat.id)}
              className="group text-left animate-fade-in"
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              <div className={`relative w-full aspect-square rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-md group-hover:shadow-xl group-hover:scale-[1.04] transition-all duration-300 overflow-hidden`}>
                {isMixed ? (
                  <ListMusic size={40} className="text-white/50 group-hover:text-white/80 group-hover:scale-110 transition-all duration-300" />
                ) : (
                  <Music size={40} className="text-white/50 group-hover:text-white/80 group-hover:scale-110 transition-all duration-300" />
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
              </div>
              <div className="mt-2 px-0.5">
                <p className="text-sm font-semibold text-hanger-text truncate group-hover:text-white transition-colors">{cat.name}</p>
                <p className="text-xs text-hanger-muted/50 mt-0.5">{cat.description}</p>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
