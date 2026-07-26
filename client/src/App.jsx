import { useState, useCallback } from 'react'
import TopBar from './components/TopBar'
import MainContent from './components/MainContent'
import PlayerPanel from './components/PlayerPanel'
import { usePlayer } from './context/PlayerContext'
import { getThumbnailUrl } from './utils/api'

function BackgroundBlur() {
  const { currentTrack } = usePlayer()
  const thumbUrl = currentTrack ? getThumbnailUrl(currentTrack) : null

  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      {thumbUrl && (
        <img
          src={thumbUrl}
          alt=""
          className="absolute inset-0 w-full h-full object-cover scale-110"
          style={{ filter: 'blur(80px)', opacity: 0.35 }}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-[#08080b]/60 via-[#08080b]/40 to-[#08080b]" />
    </div>
  )
}

export default function App() {
  const [activeView, setActiveView] = useState('home')
  const [refreshPlaylists, setRefreshPlaylists] = useState(0)
  const [sidebarRefresh, setSidebarRefresh] = useState(0)

  const handleRefreshPlaylists = useCallback(() => {
    setRefreshPlaylists(prev => prev + 1)
    setSidebarRefresh(prev => prev + 1)
  }, [])

  return (
    <div className="h-screen flex flex-col bg-[#08080b] relative">
      <BackgroundBlur />
      <div className="relative z-10 flex flex-col h-full">
        <TopBar activeView={activeView} setActiveView={setActiveView} />
        <div className="flex-1 flex overflow-hidden">
          <div className="flex-1 overflow-hidden">
            <MainContent
              activeView={activeView}
              setActiveView={setActiveView}
              refreshPlaylists={handleRefreshPlaylists}
            />
          </div>
          <div className="w-[380px] flex-shrink-0 border-l border-white/5">
            <div className="h-full">
              <PlayerPanel refreshPlaylists={handleRefreshPlaylists} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
