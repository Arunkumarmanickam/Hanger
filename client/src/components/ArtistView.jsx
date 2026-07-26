import { useState, useEffect } from 'react'
import { ArrowLeft, Play, Disc3, Music } from 'lucide-react'
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
      setError('Failed to load tracks.')
    } finally {
      setLoading(false)
    }
  }

  const handlePlayAll = () => playPlaylist(tracks, 0)
  const handlePlayTrack = (track, index) => playTrack(track, tracks, index)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-2xl accent-gradient flex items-center justify-center animate-pulse">
            <Disc3 size={24} className="text-white animate-spin-slow" />
          </div>
          <p className="text-hanger-muted text-sm">Finding tracks...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6">
        <div className="w-20 h-20 rounded-full bg-hanger-card flex items-center justify-center mb-4">
          <Disc3 size={36} className="text-hanger-muted/50" />
        </div>
        <p className="text-hanger-muted text-sm mb-4">{error}</p>
        <button onClick={loadCategory} className="px-5 py-2 text-sm font-medium text-white accent-gradient rounded-xl hover:opacity-90 transition-all">
          Retry
        </button>
      </div>
    )
  }

  const trackCount = tracks.length

  return (
    <div className="h-full overflow-y-auto animate-fade-in">
      <div className="relative">
        <div className="h-56 bg-gradient-to-b from-hanger-accent/15 via-hanger-accent2/5 to-hanger-bg flex items-end p-6">
          <button
            onClick={() => setActiveView('home')}
            className="absolute top-4 left-4 p-2 rounded-xl bg-black/40 text-white/80 hover:text-white hover:bg-black/60 transition-all backdrop-blur-sm"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="flex items-center gap-5">
            <div className="w-28 h-28 rounded-2xl accent-gradient flex items-center justify-center shadow-2xl shadow-hanger-accent/20">
              <Music size={52} className="text-white" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-hanger-muted/60">
                Director
              </p>
              <h1 className="text-3xl font-bold text-white mt-1">{category?.name || 'Unknown'}</h1>
              <p className="text-sm text-hanger-muted/70 mt-1">{trackCount} track{trackCount !== 1 ? 's' : ''}</p>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 flex items-center gap-3">
          <button
            onClick={handlePlayAll}
            className="flex items-center gap-2 px-6 py-3 accent-gradient text-white font-semibold rounded-full hover:scale-105 transition-transform shadow-lg shadow-hanger-accent/20"
          >
            <Play size={16} fill="white" />
            Play All
          </button>
        </div>

        <div className="px-6 pb-6 space-y-0.5">
          {tracks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-hanger-muted">
              <Disc3 size={40} className="mb-3 opacity-20" />
              <p className="text-sm">No tracks found</p>
              <button onClick={loadCategory} className="mt-3 text-xs text-hanger-accent hover:underline">
                Refresh
              </button>
            </div>
          ) : (
            tracks.map((track, idx) => (
              <SongCard
                key={track.id}
                track={track}
                index={idx}
                onPlay={() => handlePlayTrack(track, idx)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  )
}
