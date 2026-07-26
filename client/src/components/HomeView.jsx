import { useState, useEffect, useRef } from 'react'
import { Play, Disc3, Music, TrendingUp, Library, Headphones } from 'lucide-react'
import { getCategories, getCategoryTracks } from '../utils/api'
import { usePlayer } from '../context/PlayerContext'

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

const gradientRow = 'from-hanger-accent/20 via-hanger-accent2/10 to-hanger-bg'

export default function HomeView({ setActiveView }) {
  const [categories, setCategories] = useState([])
  const [heroCategory, setHeroCategory] = useState(null)
  const [heroTracks, setHeroTracks] = useState([])
  const [loading, setLoading] = useState(true)
  const mountedRef = useRef(false)
  const { playPlaylist } = usePlayer()

  useEffect(() => {
    mountedRef.current = true
    return () => { mountedRef.current = false }
  }, [])

  useEffect(() => { loadData() }, [])

  const loadData = async () => {
    try {
      const cats = await getCategories()
      if (!mountedRef.current) return

      const sorted = [...cats].sort((a, b) => {
        const aCount = parseInt(a.description) || 0
        const bCount = parseInt(b.description) || 0
        return bCount - aCount
      })
      setCategories(sorted)

      if (sorted.length > 0) {
        const hero = sorted[0]
        const data = await getCategoryTracks(hero.id)
        if (mountedRef.current) {
          setHeroCategory(hero)
          setHeroTracks(data.tracks || [])
        }
      }
    } catch (err) {
      console.error('Failed to load:', err)
    } finally {
      if (mountedRef.current) setLoading(false)
    }
  }

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
    <div className="h-full overflow-y-auto">
      {heroCategory && (
        <section className="relative overflow-hidden">
          <div className={`absolute inset-0 bg-gradient-to-br ${gradientRow}`} />
          <div className="absolute inset-0 bg-gradient-to-t from-hanger-bg via-transparent to-transparent" />
          <div className="relative px-6 pt-8 pb-12">
            <div className="flex items-center gap-2 text-hanger-accent/70 mb-4">
              <Headphones size={14} />
              <span className="text-xs font-semibold uppercase tracking-widest">Most Songs</span>
            </div>
            <div className="flex items-end gap-6">
              <div className="w-36 h-36 rounded-3xl accent-gradient flex items-center justify-center shadow-2xl shadow-hanger-accent/20 flex-shrink-0">
                <Music size={64} className="text-white/80" />
              </div>
              <div className="flex-1 min-w-0 pb-1">
                <h2 className="text-4xl font-bold text-white tracking-tight">{heroCategory.name}</h2>
                <p className="text-sm text-hanger-muted/60 mt-1.5">{heroCategory.description}</p>
                <button
                  onClick={() => { if (heroTracks.length) playPlaylist(heroTracks, 0) }}
                  className="mt-4 flex items-center gap-2 px-6 py-2.5 accent-gradient text-white font-semibold rounded-full hover:scale-105 transition-transform shadow-lg shadow-hanger-accent/20"
                >
                  <Play size={15} fill="white" />
                  Play All
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="px-6 pb-8 -mt-4 relative z-10">
        <div className="flex items-center gap-4 mb-5">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-hanger-card/50 border border-hanger-border/20">
            <Library size={13} className="text-hanger-accent" />
            <span className="text-xs text-hanger-muted/80">{categories.length} directors</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-hanger-card/50 border border-hanger-border/20">
            <Disc3 size={13} className="text-hanger-accent2" />
            <span className="text-xs text-hanger-muted/80">{totalSongs} songs</span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {categories.map((cat, idx) => {
            const [gradient] = CARD_GRADIATES[idx % CARD_GRADIATES.length]
            return (
              <button
                key={cat.id}
                onClick={() => setActiveView(cat.id)}
                className="group text-left animate-fade-in"
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                <div className={`relative w-full aspect-square rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-md group-hover:shadow-xl group-hover:scale-[1.04] transition-all duration-300 overflow-hidden`}>
                  <Music size={40} className="text-white/50 group-hover:text-white/80 group-hover:scale-110 transition-all duration-300" />
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
      </section>
    </div>
  )
}
