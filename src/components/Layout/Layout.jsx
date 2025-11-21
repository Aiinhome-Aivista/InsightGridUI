import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'
import Footer from './Footer'

/**
 * Layout Component
 * 
 * Wraps dashboard pages with consistent layout structure:
 * - Sidebar (collapsible on mobile)
 * - Header (fixed top bar)
 * - Main content area with <Outlet /> for nested routes
 * - Footer at the bottom
 * 
 * Angular equivalent:
 * This acts like a parent component with <router-outlet>
 * where child routes (VendorDashboard, etc.) are rendered
 */
function Layout() {
    const [sidebarOpen, setSidebarOpen] = useState(false)

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen)
    }

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            {/* Sidebar */}
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <Header onMenuClick={toggleSidebar} />

                {/* Page Content - This is where nested routes render */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
                    <div className="p-6">
                        <Outlet />
                    </div>

                    {/* Footer */}
                    <Footer />
                </main>
            </div>

            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}
        </div>
    )
}

export default Layout
