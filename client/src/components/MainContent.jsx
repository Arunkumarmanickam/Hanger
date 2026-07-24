import HomeView from './HomeView'
import SearchView from './SearchView'
import ArtistView from './ArtistView'
import PlaylistView from './PlaylistView'
import LibraryView from './LibraryView'

export default function MainContent({ activeView, setActiveView, refreshPlaylists }) {
  const renderView = () => {
    if (activeView === 'home') {
      return <HomeView setActiveView={setActiveView} />
    }
    if (activeView === 'search') {
      return <SearchView />
    }
    if (activeView === 'library') {
      return <LibraryView setActiveView={setActiveView} />
    }
    if (activeView?.startsWith('playlist-')) {
      const playlistId = activeView.replace('playlist-', '')
      return (
        <PlaylistView
          playlistId={playlistId}
          setActiveView={setActiveView}
          refreshPlaylists={refreshPlaylists}
        />
      )
    }
    return (
      <ArtistView
        categoryId={activeView}
        setActiveView={setActiveView}
      />
    )
  }

  return (
    <main className="flex-1 overflow-hidden bg-hanger-bg">
      {renderView()}
    </main>
  )
}
