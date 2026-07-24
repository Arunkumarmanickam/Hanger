import { useState, useEffect } from 'react'
import { Home, Search, Library, Plus, ListMusic, Disc3 } from 'lucide-react'
import { getPlaylists, deletePlaylist } from '../utils/api'
import CreatePlaylistModal from './CreatePlaylistModal'

export default function Sidebar({ activeView, setActiveView, refreshPlaylists }) {
  const [playlists, setPlaylists] = useState([])
  const [showCreateModal, setShowCreateModal] = useState(false)

  const loadPlaylists = async () => {
    try {
      const data = await getPlaylists()
      setPlaylists(data)
    } catch (err) {
      console.error('Failed to load playlists:', err)
    }
  }

  useEffect(() => {
    loadPlaylists()
  }, [refreshPlaylists])

  const handleDeletePlaylist = async (e, id) => {
    e.stopPropagation()
    try {
      await deletePlaylist(id)
      loadPlaylists()
    } catch (err) {
      console.error('Failed to delete playlist:', err)
    }
  }

  const NavItem = ({ icon: Icon, label, view, isActive }) => (
    <button
      onClick={() => setActiveView(view)}
      className={`flex items-center gap-3 w-full px-4 py-2.5 rounded-lg transition-all duration-200 ${
        isActive
          ? 'bg-hanger-accent/10 text-hanger-accent neon-text'
          : 'text-hanger-muted hover:text-hanger-text hover:bg-hanger-hover/50'
      }`}
    >
      <Icon size={20} />
      <span className="font-medium text-sm">{label}</span>
    </button>
  )

  return (
    <>
      <aside className="w-64 h-full flex flex-col glass border-r border-hanger-border">
        <div className="p-5 border-b border-hanger-border/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg accent-gradient flex items-center justify-center">
              <Disc3 size={20} className="text-white" />
            </div>
            <h1 className="text-xl font-bold">
              <span className="text-hanger-accent">Han</span>
              <span className="text-white">ger</span>
            </h1>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          <div className="mb-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-hanger-muted/60 px-3 mb-2">
              Menu
            </p>
            <NavItem
              icon={Home}
              label="Home"
              view="home"
              isActive={activeView === 'home'}
            />
            <NavItem
              icon={Search}
              label="Search"
              view="search"
              isActive={activeView === 'search'}
            />
            <NavItem
              icon={Library}
              label="Your Library"
              view="library"
              isActive={activeView === 'library'}
            />
          </div>

          <div className="pt-4 border-t border-hanger-border/50">
            <div className="flex items-center justify-between px-3 mb-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-hanger-muted/60">
                Playlists
              </p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="p-1 rounded-md text-hanger-muted hover:text-hanger-accent hover:bg-hanger-hover/50 transition-all"
                title="Create Playlist"
              >
                <Plus size={16} />
              </button>
            </div>

            {playlists.length === 0 && (
              <p className="text-xs text-hanger-muted/50 px-3 py-2 italic">
                No playlists yet
              </p>
            )}

            {playlists.map((pl) => (
              <button
                key={pl.id}
                onClick={() => setActiveView(`playlist-${pl.id}`)}
                className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm transition-all group ${
                  activeView === `playlist-${pl.id}`
                    ? 'bg-hanger-accent/10 text-hanger-accent'
                    : 'text-hanger-muted hover:text-hanger-text hover:bg-hanger-hover/50'
                }`}
              >
                <ListMusic size={16} />
                <span className="truncate flex-1 text-left">{pl.name}</span>
                <span className="text-xs text-hanger-muted/40 opacity-0 group-hover:opacity-100 transition-opacity">
                  {pl.tracks.length}
                </span>
                <button
                  onClick={(e) => handleDeletePlaylist(e, pl.id)}
                  className="opacity-0 group-hover:opacity-100 text-hanger-muted/40 hover:text-red-400 transition-all text-xs"
                >
                  ×
                </button>
              </button>
            ))}
          </div>
        </nav>

        <div className="p-3 border-t border-hanger-border/50">
          <div className="px-3 py-2 rounded-lg bg-hanger-accent/5 border border-hanger-accent/10">
            <p className="text-[10px] text-hanger-muted/50">
              Hanger v1.0
            </p>
          </div>
        </div>
      </aside>

      {showCreateModal && (
        <CreatePlaylistModal
          onClose={() => setShowCreateModal(false)}
          onCreated={() => {
            setShowCreateModal(false)
            loadPlaylists()
          }}
        />
      )}
    </>
  )
}
