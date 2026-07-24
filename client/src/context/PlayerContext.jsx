import { createContext, useContext, useReducer, useRef, useCallback, useEffect } from 'react'
import { getAudioUrl } from '../utils/api'

const PlayerContext = createContext()

const initialState = {
  currentTrack: null,
  queue: [],
  queueIndex: -1,
  isPlaying: false,
  volume: 0.7,
  progress: 0,
  duration: 0,
  shuffle: false,
  repeat: 'off',
  likedTracks: JSON.parse(localStorage.getItem('hanger_liked') || '[]'),
}

function playerReducer(state, action) {
  switch (action.type) {
    case 'SET_TRACK':
      return {
        ...state,
        currentTrack: action.payload.track,
        queue: action.payload.queue || state.queue,
        queueIndex: action.payload.index ?? state.queueIndex,
        isPlaying: true,
        progress: 0,
        duration: action.payload.track.duration || 0,
      }
    case 'TOGGLE_PLAY':
      return { ...state, isPlaying: !state.isPlaying }
    case 'SET_PROGRESS':
      return { ...state, progress: action.payload }
    case 'SET_DURATION':
      return { ...state, duration: action.payload }
    case 'SET_VOLUME':
      return { ...state, volume: action.payload }
    case 'TOGGLE_LIKE': {
      const id = action.payload
      const liked = state.likedTracks.includes(id)
        ? state.likedTracks.filter(t => t !== id)
        : [...state.likedTracks, id]
      localStorage.setItem('hanger_liked', JSON.stringify(liked))
      return { ...state, likedTracks: liked }
    }
    case 'TOGGLE_SHUFFLE':
      return { ...state, shuffle: !state.shuffle }
    case 'CYCLE_REPEAT': {
      const modes = ['off', 'all', 'one']
      const idx = modes.indexOf(state.repeat)
      return { ...state, repeat: modes[(idx + 1) % modes.length] }
    }
    case 'NEXT':
      return { ...state, queueIndex: state.queueIndex + 1, progress: 0 }
    case 'PREV':
      return { ...state, queueIndex: Math.max(0, state.queueIndex - 1), progress: 0 }
    default:
      return state
  }
}

export function PlayerProvider({ children }) {
  const [state, dispatch] = useReducer(playerReducer, initialState)
  const audioRef = useRef(null)
  const stateRef = useRef(state)

  useEffect(() => { stateRef.current = state }, [state])

  useEffect(() => {
    const audio = new Audio()
    audio.volume = state.volume
    audio.preload = 'auto'
    audioRef.current = audio

    const onTime = () => dispatch({ type: 'SET_PROGRESS', payload: audio.currentTime })
    const onMeta = () => {
      dispatch({ type: 'SET_DURATION', payload: audio.duration })
      audio.play().catch(() => {})
    }
    const onEnd = () => {
      const s = stateRef.current
      if (s.repeat === 'one') { audio.currentTime = 0; audio.play(); return }
      if (s.queueIndex < s.queue.length - 1) {
        const next = s.queue[s.queueIndex + 1]
        audio.src = getAudioUrl(next)
        dispatch({ type: 'NEXT' })
      }
    }

    audio.addEventListener('timeupdate', onTime)
    audio.addEventListener('loadedmetadata', onMeta)
    audio.addEventListener('ended', onEnd)

    return () => {
      audio.removeEventListener('timeupdate', onTime)
      audio.removeEventListener('loadedmetadata', onMeta)
      audio.removeEventListener('ended', onEnd)
      audio.pause()
      audio.src = ''
    }
  }, [])

  const playTrack = useCallback((track, queue = [], index = 0) => {
    const audio = audioRef.current
    if (!audio) return
    dispatch({ type: 'SET_TRACK', payload: { track, queue, index } })
    audio.src = getAudioUrl(track)
  }, [])

  const togglePlay = useCallback(() => {
    const audio = audioRef.current
    if (!audio || !stateRef.current.currentTrack) return
    if (audio.paused) {
      if (!audio.src || audio.ended) {
        const s = stateRef.current
        playTrack(s.currentTrack, s.queue, s.queueIndex)
        return
      }
      audio.play().catch(() => {})
    } else {
      audio.pause()
    }
    dispatch({ type: 'TOGGLE_PLAY' })
  }, [playTrack])

  const seek = useCallback((time) => {
    const audio = audioRef.current
    if (audio) { audio.currentTime = time; dispatch({ type: 'SET_PROGRESS', payload: time }) }
  }, [])

  const setVolume = useCallback((vol) => {
    if (audioRef.current) audioRef.current.volume = vol
    dispatch({ type: 'SET_VOLUME', payload: vol })
  }, [])

  const playNext = useCallback(() => {
    const s = stateRef.current
    if (s.queueIndex < s.queue.length - 1) playTrack(s.queue[s.queueIndex + 1], s.queue, s.queueIndex + 1)
  }, [playTrack])

  const playPrev = useCallback(() => {
    const audio = audioRef.current
    const s = stateRef.current
    if (audio && audio.currentTime > 3) { audio.currentTime = 0; return }
    const i = Math.max(0, s.queueIndex - 1)
    if (s.queue[i]) playTrack(s.queue[i], s.queue, i)
  }, [playTrack])

  const toggleLike = useCallback((id) => dispatch({ type: 'TOGGLE_LIKE', payload: id }), [])
  const toggleShuffle = useCallback(() => dispatch({ type: 'TOGGLE_SHUFFLE' }), [])
  const cycleRepeat = useCallback(() => dispatch({ type: 'CYCLE_REPEAT' }), [])
  const playPlaylist = useCallback((tracks, i = 0) => { if (tracks.length) playTrack(tracks[i], tracks, i) }, [playTrack])

  return (
    <PlayerContext.Provider value={{ ...state, playTrack, togglePlay, seek, setVolume, playNext, playPrev, toggleLike, toggleShuffle, cycleRepeat, playPlaylist, dispatch }}>
      {children}
    </PlayerContext.Provider>
  )
}

export function usePlayer() {
  const ctx = useContext(PlayerContext)
  if (!ctx) throw new Error('usePlayer must be used within a PlayerProvider')
  return ctx
}
