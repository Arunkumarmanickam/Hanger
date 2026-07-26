import { useState, useRef, useEffect } from 'react'
import {
  Play, Pause, SkipBack, SkipForward, Volume2, Volume1, VolumeX,
  Heart, Shuffle, Repeat, Repeat1, ListMusic,
} from 'lucide-react'
import { usePlayer } from '../context/PlayerContext'
import { getPlaylists, addTrackToPlaylist } from '../utils/api'

export default function PlayerBar({ refreshPlaylists }) {
  const {
    currentTrack, isPlaying, progress, duration, volume,
    shuffle, repeat, likedTracks,
    togglePlay, seek, setVolume, playNext, playPrev, toggleLike,
    toggleShuffle, cycleRepeat,
  } = usePlayer()

  const [showPlaylists, setShowPlaylists] = useState(false)
  const [playlists, setPlaylists] = useState([])
  const [localVolume, setLocalVolume] = useState(volume)
  const [hoverPct, setHoverPct] = useState(null)
  const progressRef = useRef(null)

  useEffect(() => { setLocalVolume(volume) }, [volume])

  const handleProgressClick = (e) => {
    const rect = progressRef.current.getBoundingClientRect()
    seek(((e.clientX - rect.left) / rect.width) * duration)
  }

  const handleProgressMove = (e) => {
    const rect = progressRef.current.getBoundingClientRect()
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
    setHoverPct(pct)
  }

  const handleProgressLeave = () => setHoverPct(null)

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
      <div className="mx-4 mb-4 rounded-2xl glass border border-hanger-border/20 px-5 py-3">
        <div className="flex items-center gap-3 opacity-40">
          <div className="w-10 h-10 rounded-xl bg-hanger-card flex items-center justify-center">
            <ListMusic size={18} className="text-hanger-muted" />
          </div>
          <div>
            <p className="text-sm font-medium text-hanger-text">No track selected</p>
            <p className="text-xs text-hanger-muted/50">Browse and play something</p>
          </div>
        </div>
      </div>
    )
  }

  const VolIcon = localVolume === 0 ? VolumeX : localVolume < 0.5 ? Volume1 : Volume2

  return (
    <div className="mx-4 mb-4">
      <div className="rounded-2xl glass border border-hanger-border/20 shadow-2xl shadow-black/40">
        <div
          ref={progressRef}
          className="relative h-[18px] cursor-pointer group flex items-center px-4"
          onClick={handleProgressClick}
          onMouseMove={handleProgressMove}
          onMouseLeave={handleProgressLeave}
        >
          <div className="w-full h-1.5 bg-hanger-border/30 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-hanger-accent to-hanger-accent2 rounded-full transition-[width] duration-75 relative"
              style={{ width: `${progressPct}%` }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-white shadow-md shadow-hanger-accent/40 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            {hoverPct !== null && (
              <div
                className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-white/80 shadow-md opacity-100 transition-all"
                style={{ left: `calc(${hoverPct * 100}% - 7px)` }}
              />
            )}
          </div>
        </div>

        <div className="flex items-center px-4 pb-3 pt-2 gap-3">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br from-hanger-accent/30 to-hanger-accent2/30 flex items-center justify-center flex-shrink-0 ${isPlaying ? 'animate-spin-slow' : ''}`}>
              <MusicIcon size={18} className="text-white/80" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium truncate text-hanger-text">{currentTrack.title}</p>
              <p className="text-xs text-hanger-muted/50 truncate">{currentTrack.album || currentTrack.category}</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={toggleShuffle}
              className={`p-1.5 rounded-lg transition-all ${shuffle ? 'text-hanger-accent' : 'text-hanger-muted/40 hover:text-hanger-text'}`}
              title="Shuffle"
            >
              <Shuffle size={14} />
            </button>
            <button
              onClick={playPrev}
              className="p-1.5 rounded-lg text-hanger-muted/40 hover:text-hanger-text transition-all"
              title="Previous"
            >
              <SkipBack size={16} />
            </button>
            <button
              onClick={togglePlay}
              className="p-2.5 rounded-full accent-gradient text-white hover:scale-105 transition-transform shadow-lg shadow-hanger-accent/20 mx-1"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause size={16} fill="white" /> : <Play size={16} fill="white" />}
            </button>
            <button
              onClick={playNext}
              className="p-1.5 rounded-lg text-hanger-muted/40 hover:text-hanger-text transition-all"
              title="Next"
            >
              <SkipForward size={16} />
            </button>
            <button
              onClick={cycleRepeat}
              className={`p-1.5 rounded-lg transition-all ${repeat !== 'off' ? 'text-hanger-accent' : 'text-hanger-muted/40 hover:text-hanger-text'}`}
              title={`Repeat: ${repeat}`}
            >
              {repeat === 'one' ? <Repeat1 size={14} /> : <Repeat size={14} />}
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-hanger-muted/50 tabular-nums font-medium">{formatTime(progress)}</span>
            <span className="text-[11px] text-hanger-muted/30 tabular-nums">/ {formatTime(duration)}</span>
            <button
              onClick={() => toggleLike(currentTrack.id)}
              className={`p-1.5 rounded-lg transition-all ${likedTracks.includes(currentTrack.id) ? 'text-hanger-accent' : 'text-hanger-muted/40 hover:text-hanger-text'}`}
              title="Like"
            >
              <Heart size={13} fill={likedTracks.includes(currentTrack.id) ? 'currentColor' : 'none'} />
            </button>
            <div className="relative">
              <button
                onClick={openPlaylistMenu}
                className="p-1.5 rounded-lg text-hanger-muted/40 hover:text-hanger-text transition-all"
                title="Add to Playlist"
              >
                <ListMusic size={13} />
              </button>
              {showPlaylists && (
                <div className="absolute bottom-full right-0 mb-2 w-48 glass-light rounded-xl shadow-2xl py-1 max-h-48 overflow-y-auto animate-fade-in z-50">
                  <p className="px-3 py-1.5 text-[10px] font-semibold text-hanger-muted/60 uppercase tracking-wider">Add to Playlist</p>
                  {playlists.length === 0 && <p className="px-3 py-2 text-xs text-hanger-muted/40 italic">No playlists</p>}
                  {playlists.map((pl) => (
                    <button
                      key={pl.id}
                      onClick={() => handleAddToPlaylist(pl)}
                      className="w-full text-left px-3 py-2 text-sm text-hanger-text hover:bg-hanger-hover/50 transition-all"
                    >{pl.name}</button>
                  ))}
                </div>
              )}
            </div>
            <div className="flex items-center gap-1.5 ml-2 pl-2 border-l border-hanger-border/20">
              <button className="p-1 rounded-lg text-hanger-muted/40 hover:text-hanger-text transition-all" title="Volume">
                <VolIcon size={13} />
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={localVolume}
                onChange={handleVolumeChange}
                className="w-16 player-range"
                title="Volume"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function MusicIcon({ size, className }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M9 18V5l12-2v13" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="16" r="3" />
    </svg>
  )
}
