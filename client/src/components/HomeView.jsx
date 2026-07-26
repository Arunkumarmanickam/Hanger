import { useState, useEffect, useRef } from 'react'
import { Disc3, Music } from 'lucide-react'
import { getCategories } from '../utils/api'

const CARD_GRADIATES = [
  ['from-rose-600 to-pink-500', 'via-pink-400/20'],
  ['from-violet-600 to-purple-500', 'via-purple-400/20'],
  ['from-blue-600 to-cyan-500', 'via-blue-400/20'],
  ['from-amber-600 to-orange-500', 'via-orange-400/20'],
  ['from-emerald-600 to-teal-500', 'via-teal-400/20'],
  ['from-fuchsia-600 to-pink-500', 'via-fuchsia-400/20'],
  ['from-indigo-600 to-blue-500', 'via-indigo-400/20'],
  ['from-rose-600 to-red-500', 'via-red-400/20'],
  ['from-teal-600 to-emerald-500', 'via-emerald-400/20'],
  ['from-orange-600 to-amber-500', 'via-amber-400/20'],
  ['from-purple-600 to-fuchsia-500', 'via-fuchsia-400/20'],
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
    loadCategories()
  }, [])

  const loadCategories = async () => {
    try {
      const cats = await getCategories()
      if (!mountedRef.current) return
      setCategories(cats)
    } catch (err) {
      console.error('Failed to load categories:', err)
    } finally {
      if (mountedRef.current) setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-2xl accent-gradient flex items-center justify-center animate-pulse">
            <Disc3 size={24} className="text-white animate-spin-slow" />
          </div>
          <p className="text-hanger-muted text-sm">Loading your music...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-6 pb-4">
        <h1 className="text-3xl font-bold text-hanger-text tracking-tight">
          Hanger
        </h1>
        <p className="text-sm text-hanger-muted/70 mt-1">
          Your curated music collection
        </p>
      </div>

      <div className="px-6 pb-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
          {categories.map((cat, idx) => {
            const [gradient, overlay] = CARD_GRADIATES[idx % CARD_GRADIATES.length]
            return (
              <button
                key={cat.id}
                onClick={() => setActiveView(cat.id)}
                className="group text-left animate-fade-in"
                style={{ animationDelay: `${idx * 60}ms` }}
              >
                <div className={`relative w-full aspect-square rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg group-hover:shadow-2xl group-hover:scale-[1.03] transition-all duration-400 overflow-hidden`}>
                  <div className={`absolute inset-0 bg-gradient-to-t from-black/40 ${overlay} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                  <Music size={48} className="text-white/60 group-hover:text-white/90 group-hover:scale-110 transition-all duration-300" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                </div>
                <div className="mt-2.5 px-0.5">
                  <p className="text-sm font-semibold text-hanger-text truncate group-hover:text-white transition-colors">
                    {cat.name}
                  </p>
                  <p className="text-xs text-hanger-muted/60 mt-0.5">{cat.description}</p>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
