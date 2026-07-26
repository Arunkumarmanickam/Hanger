import { useState } from 'react'
import { X, Music } from 'lucide-react'
import { createPlaylist } from '../utils/api'

export default function CreatePlaylistModal({ onClose, onCreated }) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name.trim()) return
    setLoading(true)
    try {
      await createPlaylist(name.trim(), description.trim())
      onCreated()
    } catch (err) {
      console.error('Failed to create playlist:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div
        className="w-full max-w-md glass rounded-2xl border border-hanger-border/40 shadow-2xl animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 border-b border-hanger-border/20">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl accent-gradient flex items-center justify-center">
              <Music size={15} className="text-white" />
            </div>
            <h2 className="text-lg font-bold text-hanger-text">Create Playlist</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-hanger-muted/60 hover:text-hanger-text hover:bg-hanger-hover/50 transition-all"
          >
            <X size={17} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-medium text-hanger-muted/70 mb-1.5">Playlist Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="My Awesome Playlist"
              className="w-full px-3.5 py-2.5 bg-hanger-bg border border-hanger-border/50 rounded-xl text-sm text-hanger-text placeholder-hanger-muted/30 focus:outline-none focus:border-hanger-accent/50 focus:ring-1 focus:ring-hanger-accent/20 transition-all"
              autoFocus
              maxLength={100}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-hanger-muted/70 mb-1.5">Description (optional)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a description..."
              rows={3}
              className="w-full px-3.5 py-2.5 bg-hanger-bg border border-hanger-border/50 rounded-xl text-sm text-hanger-text placeholder-hanger-muted/30 focus:outline-none focus:border-hanger-accent/50 focus:ring-1 focus:ring-hanger-accent/20 transition-all resize-none"
              maxLength={300}
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 text-sm font-medium text-hanger-muted/70 hover:text-hanger-text border border-hanger-border/50 rounded-xl hover:bg-hanger-hover/30 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim() || loading}
              className="flex-1 px-4 py-2.5 text-sm font-medium text-white accent-gradient rounded-xl hover:opacity-90 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
