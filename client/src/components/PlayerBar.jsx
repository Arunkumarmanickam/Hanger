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
  const [expanded, setExpanded] = useState(false)
  const progressRef = useRef(null)

  useEffect(() => { setLocalVolume(volume) }, [volume])

  const handleProgressClick = (e) => {
    const rect = progressRef.current.getBoundingClientRect()
    seek(((e.clientX - rect.left) / rect.width) * duration)
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
      <div className="mx-4 mb-4 rounded-2xl glass border border-hanger-border/20 px-5 py-3 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-hanger-card flex items-center justify-center">
          <ListMusic size={18} className="text-hanger-muted/50" />
        </div>
        <div>
          <p className="text-sm text-hanger-text/40">No track selected</p>
          <p className="text-xs text-hanger-muted/30">Browse and play something</p>
        </div>
      </div>
    )
  }

  const VolIcon = localVolume === 0 ? VolumeX : localVolume < 0.5 ? Volume1 : Volume2

  return (
    <div className="mx-4 mb-4 relative">
      <div className="rounded-2xl glass border border-hanger-border/20 overflow-hidden shadow-2xl shadow-black/40">
        <div className="h-1 bg-hanger-border/30 cursor-pointer" onClick={handleProgressClick} ref={progressRef}>
          <div className="h-full bg-gradient-to-r from-hanger-accent to-hanger-accent2 rounded-full transition-all duration-200" style={{ width: `${progressPct}%` }} />
        </div>
        <div className="flex items-center px-4 py-3 gap-3">
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
            >
              <Shuffle size={14} />
            </button>
            <button
              onClick={playPrev}
              className="p-1.5 rounded-lg text-hanger-muted/40 hover:text-hanger-text transition-all"
            >
              <SkipBack size={16} />
            </button>
            <button
              onClick={togglePlay}
              className="p-2.5 rounded-full accent-gradient text-white hover:scale-105 transition-transform shadow-lg shadow-hanger-accent/20 mx-1"
            >
              {isPlaying ? <Pause size={16} fill="white" /> : <Play size={16} fill="white" />}
            </button>
            <button
              onClick={playNext}
              className="p-1.5 rounded-lg text-hanger-muted/40 hover:text-hanger-text transition-all"
            >
              <SkipForward size={16} />
            </button>
            <button
              onClick={cycleRepeat}
              className={`p-1.5 rounded-lg transition-all ${repeat !== 'off' ? 'text-hanger-accent' : 'text-hanger-muted/40 hover:text-hanger-text'}`}
            >
              {repeat === 'one' ? <Repeat1 size={14} /> : <Repeat size={14} />}
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] text-hanger-muted/40 tabular-nums">{formatTime(progress)}</span>
            <span className="text-[10px] text-hanger-muted/30 tabular-nums">/ {formatTime(duration)}</span>
            <button
              onClick={() => toggleLike(currentTrack.id)}
              className={`p-1.5 rounded-lg transition-all ${likedTracks.includes(currentTrack.id) ? 'text-hanger-accent' : 'text-hanger-muted/40 hover:text-hanger-text'}`}
            >
              <Heart size={13} fill={likedTracks.includes(currentTrack.id) ? 'currentColor' : 'none'} />
            </button>
            <div className="relative">
              <button
                onClick={openPlaylistMenu}
                className="p-1.5 rounded-lg text-hanger-muted/40 hover:text-hanger-text transition-all"
              >
                <ListMusic size={13} />
              </button>
              {showPlaylists && (
                <div className="absolute bottom-full right-0 mb-2 w-48 glass-light rounded-xl shadow-2xl py-1 max-h-48 overflow-y-auto animate-fade-in">
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
            <div className="flex items-center gap-1 ml-2 pl-2 border-l border-hanger-border/20">
              <button className="p-1.5 rounded-lg text-hanger-muted/40 hover:text-hanger-text transition-all">
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
