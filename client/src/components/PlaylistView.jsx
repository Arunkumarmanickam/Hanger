import { useState, useEffect } from 'react'
import { ArrowLeft, Play, Trash2, ListMusic, RefreshCw } from 'lucide-react'
import { getPlaylist, deletePlaylist, removeTrackFromPlaylist } from '../utils/api'
import { usePlayer } from '../context/PlayerContext'
import SongCard from './SongCard'

export default function PlaylistView({ playlistId, setActiveView, refreshPlaylists }) {
  const [playlist, setPlaylist] = useState(null)
  const [loading, setLoading] = useState(true)
  const { playTrack, playPlaylist } = usePlayer()

  useEffect(() => {
    loadPlaylist()
  }, [playlistId])

  const loadPlaylist = async () => {
    setLoading(true)
    try {
      const data = await getPlaylist(playlistId)
      setPlaylist(data)
    } catch (err) {
      console.error('Failed to load playlist:', err)
    } finally {
      setLoading(false)
    }
  }

  const handlePlayAll = () => {
    if (playlist?.tracks?.length) {
      playPlaylist(playlist.tracks, 0)
    }
  }

  const handlePlayTrack = (track, index) => {
    playTrack(track, playlist.tracks, index)
  }

  const handleRemoveTrack = async (trackId) => {
    try {
      await removeTrackFromPlaylist(playlistId, trackId)
      loadPlaylist()
      refreshPlaylists()
    } catch (err) {
      console.error('Failed to remove track:', err)
    }
  }

  const handleDeletePlaylist = async () => {
    try {
      await deletePlaylist(playlistId)
      refreshPlaylists()
      setActiveView('home')
    } catch (err) {
      console.error('Failed to delete playlist:', err)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <RefreshCw size={32} className="text-hanger-accent animate-spin" />
      </div>
    )
  }

  if (!playlist) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6">
        <ListMusic size={48} className="text-hanger-muted/30 mb-4" />
        <p className="text-hanger-muted">Playlist not found</p>
        <button
          onClick={() => setActiveView('home')}
          className="mt-4 text-sm text-hanger-accent hover:underline"
        >
          Go home
        </button>
      </div>
    )
  }

  const tracks = playlist.tracks || []

  return (
    <div className="h-full overflow-y-auto">
      <div className="relative">
        <div className="h-48 bg-gradient-to-b from-hanger-accent2/20 via-hanger-accent2/5 to-hanger-bg flex items-end p-6">
          <button
            onClick={() => setActiveView('home')}
            className="absolute top-4 left-4 p-2 rounded-full bg-black/30 text-white hover:bg-black/50 transition-all"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="flex items-center gap-5">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-hanger-accent to-hanger-accent2 flex items-center justify-center shadow-2xl">
              <ListMusic size={40} className="text-white" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-hanger-muted">
                Playlist
              </p>
              <h1 className="text-3xl font-bold text-hanger-text mt-1">
                {playlist.name}
              </h1>
              {playlist.description && (
                <p className="text-sm text-hanger-muted mt-1">{playlist.description}</p>
              )}
              <p className="text-sm text-hanger-muted mt-1">
                {tracks.length} track{tracks.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 flex items-center gap-3">
          {tracks.length > 0 && (
            <button
              onClick={handlePlayAll}
              className="flex items-center gap-2 px-6 py-3 accent-gradient text-black font-semibold rounded-full hover:scale-105 transition-transform neon-glow"
            >
              <Play size={18} fill="black" />
              Play All
            </button>
          )}
          <button
            onClick={handleDeletePlaylist}
            className="p-3 rounded-full text-hanger-muted hover:text-red-400 hover:bg-hanger-card/50 transition-all"
            title="Delete Playlist"
          >
            <Trash2 size={16} />
          </button>
        </div>

        <div className="px-6 pb-20 space-y-0.5">
          {tracks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-hanger-muted">
              <ListMusic size={48} className="mb-4 opacity-20" />
              <p className="text-sm font-medium">This playlist is empty</p>
              <p className="text-xs mt-1 opacity-60">
                Add songs from any artist or search page
              </p>
            </div>
          ) : (
            tracks.map((track, idx) => (
              <SongCard
                key={track.id}
                track={track}
                onPlay={() => handlePlayTrack(track, idx)}
                isInPlaylist
                onRemove={handleRemoveTrack}
              />
            ))
          )}
        </div>
      </div>
    </div>
  )
}
