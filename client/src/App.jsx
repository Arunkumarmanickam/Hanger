import { useState, useCallback } from 'react'
import Sidebar from './components/Sidebar'
import MainContent from './components/MainContent'
import PlayerBar from './components/PlayerBar'

export default function App() {
  const [activeView, setActiveView] = useState('home')
  const [refreshPlaylists, setRefreshPlaylists] = useState(0)
  const [sidebarRefresh, setSidebarRefresh] = useState(0)

  const handleRefreshPlaylists = useCallback(() => {
    setRefreshPlaylists(prev => prev + 1)
    setSidebarRefresh(prev => prev + 1)
  }, [])

  return (
    <div className="h-screen flex flex-col bg-hanger-bg">
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          activeView={activeView}
          setActiveView={setActiveView}
          refreshPlaylists={sidebarRefresh}
        />
        <MainContent
          activeView={activeView}
          setActiveView={setActiveView}
          refreshPlaylists={handleRefreshPlaylists}
        />
      </div>
      <PlayerBar refreshPlaylists={handleRefreshPlaylists} />
    </div>
  )
}
