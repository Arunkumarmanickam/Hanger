import { useState, useEffect } from 'react'
import { Play, Pause, Heart, MoreHorizontal, Plus } from 'lucide-react'
import { usePlayer } from '../context/PlayerContext'
import { getPlaylists, addTrackToPlaylist } from '../utils/api'

export default function SongCard({ track, index, onPlay, isInPlaylist, onRemove }) {
  const { currentTrack, isPlaying, togglePlay, likedTracks, toggleLike } = usePlayer()
  const [showMenu, setShowMenu] = useState(false)
  const [playlists, setPlaylists] = useState([])

  const isCurrentTrack = currentTrack?.id === track.id
  const isLiked = likedTracks.includes(track.id)
  const isThisPlaying = isCurrentTrack && isPlaying

  useEffect(() => {
    const handleClickOutside = () => setShowMenu(false)
    if (showMenu) document.addEventListener('click', handleClickOutside)
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
      setPlaylists(data.filter(p => !p.isBuiltIn))
    } catch (err) {
      console.error('Failed to load playlists:', err)
    }
    setShowMenu(!showMenu)
  }

  const albumColors = [
    'from-rose-500/30 to-pink-500/30',
    'from-violet-500/30 to-purple-500/30',
    'from-blue-500/30 to-cyan-500/30',
    'from-amber-500/30 to-orange-500/30',
    'from-emerald-500/30 to-teal-500/30',
    'from-fuchsia-500/30 to-pink-500/30',
  ]
  const colorIdx = (track.title?.length || 0) % albumColors.length

  return (
    <div
      className={`group relative flex items-center gap-3 p-2.5 rounded-xl transition-all duration-200 cursor-pointer ${
        isCurrentTrack
          ? 'bg-gradient-to-r from-hanger-accent/8 to-hanger-accent2/5 border border-hanger-accent/15'
          : 'hover:bg-hanger-hover/30 border border-transparent'
      }`}
      onClick={onPlay}
    >
      <div className="flex items-center justify-center w-8 flex-shrink-0">
        {isCurrentTrack ? (
          <div className="w-5 flex items-center justify-center">
            {isThisPlaying ? (
              <div className="flex gap-[2px] items-end h-4">
                <span className="w-[3px] bg-hanger-accent rounded-full animate-bounce-bar" style={{ animationDelay: '0s' }} />
                <span className="w-[3px] bg-hanger-accent2 rounded-full animate-bounce-bar" style={{ animationDelay: '0.2s' }} />
                <span className="w-[3px] bg-hanger-accent3 rounded-full animate-bounce-bar" style={{ animationDelay: '0.4s' }} />
              </div>
            ) : (
              <Pause size={14} className="text-hanger-accent" fill="currentColor" />
            )}
          </div>
        ) : (
          <>
            <span className="text-xs text-hanger-muted/40 group-hover:hidden tabular-nums">
              {index !== undefined ? index + 1 : ''}
            </span>
            <Play size={14} className="text-white hidden group-hover:block" fill="white" />
          </>
        )}
      </div>

      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${albumColors[colorIdx]} flex items-center justify-center flex-shrink-0 overflow-hidden`}>
        <MusicIcon size={16} className="text-white/60" />
      </div>

      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium truncate ${
          isCurrentTrack ? 'text-hanger-accent' : 'text-hanger-text'
        }`}>
          {track.title}
        </p>
        <p className="text-xs text-hanger-muted/50 truncate">{track.album || ''}</p>
      </div>

      <button
        onClick={(e) => { e.stopPropagation(); toggleLike(track.id) }}
        className={`p-1.5 rounded-full transition-all opacity-0 group-hover:opacity-100 ${
          isLiked ? 'text-hanger-accent opacity-100' : 'text-hanger-muted/60 hover:text-hanger-text'
        }`}
      >
        <Heart size={13} fill={isLiked ? 'currentColor' : 'none'} />
      </button>

      <div className="relative">
        <button
          onClick={openMenu}
          className="p-1.5 rounded-full text-hanger-muted/40 hover:text-hanger-text transition-all opacity-0 group-hover:opacity-100"
        >
          <MoreHorizontal size={14} />
        </button>
        {showMenu && (
          <div className="absolute right-0 top-full mt-1 w-48 glass-light rounded-xl shadow-2xl py-1 z-50 animate-fade-in">
            <p className="px-3 py-1.5 text-[10px] font-semibold text-hanger-muted/60 uppercase tracking-wider">
              Add to Playlist
            </p>
            {playlists.length === 0 && (
              <p className="px-3 py-2 text-xs text-hanger-muted/40 italic">No playlists yet</p>
            )}
            {playlists.map((pl) => (
              <button
                key={pl.id}
                onClick={() => handleAddToPlaylist(pl)}
                className="w-full text-left px-3 py-2 text-sm text-hanger-text hover:bg-hanger-hover/50 transition-all flex items-center gap-2"
              >
                <Plus size={13} />
                {pl.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {isInPlaylist && onRemove && (
        <button
          onClick={(e) => { e.stopPropagation(); onRemove(track.id) }}
          className="p-1 rounded text-hanger-muted/30 hover:text-red-400 transition-all opacity-0 group-hover:opacity-100 text-sm"
        >
          ×
        </button>
      )}
    </div>
  )
}

function MusicIcon({ size, className }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M9 18V5l12-2v13" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="16" r="3" />
    </svg>
  )
}
