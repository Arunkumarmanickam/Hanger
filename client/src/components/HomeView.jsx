import { useState, useEffect, useRef } from 'react'
import { Disc3, RefreshCw, Music } from 'lucide-react'
import { getCategories } from '../utils/api'

// Card gradients for each director
const CARD_GRADIATES = [
  'from-purple-600 to-pink-500',
  'from-blue-600 to-teal-400',
  'from-orange-500 to-red-500',
  'from-green-500 to-emerald-700',
  'from-rose-500 to-purple-600',
  'from-cyan-500 to-blue-600',
  'from-yellow-500 to-orange-600',
  'from-pink-500 to-rose-600',
  'from-teal-500 to-green-600',
  'from-indigo-500 to-purple-600',
  'from-red-500 to-orange-500',
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
        <div className="flex flex-col items-center gap-3">
          <RefreshCw size={32} className="text-hanger-accent animate-spin" />
          <p className="text-hanger-muted text-sm">Loading your music...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-hanger-text">
          Hanger
        </h1>
        <p className="text-sm text-hanger-muted mt-1">
          Your offline music collection
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {categories.map((cat, idx) => (
          <button
            key={cat.id}
            onClick={() => setActiveView(cat.id)}
            className="group text-left"
          >
            <div className={`relative w-full aspect-square rounded-2xl bg-gradient-to-br ${CARD_GRADIATES[idx % CARD_GRADIATES.length]} flex items-center justify-center shadow-lg hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 overflow-hidden`}>
              <Music size={48} className="text-white/80 group-hover:scale-110 transition-transform duration-300" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
            </div>
            <div className="mt-2 px-0.5">
              <p className="text-sm font-semibold text-hanger-text truncate">
                {cat.name}
              </p>
              <p className="text-xs text-hanger-muted">
                {cat.description}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
