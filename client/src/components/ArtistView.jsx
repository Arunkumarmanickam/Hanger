import { useState, useEffect } from 'react'
import { ArrowLeft, RefreshCw, Play, Disc3 } from 'lucide-react'
import { getCategoryTracks } from '../utils/api'
import { usePlayer } from '../context/PlayerContext'
import SongCard from './SongCard'

export default function ArtistView({ categoryId, setActiveView }) {
  const [category, setCategory] = useState(null)
  const [tracks, setTracks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { playTrack, playPlaylist } = usePlayer()

  useEffect(() => {
    loadCategory()
  }, [categoryId])

  const loadCategory = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getCategoryTracks(categoryId)
      setCategory(data.category)
      setTracks(data.tracks || [])
    } catch (err) {
      console.error('Failed to load category:', err)
      setError('Failed to load tracks. The server might be starting up.')
    } finally {
      setLoading(false)
    }
  }

  const handlePlayAll = () => {
    playPlaylist(tracks, 0)
  }

  const handlePlayTrack = (track, index) => {
    playTrack(track, tracks, index)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw size={32} className="text-hanger-accent animate-spin" />
          <p className="text-hanger-muted text-sm">Finding tracks...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6">
        <div className="w-20 h-20 rounded-full bg-hanger-card flex items-center justify-center mb-4">
          <Disc3 size={36} className="text-hanger-muted" />
        </div>
        <p className="text-hanger-muted text-sm mb-4">{error}</p>
        <button
          onClick={loadCategory}
          className="px-4 py-2 text-sm font-medium text-black accent-gradient rounded-lg hover:opacity-90 transition-all"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="relative">
        <div className="h-48 bg-gradient-to-b from-hanger-accent/20 via-hanger-accent/5 to-hanger-bg flex items-end p-6">
          <button
            onClick={() => setActiveView('home')}
            className="absolute top-4 left-4 p-2 rounded-full bg-black/30 text-white hover:bg-black/50 transition-all"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="flex items-center gap-5">
            <div className="w-24 h-24 rounded-2xl accent-gradient flex items-center justify-center shadow-2xl neon-glow">
              <Disc3 size={44} className="text-white" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-hanger-muted">
                {category?.description?.includes('Badaga') ? 'Culture' : 'Artist'}
              </p>
              <h1 className="text-3xl font-bold text-hanger-text mt-1">
                {category?.name || 'Unknown'}
              </h1>
              <p className="text-sm text-hanger-muted mt-1">
                {tracks.length} track{tracks.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </div>

        <div className="px-6 py-4">
          <button
            onClick={handlePlayAll}
            className="flex items-center gap-2 px-6 py-3 accent-gradient text-black font-semibold rounded-full hover:scale-105 transition-transform neon-glow"
          >
            <Play size={18} fill="black" />
            Play All
          </button>
          <button
            onClick={loadCategory}
            className="ml-3 p-3 rounded-full text-hanger-muted hover:text-hanger-accent hover:bg-hanger-card transition-all"
            title="Refresh"
          >
            <RefreshCw size={16} />
          </button>
        </div>

        <div className="px-6 pb-6 space-y-0.5">
          {tracks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-hanger-muted">
              <Disc3 size={40} className="mb-3 opacity-30" />
              <p className="text-sm">No tracks found yet</p>
              <button
                onClick={loadCategory}
                className="mt-3 text-xs text-hanger-accent hover:underline"
              >
                Try refreshing
              </button>
            </div>
          ) : (
            tracks.map((track, idx) => (
              <SongCard
                key={track.id}
                track={track}
                onPlay={() => handlePlayTrack(track, idx)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  )
}
