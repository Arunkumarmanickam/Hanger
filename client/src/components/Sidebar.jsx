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

  const NavItem = ({ icon: Icon, label, view }) => {
    const isActive = activeView === view
    return (
      <button
        onClick={() => setActiveView(view)}
        className={`relative flex items-center gap-3 w-full px-3 py-2.5 rounded-xl transition-all duration-200 group ${
          isActive
            ? 'bg-gradient-to-r from-hanger-accent/10 to-hanger-accent2/5 text-white'
            : 'text-hanger-muted hover:text-hanger-text hover:bg-hanger-hover/40'
        }`}
      >
        {isActive && (
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-full accent-gradient" />
        )}
        <Icon size={20} className={isActive ? 'text-hanger-accent' : ''} />
        <span className={`text-sm font-medium ${isActive ? 'font-semibold' : ''}`}>{label}</span>
      </button>
    )
  }

  return (
    <>
      <aside className="w-60 h-full flex flex-col bg-hanger-bg/80 border-r border-hanger-border/30">
        <div className="px-4 pt-5 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl accent-gradient flex items-center justify-center shadow-lg shadow-hanger-accent/20">
              <Disc3 size={18} className="text-white" />
            </div>
            <h1 className="text-lg font-bold">
              <span className="accent-gradient-text">Han</span>
              <span className="text-hanger-text">ger</span>
            </h1>
          </div>
        </div>

        <nav className="flex-1 px-2 space-y-0.5 overflow-y-auto">
          <div className="mb-1">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-hanger-muted/40 px-3 pb-1.5">
              Menu
            </p>
            <NavItem icon={Home} label="Home" view="home" />
            <NavItem icon={Search} label="Search" view="search" />
            <NavItem icon={Library} label="Library" view="library" />
          </div>

          <div className="pt-4 mt-2 border-t border-hanger-border/20">
            <div className="flex items-center justify-between px-3 mb-1.5">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-hanger-muted/40">
                Playlists
              </p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="p-1 rounded-lg text-hanger-muted/60 hover:text-hanger-accent hover:bg-hanger-hover/50 transition-all"
                title="Create Playlist"
              >
                <Plus size={14} />
              </button>
            </div>

            {playlists.length === 0 && (
              <p className="text-xs text-hanger-muted/40 px-3 py-3 italic">No playlists yet</p>
            )}

            {playlists.map((pl) => (
              <button
                key={pl.id}
                onClick={() => setActiveView(`playlist-${pl.id}`)}
                className={`flex items-center gap-3 w-full px-3 py-2 rounded-xl text-sm transition-all group ${
                  activeView === `playlist-${pl.id}`
                    ? 'bg-gradient-to-r from-hanger-accent/10 to-hanger-accent2/5 text-white'
                    : 'text-hanger-muted/80 hover:text-hanger-text hover:bg-hanger-hover/40'
                }`}
              >
                <ListMusic size={15} className="flex-shrink-0" />
                <span className="truncate flex-1 text-left">{pl.name}</span>
                <span className="text-[10px] text-hanger-muted/30">{pl.tracks.length}</span>
                <button
                  onClick={(e) => handleDeletePlaylist(e, pl.id)}
                  className="opacity-0 group-hover:opacity-100 text-hanger-muted/30 hover:text-red-400 transition-all text-xs"
                >
                  ×
                </button>
              </button>
            ))}
          </div>
        </nav>

        <div className="px-2 py-3 border-t border-hanger-border/20">
          <div className="px-3 py-2 rounded-lg bg-hanger-card/50">
            <p className="text-[9px] text-hanger-muted/40 tracking-wider uppercase">Hanger v1.0</p>
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
