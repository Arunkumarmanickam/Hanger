import { useState, useRef, useEffect } from 'react'
import {
  Play, Pause, SkipBack, SkipForward, Volume2, Volume1, VolumeX,
  Heart, Shuffle, Repeat, Repeat1, ListMusic,
} from 'lucide-react'
import { usePlayer } from '../context/PlayerContext'
import { getPlaylists, addTrackToPlaylist, getThumbnailUrl } from '../utils/api'

export default function PlayerBar({ refreshPlaylists }) {
  const {
    currentTrack, isPlaying, progress, duration, volume,
    shuffle, repeat, likedTracks,
    togglePlay, seek, setVolume, playNext, playPrev, toggleLike,
    toggleShuffle, cycleRepeat,
  } = usePlayer()

  const [showPlaylists, setShowPlaylists] = useState(false)
  const [playlists, setPlaylists] = useState([])
  const [showVolume, setShowVolume] = useState(false)
  const [localVolume, setLocalVolume] = useState(volume)
  const progressRef = useRef(null)

  useEffect(() => {
    setLocalVolume(volume)
  }, [volume])

  const handleProgressClick = (e) => {
    const rect = progressRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const pct = x / rect.width
    seek(pct * duration)
  }

  const handleVolumeChange = (e) => {
    const val = parseFloat(e.target.value)
    setLocalVolume(val)
    setVolume(val)
  }

  const formatTime = (t) => {
    if (!t || isNaN(t)) return '0:00'
    const m = Math.floor(t / 60)
    const s = Math.floor(t % 60)
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  const progressPct = duration > 0 ? (progress / duration) * 100 : 0

  const handleAddToPlaylist = async (pl) => {
    try {
      await addTrackToPlaylist(pl.id, currentTrack)
      refreshPlaylists()
      setShowPlaylists(false)
    } catch (err) {
      console.error('Failed to add track:', err)
    }
  }

  const openPlaylistMenu = async () => {
    try {
      const data = await getPlaylists()
      setPlaylists(data)
      setShowPlaylists(!showPlaylists)
    } catch (err) {
      console.error('Failed to load playlists:', err)
    }
  }

  if (!currentTrack) {
    return (
      <footer className="h-20 glass border-t border-hanger-border flex items-center px-4">
        <div className="flex items-center gap-3 opacity-40">
          <div className="w-12 h-12 rounded-md bg-hanger-card flex items-center justify-center">
            <ListMusic size={20} className="text-hanger-muted" />
          </div>
          <div>
            <p className="text-sm font-medium">No track selected</p>
            <p className="text-xs text-hanger-muted">Browse and play something</p>
          </div>
        </div>
      </footer>
    )
  }

  return (
    <footer className="h-20 glass border-t border-hanger-border flex items-center px-4 relative z-50">
      <div className="flex items-center gap-3 w-[280px]">
        <div className="relative">
          <img
            src={getThumbnailUrl(currentTrack)}
            alt={currentTrack.title}
            className={`w-12 h-12 rounded-md object-cover ${isPlaying ? 'album-spin' : ''}`}
            onError={(e) => { e.target.src = `https://img.youtube.com/vi/${currentTrack.id}/hqdefault.jpg` }}
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate text-hanger-text">
            {currentTrack.title}
          </p>
          <p className="text-xs text-hanger-muted truncate">
            {currentTrack.artist}
          </p>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => toggleLike(currentTrack.id)}
            className={`p-1.5 rounded-full transition-all ${
              likedTracks.includes(currentTrack.id)
                ? 'text-hanger-accent'
                : 'text-hanger-muted hover:text-hanger-text'
            }`}
          >
            <Heart size={16} fill={likedTracks.includes(currentTrack.id) ? 'currentColor' : 'none'} />
          </button>
          <div className="relative">
            <button
              onClick={openPlaylistMenu}
              className="p-1.5 rounded-full text-hanger-muted hover:text-hanger-text transition-all"
              title="Add to Playlist"
            >
              <ListMusic size={16} />
            </button>
            {showPlaylists && (
              <div className="absolute bottom-full right-0 mb-2 w-52 glass-light rounded-lg shadow-xl border border-hanger-border py-1 max-h-48 overflow-y-auto">
                <p className="px-3 py-1.5 text-xs font-semibold text-hanger-muted uppercase">
                  Add to Playlist
                </p>
                {playlists.length === 0 && (
                  <p className="px-3 py-2 text-xs text-hanger-muted/50 italic">
                    No playlists
                  </p>
                )}
                {playlists.map((pl) => (
                  <button
                    key={pl.id}
                    onClick={() => handleAddToPlaylist(pl)}
                    className="w-full text-left px-3 py-2 text-sm text-hanger-text hover:bg-hanger-hover transition-all"
                  >
                    {pl.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center gap-1">
        <div className="flex items-center gap-3">
          <button
            onClick={toggleShuffle}
            className={`p-1 rounded-full transition-all ${
              shuffle ? 'text-hanger-accent' : 'text-hanger-muted hover:text-hanger-text'
            }`}
            title="Shuffle"
          >
            <Shuffle size={16} />
          </button>
          <button
            onClick={playPrev}
            className="p-1 rounded-full text-hanger-muted hover:text-hanger-text transition-all"
            title="Previous"
          >
            <SkipBack size={18} />
          </button>
          <button
            onClick={togglePlay}
            className="p-2 rounded-full accent-gradient text-white hover:scale-105 transition-transform neon-glow"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause size={18} fill="white" /> : <Play size={18} fill="white" />}
          </button>
          <button
            onClick={playNext}
            className="p-1 rounded-full text-hanger-muted hover:text-hanger-text transition-all"
            title="Next"
          >
            <SkipForward size={18} />
          </button>
          <button
            onClick={cycleRepeat}
            className={`p-1 rounded-full transition-all ${
              repeat !== 'off' ? 'text-hanger-accent' : 'text-hanger-muted hover:text-hanger-text'
            }`}
            title={`Repeat: ${repeat}`}
          >
            {repeat === 'one' ? <Repeat1 size={16} /> : <Repeat size={16} />}
          </button>
        </div>
        <div className="flex items-center gap-2 w-full max-w-lg">
          <span className="text-xs text-hanger-muted w-8 text-right tabular-nums">
            {formatTime(progress)}
          </span>
          <div
            ref={progressRef}
            className="flex-1 h-1.5 bg-hanger-border rounded-full cursor-pointer group"
            onClick={handleProgressClick}
          >
            <div
              className="h-full bg-gradient-to-r from-hanger-accent to-hanger-accent2 rounded-full relative"
              style={{ width: `${progressPct}%` }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white opacity-0 group-hover:opacity-100 transition-opacity shadow-lg" />
            </div>
          </div>
          <span className="text-xs text-hanger-muted w-8 tabular-nums">
            {formatTime(duration)}
          </span>
        </div>
      </div>

      <div className="w-[280px] flex justify-end items-center gap-2">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setShowVolume(!showVolume)}
            className="p-1.5 rounded-full text-hanger-muted hover:text-hanger-text transition-all"
          >
            {localVolume === 0 ? <VolumeX size={16} /> : localVolume < 0.5 ? <Volume1 size={16} /> : <Volume2 size={16} />}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={localVolume}
            onChange={handleVolumeChange}
            className="w-20 player-range accent-hanger-accent"
          />
        </div>
      </div>
    </footer>
  )
}
