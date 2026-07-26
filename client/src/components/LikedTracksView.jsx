import { useState, useEffect } from 'react'
import { ArrowLeft, Play, Heart, Disc3 } from 'lucide-react'
import { loadCatalog } from '../utils/api'
import { usePlayer } from '../context/PlayerContext'
import SongCard from './SongCard'

export default function LikedTracksView({ setActiveView }) {
  const [tracks, setTracks] = useState([])
  const [loading, setLoading] = useState(true)
  const { likedTracks, playTrack, playPlaylist } = usePlayer()

  useEffect(() => {
    const load = async () => {
      try {
        const data = await loadCatalog()
        const allTracks = []
        for (const cat of data.categories) {
          for (const t of (cat.tracks || [])) {
            if (likedTracks.includes(t.id)) {
              allTracks.push(t)
            }
          }
        }
        setTracks(allTracks)
      } catch (err) {
        console.error('Failed to load liked tracks:', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [likedTracks])

  const handlePlayAll = () => { if (tracks.length) playPlaylist(tracks, 0) }
  const handlePlayTrack = (track, index) => playTrack(track, tracks, index)

  return (
    <div className="h-full overflow-y-auto animate-fade-in">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 via-pink-500/10 to-hanger-bg" />
        <div className="absolute inset-0 bg-gradient-to-t from-hanger-bg via-transparent to-transparent" />
        <div className="relative px-6 pt-6 pb-10">
          <button
            onClick={() => setActiveView('library')}
            className="mb-4 p-2 rounded-xl bg-black/30 text-white/70 hover:text-white hover:bg-black/50 transition-all backdrop-blur-sm inline-flex"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="flex items-end gap-5">
            <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center shadow-2xl shadow-red-500/20 flex-shrink-0">
              <Heart size={52} className="text-white" fill="white" />
            </div>
            <div className="pb-1">
              <p className="text-xs font-semibold uppercase tracking-widest text-hanger-muted/60">Playlist</p>
              <h1 className="text-3xl font-bold text-white mt-0.5">Liked Songs</h1>
              <p className="text-sm text-hanger-muted/60 mt-1">{tracks.length} track{tracks.length !== 1 ? 's' : ''}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-4 flex items-center gap-3 relative z-10 -mt-3">
        {tracks.length > 0 && (
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
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Disc3 size={24} className="text-hanger-muted/40 animate-spin" />
          </div>
        ) : tracks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-hanger-muted">
            <Heart size={40} className="mb-3 opacity-20" />
            <p className="text-sm">No liked songs yet</p>
            <p className="text-xs mt-1 text-hanger-muted/40">Tap the heart icon on any song to add it here</p>
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
