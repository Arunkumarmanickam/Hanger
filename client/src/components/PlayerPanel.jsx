import { useState, useRef, useEffect } from 'react'
import {
  Play, Pause, SkipBack, SkipForward, Volume2, Volume1, VolumeX,
  Heart, Shuffle, Repeat, Repeat1, ListMusic, Music,
} from 'lucide-react'
import { usePlayer } from '../context/PlayerContext'
import { getPlaylists, addTrackToPlaylist, getThumbnailUrl } from '../utils/api'

export default function PlayerPanel({ refreshPlaylists }) {
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

  const VolIcon = localVolume === 0 ? VolumeX : localVolume < 0.5 ? Volume1 : Volume2

  if (!currentTrack) {
    return (
      <div className="h-full flex flex-col items-center justify-center px-6 text-center">
        <div className="w-24 h-24 rounded-3xl bg-white/5 flex items-center justify-center mb-5">
          <Music size={40} className="text-white/20" />
        </div>
        <p className="text-white/30 text-sm font-medium">No track playing</p>
        <p className="text-white/15 text-xs mt-1">Browse and play something</p>
      </div>
    )
  }

  const thumbUrl = getThumbnailUrl(currentTrack)

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-6 overflow-y-auto">
        <div className="w-full max-w-[280px] aspect-square rounded-3xl overflow-hidden shadow-2xl mb-6 ring-1 ring-white/5">
          <img
            src={thumbUrl}
            alt={currentTrack.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="w-full max-w-[280px] text-center mb-6">
          <p className="text-base font-semibold text-white truncate">{currentTrack.title}</p>
          <p className="text-sm text-white/40 truncate mt-1">{currentTrack.album || currentTrack.category}</p>
        </div>

        <div className="w-full max-w-[280px] mb-4">
          <div
            ref={progressRef}
            className="relative h-5 cursor-pointer group flex items-center"
            onClick={handleProgressClick}
            onMouseMove={handleProgressMove}
            onMouseLeave={handleProgressLeave}
          >
            <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-[width] duration-75 relative"
                style={{ width: `${progressPct}%` }}
              >
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white opacity-0 group-hover:opacity-100 transition-opacity shadow-lg" />
              </div>
              {hoverPct !== null && (
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white/80 shadow-lg"
                  style={{ left: `calc(${hoverPct * 100}% - 6px)` }}
                />
              )}
            </div>
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-[11px] text-white/30 tabular-nums">{formatTime(progress)}</span>
            <span className="text-[11px] text-white/20 tabular-nums">{formatTime(duration)}</span>
          </div>
        </div>

        <div className="flex items-center justify-center gap-4 w-full max-w-[280px] mb-6">
          <button
            onClick={toggleShuffle}
            className={`p-2 rounded-xl transition-all ${shuffle ? 'text-white' : 'text-white/30 hover:text-white/60'}`}
          >
            <Shuffle size={15} />
          </button>
          <button
            onClick={playPrev}
            className="p-2 rounded-xl text-white/40 hover:text-white/80 transition-all"
          >
            <SkipBack size={18} />
          </button>
          <button
            onClick={togglePlay}
            className="p-4 rounded-full bg-white text-black hover:scale-105 transition-transform shadow-xl"
          >
            {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
          </button>
          <button
            onClick={playNext}
            className="p-2 rounded-xl text-white/40 hover:text-white/80 transition-all"
          >
            <SkipForward size={18} />
          </button>
          <button
            onClick={cycleRepeat}
            className={`p-2 rounded-xl transition-all ${repeat !== 'off' ? 'text-white' : 'text-white/30 hover:text-white/60'}`}
          >
            {repeat === 'one' ? <Repeat1 size={15} /> : <Repeat size={15} />}
          </button>
        </div>

        <div className="flex items-center justify-center gap-5 w-full max-w-[280px]">
          <button
            onClick={() => toggleLike(currentTrack.id)}
            className={`p-2 rounded-xl transition-all ${likedTracks.includes(currentTrack.id) ? 'text-white' : 'text-white/30 hover:text-white/60'}`}
          >
            <Heart size={16} fill={likedTracks.includes(currentTrack.id) ? 'currentColor' : 'none'} />
          </button>

          <div className="relative">
            <button
              onClick={openPlaylistMenu}
              className="p-2 rounded-xl text-white/30 hover:text-white/60 transition-all"
            >
              <ListMusic size={16} />
            </button>
            {showPlaylists && (
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-44 bg-black/80 backdrop-blur-xl rounded-xl shadow-2xl py-1 max-h-40 overflow-y-auto border border-white/10 z-50">
                <p className="px-3 py-1.5 text-[10px] font-semibold text-white/40 uppercase tracking-wider">Add to Playlist</p>
                {playlists.length === 0 && <p className="px-3 py-2 text-xs text-white/30 italic">No playlists</p>}
                {playlists.map((pl) => (
                  <button
                    key={pl.id}
                    onClick={() => handleAddToPlaylist(pl)}
                    className="w-full text-left px-3 py-2 text-sm text-white/70 hover:bg-white/10 transition-all"
                  >{pl.name}</button>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button className="p-2 rounded-xl text-white/30 hover:text-white/60 transition-all">
              <VolIcon size={15} />
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
  )
}
