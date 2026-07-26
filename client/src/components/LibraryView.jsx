import { useState, useEffect } from 'react'
import { ListMusic, Heart, Library, Disc3 } from 'lucide-react'
import { getPlaylists } from '../utils/api'
import { usePlayer } from '../context/PlayerContext'

export default function LibraryView({ setActiveView }) {
  const [playlists, setPlaylists] = useState([])
  const [loading, setLoading] = useState(true)
  const { likedTracks } = usePlayer()

  useEffect(() => {
    loadPlaylists()
  }, [])

  const loadPlaylists = async () => {
    setLoading(true)
    try {
      const data = await getPlaylists()
      setPlaylists(data)
    } catch (err) {
      console.error('Failed to load playlists:', err)
    } finally {
      setLoading(false)
    }
  }

  const totalTracks = playlists.reduce((sum, pl) => sum + pl.tracks.length, 0)

  return (
    <div className="h-full overflow-y-auto p-6 animate-fade-in">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl accent-gradient flex items-center justify-center shadow-lg shadow-hanger-accent/20">
            <Library size={20} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-hanger-text">Your Library</h1>
        </div>
        <p className="text-sm text-hanger-muted/60 ml-[52px]">
          {playlists.length} playlist{playlists.length !== 1 ? 's' : ''}
        </p>
      </div>

      <div className="mb-8">
        <div
          className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-red-500/10 to-pink-500/5 border border-red-500/10 hover:border-red-500/20 transition-all cursor-pointer group"
          onClick={() => {}}
        >
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
            <Heart size={24} className="text-white" fill="white" />
          </div>
          <div>
            <p className="font-semibold text-hanger-text">Liked Songs</p>
            <p className="text-xs text-hanger-muted/60 mt-0.5">{likedTracks.length} liked track{likedTracks.length !== 1 ? 's' : ''}</p>
          </div>
        </div>
      </div>

      <h2 className="text-xs font-semibold text-hanger-muted/50 uppercase tracking-widest mb-3">
        Your Playlists
      </h2>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Disc3 size={22} className="text-hanger-muted/40 animate-spin" />
        </div>
      ) : playlists.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-hanger-muted">
          <ListMusic size={40} className="mb-3 opacity-20" />
          <p className="text-sm">No playlists yet</p>
          <p className="text-xs mt-1 text-hanger-muted/40">Create one from the sidebar</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {playlists.map((pl) => (
            <div
              key={pl.id}
              onClick={() => setActiveView(`playlist-${pl.id}`)}
              className="flex items-center gap-4 p-4 rounded-2xl bg-hanger-card/30 border border-hanger-border/30 hover:bg-hanger-card/50 hover:border-hanger-accent/20 transition-all cursor-pointer group"
            >
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-hanger-accent/20 to-hanger-accent2/20 flex items-center justify-center group-hover:scale-105 transition-transform">
                <ListMusic size={24} className="text-hanger-accent/80" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-hanger-text truncate">{pl.name}</p>
                {pl.description && (
                  <p className="text-xs text-hanger-muted/50 truncate mt-0.5">{pl.description}</p>
                )}
                <p className="text-xs text-hanger-muted/40 mt-0.5">{pl.tracks.length} track{pl.tracks.length !== 1 ? 's' : ''}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
