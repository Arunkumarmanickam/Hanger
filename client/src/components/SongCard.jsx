import { useState, useEffect } from 'react'
import { Play, Pause, Heart, MoreHorizontal, Plus } from 'lucide-react'
import { usePlayer } from '../context/PlayerContext'
import { getPlaylists, addTrackToPlaylist, getThumbnailUrl } from '../utils/api'

export default function SongCard({ track, onPlay, isActive, isInPlaylist, onRemove }) {
  const { currentTrack, isPlaying, togglePlay, likedTracks, toggleLike } = usePlayer()
  const [showMenu, setShowMenu] = useState(false)
  const [playlists, setPlaylists] = useState([])
  const [imgError, setImgError] = useState(false)

  const isCurrentTrack = currentTrack?.id === track.id
  const isLiked = likedTracks.includes(track.id)
  const isThisPlaying = isCurrentTrack && isPlaying

  useEffect(() => {
    const handleClickOutside = () => setShowMenu(false)
    if (showMenu) {
      document.addEventListener('click', handleClickOutside)
    }
    return () => document.removeEventListener('click', handleClickOutside)
  }, [showMenu])

  const handleAddToPlaylist = async (pl) => {
    try {
      await addTrackToPlaylist(pl.id, track)
      setShowMenu(false)
    } catch (err) {
      console.error('Failed to add track:', err)
    }
  }

  const openMenu = async (e) => {
    e.stopPropagation()
    try {
      const data = await getPlaylists()
      setPlaylists(data)
    } catch (err) {
      console.error('Failed to load playlists:', err)
    }
    setShowMenu(!showMenu)
  }

  const thumbUrl = getThumbnailUrl(track)

  return (
    <div
      className={`group relative flex items-center gap-3 p-2.5 rounded-lg transition-all duration-200 cursor-pointer ${
        isCurrentTrack
          ? 'bg-hanger-accent/10 border border-hanger-accent/20'
          : 'hover:bg-hanger-hover/60 border border-transparent'
      }`}
      onClick={() => onPlay ? onPlay() : null}
    >
      <div className="relative flex-shrink-0">
        <img
          src={imgError ? `https://img.youtube.com/vi/${track.id}/hqdefault.jpg` : thumbUrl}
          alt={track.title}
          className="w-11 h-11 rounded-md object-cover"
          onError={() => setImgError(true)}
        />
        {isCurrentTrack && (
          <div className="absolute inset-0 rounded-md bg-black/40 flex items-center justify-center">
            {isThisPlaying ? (
              <div className="flex gap-0.5 items-end h-3">
                <span className="w-0.5 bg-hanger-accent rounded-full animate-bounce" style={{ animationDelay: '0ms', height: '100%' }} />
                <span className="w-0.5 bg-hanger-accent rounded-full animate-bounce" style={{ animationDelay: '150ms', height: '60%' }} />
                <span className="w-0.5 bg-hanger-accent rounded-full animate-bounce" style={{ animationDelay: '300ms', height: '80%' }} />
              </div>
            ) : (
              <Play size={14} className="text-hanger-accent" fill="hanger-accent" />
            )}
          </div>
        )}
        {!isCurrentTrack && (
          <div className="absolute inset-0 rounded-md bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Play size={16} className="text-white" fill="white" />
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium truncate ${
          isCurrentTrack ? 'text-hanger-accent' : 'text-hanger-text'
        }`}>
          {track.title}
        </p>
        <p className="text-xs text-hanger-muted truncate">
          {track.artist}
        </p>
      </div>

      <span className="text-xs text-hanger-muted/60 tabular-nums hidden sm:block">
        {track.durationLabel || formatDuration(track.duration)}
      </span>

      <button
        onClick={(e) => { e.stopPropagation(); toggleLike(track.id) }}
        className={`p-1.5 rounded-full transition-all opacity-0 group-hover:opacity-100 ${
          isLiked ? 'text-hanger-accent opacity-100' : 'text-hanger-muted hover:text-hanger-text'
        }`}
      >
        <Heart size={14} fill={isLiked ? 'currentColor' : 'none'} />
      </button>

      <div className="relative">
        <button
          onClick={openMenu}
          className="p-1.5 rounded-full text-hanger-muted hover:text-hanger-text transition-all opacity-0 group-hover:opacity-100"
        >
          <MoreHorizontal size={14} />
        </button>
        {showMenu && (
          <div className="absolute right-0 top-full mt-1 w-48 glass-light rounded-lg shadow-xl border border-hanger-border py-1 z-50">
            <p className="px-3 py-1.5 text-xs font-semibold text-hanger-muted uppercase">
              Add to Playlist
            </p>
            {playlists.length === 0 && (
              <p className="px-3 py-2 text-xs text-hanger-muted/50 italic">
                No playlists yet
              </p>
            )}
            {playlists.map((pl) => (
              <button
                key={pl.id}
                onClick={() => handleAddToPlaylist(pl)}
                className="w-full text-left px-3 py-2 text-sm text-hanger-text hover:bg-hanger-hover transition-all flex items-center gap-2"
              >
                <Plus size={14} />
                {pl.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {isInPlaylist && onRemove && (
        <button
          onClick={(e) => { e.stopPropagation(); onRemove(track.id) }}
          className="p-1.5 rounded-full text-hanger-muted/40 hover:text-red-400 transition-all opacity-0 group-hover:opacity-100"
        >
          ×
        </button>
      )}
    </div>
  )
}

function formatDuration(seconds) {
  if (!seconds) return '0:00'
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

export { formatDuration }
