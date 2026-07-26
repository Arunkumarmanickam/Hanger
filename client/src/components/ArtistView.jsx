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

  useEffect(() => { loadCategory() }, [categoryId])

  const loadCategory = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getCategoryTracks(categoryId)
      setCategory(data.category)
      setTracks(data.tracks || [])
    } catch (err) {
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
          <div className="w-10 h-10 rounded-2xl accent-gradient flex items-center justify-center animate-pulse">
            <Disc3 size={20} className="text-white animate-spin-slow" />
          </div>
          <p className="text-hanger-muted text-sm">Loading...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6">
        <p className="text-hanger-muted text-sm mb-4">{error}</p>
        <button onClick={loadCategory} className="px-5 py-2 text-sm font-medium text-white accent-gradient rounded-xl hover:opacity-90 transition-all">Retry</button>
      </div>
    )
  }

  const trackCount = tracks.length

  return (
    <div className="h-full overflow-y-auto animate-fade-in">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-hanger-accent/20 via-hanger-accent2/10 to-hanger-bg" />
        <div className="absolute inset-0 bg-gradient-to-t from-hanger-bg via-transparent to-transparent" />
        <div className="relative px-6 pt-6 pb-10">
          <button
            onClick={() => setActiveView('home')}
            className="mb-4 p-2 rounded-xl bg-black/30 text-white/70 hover:text-white hover:bg-black/50 transition-all backdrop-blur-sm inline-flex"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="flex items-end gap-5">
            <div className="w-28 h-28 rounded-2xl accent-gradient flex items-center justify-center shadow-2xl shadow-hanger-accent/20 flex-shrink-0">
              <Music size={52} className="text-white" />
            </div>
            <div className="pb-1">
              <p className="text-xs font-semibold uppercase tracking-widest text-hanger-muted/60">Director</p>
              <h1 className="text-3xl font-bold text-white mt-0.5">{category?.name || 'Unknown'}</h1>
              <p className="text-sm text-hanger-muted/60 mt-1">{trackCount} track{trackCount !== 1 ? 's' : ''}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-4 flex items-center gap-3 relative z-10 -mt-3">
        {trackCount > 0 && (
          <button
            onClick={handlePlayAll}
            className="flex items-center gap-2 px-6 py-2.5 accent-gradient text-white font-semibold rounded-full hover:scale-105 transition-transform shadow-lg shadow-hanger-accent/20"
          >
            <Play size={15} fill="white" />
            Play All
          </button>
        )}
      </div>

      <div className="px-6 pb-24 space-y-0.5">
        {tracks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-hanger-muted">
            <Disc3 size={40} className="mb-3 opacity-20" />
            <p className="text-sm">No tracks found</p>
          </div>
        ) : (
          tracks.map((track, idx) => (
            <SongCard key={track.id} track={track} index={idx} onPlay={() => handlePlayTrack(track, idx)} />
          ))
        )}
      </div>
    </div>
  )
}
