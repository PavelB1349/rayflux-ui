import { Outlet } from 'react-router-dom'
import { Header } from './Header'

export const Layout = () => {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans">
      {/* Убрали cartCount={0}, Header теперь умный */}
      <Header />
      
      <Outlet />

      <footer className="border-t border-zinc-800/80 bg-zinc-950 py-6 text-center text-xs text-zinc-500 mt-auto">
        RayFlux Market &copy; {new Date().getFullYear()} — Учебный проект
      </footer>
    </div>
  )
}