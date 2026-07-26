import { useState } from 'react'
import { Home, Search, Library, Disc3 } from 'lucide-react'

const tabs = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'search', label: 'Search', icon: Search },
  { id: 'library', label: 'Library', icon: Library },
]

export default function TopBar({ activeView, setActiveView }) {
  const [hovered, setHovered] = useState(null)

  return (
    <header className="h-14 flex items-center justify-between px-5 bg-hanger-bg/90 backdrop-blur-2xl border-b border-hanger-border/20 sticky top-0 z-40">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-xl accent-gradient flex items-center justify-center shadow-lg shadow-hanger-accent/20">
          <Disc3 size={16} className="text-white" />
        </div>
        <h1 className="text-base font-bold tracking-tight">
          <span className="accent-gradient-text">Han</span>
          <span className="text-hanger-text">ger</span>
        </h1>
      </div>

      <nav className="flex items-center gap-1 bg-hanger-card/40 rounded-2xl p-1 border border-hanger-border/20">
        {tabs.map(({ id, label, icon: Icon }) => {
          const isActive = activeView === id || (id === 'home' && !['home', 'search', 'library', 'liked'].includes(activeView)) || (id === 'library' && activeView === 'liked')
          return (
            <button
              key={id}
              onClick={() => setActiveView(id)}
              onMouseEnter={() => setHovered(id)}
              onMouseLeave={() => setHovered(null)}
              className={`relative flex items-center gap-2 px-4 py-1.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-hanger-accent/15 text-white shadow-sm'
                  : 'text-hanger-muted/60 hover:text-hanger-text hover:bg-hanger-hover/30'
              }`}
            >
              <Icon size={15} />
              <span>{label}</span>
            </button>
          )
        })}
      </nav>

      <div className="w-[120px]" />
    </header>
  )
}
