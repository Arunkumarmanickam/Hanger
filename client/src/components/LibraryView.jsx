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
    <div className="h-full overflow-y-auto p-6">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-hanger-accent to-hanger-accent2 flex items-center justify-center">
            <Library size={20} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold">Your Library</h1>
        </div>
        <p className="text-sm text-hanger-muted ml-[52px]">
          {playlists.length} playlist{playlists.length !== 1 ? 's' : ''} &middot; {totalTracks} total tracks
        </p>
      </div>

      <div className="mb-6">
        <div className="flex items-center gap-3 p-4 rounded-xl bg-hanger-card/50 border border-hanger-border hover:border-hanger-accent/30 transition-all cursor-pointer"
          onClick={() => {}}
        >
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center">
            <Heart size={22} className="text-white" fill="white" />
          </div>
          <div>
            <p className="font-semibold text-hanger-text">Liked Songs</p>
            <p className="text-xs text-hanger-muted">{likedTracks.length} liked track{likedTracks.length !== 1 ? 's' : ''}</p>
          </div>
        </div>
      </div>

      <h2 className="text-sm font-semibold text-hanger-muted uppercase tracking-wider mb-3">
        Your Playlists
      </h2>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Disc3 size={24} className="text-hanger-muted animate-spin" />
        </div>
      ) : playlists.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-hanger-muted">
          <ListMusic size={40} className="mb-3 opacity-30" />
          <p className="text-sm">No playlists yet</p>
          <p className="text-xs mt-1 opacity-60">Create one from the sidebar</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {playlists.map((pl) => (
            <div
              key={pl.id}
              onClick={() => setActiveView(`playlist-${pl.id}`)}
              className="flex items-center gap-4 p-4 rounded-xl bg-hanger-card/30 border border-hanger-border hover:bg-hanger-card/70 hover:border-hanger-accent/20 transition-all cursor-pointer group"
            >
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-hanger-accent/30 to-hanger-accent2/30 flex items-center justify-center group-hover:scale-105 transition-transform">
                <ListMusic size={24} className="text-hanger-accent" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-hanger-text truncate">{pl.name}</p>
                {pl.description && (
                  <p className="text-xs text-hanger-muted truncate">{pl.description}</p>
                )}
                <p className="text-xs text-hanger-muted/60 mt-0.5">
                  {pl.tracks.length} track{pl.tracks.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
