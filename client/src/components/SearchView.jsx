import { useState, useRef, useEffect } from 'react'
import { Search, X, Loader2 } from 'lucide-react'
import { searchTracks } from '../utils/api'
import { usePlayer } from '../context/PlayerContext'
import SongCard from './SongCard'

export default function SearchView() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const inputRef = useRef(null)
  const debounceRef = useRef(null)
  const { playTrack } = usePlayer()

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const doSearch = async (q) => {
    if (!q.trim()) {
      setResults([])
      setSearched(false)
      return
    }
    setLoading(true)
    setSearched(true)
    try {
      const tracks = await searchTracks(q)
      setResults(tracks)
    } catch (err) {
      console.error('Search failed:', err)
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const val = e.target.value
    setQuery(val)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => doSearch(val), 400)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (debounceRef.current) clearTimeout(debounceRef.current)
      doSearch(query)
    }
  }

  const playFromResults = async (track, index) => {
    await playTrack(track, results, index)
  }

  const suggestions = [
    'Anirudh Ravichander', 'Ilayaraja', 'SPB', 'Udit Narayan',
    'Deva', 'Badaga', 'Sai Abhyankkar', 'Tamil Hits',
  ]

  return (
    <div className="h-full overflow-y-auto p-6 animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-hanger-text mb-5">Search</h1>
        <div className="relative max-w-xl">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-hanger-muted/50" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="What do you want to listen to?"
            className="w-full pl-10 pr-10 py-3 bg-hanger-card/50 border border-hanger-border/50 rounded-2xl text-sm text-hanger-text placeholder-hanger-muted/40 focus:outline-none focus:border-hanger-accent/50 focus:ring-1 focus:ring-hanger-accent/20 transition-all"
          />
          {query && (
            <button
              onClick={() => { setQuery(''); setResults([]); setSearched(false) }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-hanger-muted/50 hover:text-hanger-text"
            >
              <X size={15} />
            </button>
          )}
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 size={22} className="text-hanger-accent animate-spin" />
        </div>
      )}

      {!searched && !loading && (
        <div>
          <h2 className="text-xs font-semibold text-hanger-muted/50 uppercase tracking-widest mb-3">
            Suggestions
          </h2>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => { setQuery(s); doSearch(s) }}
                className="px-4 py-2 text-sm text-hanger-text/80 bg-hanger-card/50 border border-hanger-border/40 rounded-xl hover:border-hanger-accent/30 hover:bg-hanger-accent/5 transition-all"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {searched && !loading && results.length > 0 && (
        <div>
          <p className="text-xs text-hanger-muted/50 mb-3">
            Found {results.length} result{results.length !== 1 ? 's' : ''}
          </p>
          <div className="space-y-0.5">
            {results.map((track, idx) => (
              <SongCard
                key={track.id}
                track={track}
                index={idx}
                onPlay={() => playFromResults(track, idx)}
              />
            ))}
          </div>
        </div>
      )}

      {searched && !loading && results.length === 0 && query && (
        <div className="flex flex-col items-center justify-center py-16 text-hanger-muted">
          <Search size={40} className="mb-3 opacity-20" />
          <p className="text-sm">No results for "{query}"</p>
          <p className="text-xs mt-1 text-hanger-muted/40">Try different keywords</p>
        </div>
      )}
    </div>
  )
}
