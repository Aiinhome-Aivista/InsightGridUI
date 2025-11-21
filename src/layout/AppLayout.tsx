
import { Outlet } from 'react-router-dom'
import Header from '../common/ui/Header'
import Sidebar from '../common/ui/Sidebar'
import Footer from '../common/ui/Footer'

export default function AppLayout() {
  return (
    <>
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto">
            <Outlet />
          </main>
          <Footer />
        </div>
      </div>
    </>
  )
}
