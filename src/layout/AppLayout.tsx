
import { Outlet } from 'react-router-dom'
import Header from '../common/ui/Header'
import Sidebar from '../common/ui/Sidebar'
import Footer from '../common/ui/Footer'
import { useTheme } from '../theme'

export default function AppLayout() {
  const { theme } = useTheme()
  return (
    <>
      <div
        className="flex h-screen"
        style={{ backgroundColor: theme.background, color: theme.primaryText }}
      >
        <Sidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <Header />
          <main
            className="flex-1 overflow-y-auto"
            style={{ backgroundColor: theme.background, color: theme.primaryText }}
          >
            <Outlet />
          </main>
          <Footer />
        </div>
      </div>
    </>
  )
}
