import { useState, useEffect } from 'react'
import { ArrowLeft, Play, Trash2, ListMusic, Disc3 } from 'lucide-react'
import { getPlaylist, deletePlaylist, removeTrackFromPlaylist } from '../utils/api'
import { usePlayer } from '../context/PlayerContext'
import SongCard from './SongCard'

export default function PlaylistView({ playlistId, setActiveView, refreshPlaylists }) {
  const [playlist, setPlaylist] = useState(null)
  const [loading, setLoading] = useState(true)
  const { playTrack, playPlaylist } = usePlayer()

  useEffect(() => { loadPlaylist() }, [playlistId])

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
    if (playlist?.tracks?.length) playPlaylist(playlist.tracks, 0)
  }

  const handlePlayTrack = (track, index) => playTrack(track, playlist.tracks, index)

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
        <Disc3 size={24} className="text-hanger-accent animate-spin" />
      </div>
    )
  }

  if (!playlist) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6">
        <ListMusic size={48} className="text-hanger-muted/20 mb-4" />
        <p className="text-hanger-muted">Playlist not found</p>
        <button onClick={() => setActiveView('home')} className="mt-4 text-sm text-hanger-accent hover:underline">
          Go home
        </button>
      </div>
    )
  }

  const tracks = playlist.tracks || []

  return (
    <div className="h-full overflow-y-auto animate-fade-in">
      <div className="relative">
        <div className="h-52 bg-gradient-to-b from-hanger-accent/15 via-hanger-accent2/5 to-hanger-bg flex items-end p-6">
          <button
            onClick={() => setActiveView('home')}
            className="absolute top-4 left-4 p-2 rounded-xl bg-black/40 text-white/80 hover:text-white hover:bg-black/60 transition-all backdrop-blur-sm"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="flex items-center gap-5">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-hanger-accent to-hanger-accent2 flex items-center justify-center shadow-2xl shadow-hanger-accent/20">
              <ListMusic size={38} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold uppercase tracking-widest text-hanger-muted/60">Playlist</p>
              <h1 className="text-2xl font-bold text-white mt-1 truncate">{playlist.name}</h1>
              {playlist.description && (
                <p className="text-sm text-hanger-muted/60 mt-0.5 truncate">{playlist.description}</p>
              )}
              <p className="text-sm text-hanger-muted/60 mt-1">{tracks.length} track{tracks.length !== 1 ? 's' : ''}</p>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 flex items-center gap-3">
          {tracks.length > 0 && (
            <button
              onClick={handlePlayAll}
              className="flex items-center gap-2 px-6 py-3 accent-gradient text-white font-semibold rounded-full hover:scale-105 transition-transform shadow-lg shadow-hanger-accent/20"
            >
              <Play size={16} fill="white" />
              Play All
            </button>
          )}
          {!playlist.isBuiltIn && (
            <button
              onClick={handleDeletePlaylist}
              className="p-3 rounded-xl text-hanger-muted/40 hover:text-red-400 hover:bg-hanger-hover/40 transition-all"
            >
              <Trash2 size={15} />
            </button>
          )}
        </div>

        <div className="px-6 pb-20 space-y-0.5">
          {tracks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-hanger-muted">
              <ListMusic size={48} className="mb-4 opacity-20" />
              <p className="text-sm font-medium">This playlist is empty</p>
              <p className="text-xs mt-1 text-hanger-muted/40">Add songs from any artist or search page</p>
            </div>
          ) : (
            tracks.map((track, idx) => (
              <SongCard
                key={track.id}
                track={track}
                index={idx}
                onPlay={() => handlePlayTrack(track, idx)}
                isInPlaylist={!playlist.isBuiltIn}
                onRemove={!playlist.isBuiltIn ? handleRemoveTrack : undefined}
              />
            ))
          )}
        </div>
      </div>
    </div>
  )
}
