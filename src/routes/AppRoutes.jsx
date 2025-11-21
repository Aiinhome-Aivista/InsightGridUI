import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from '../components/Layout/Layout'
import Login from '../pages/Auth/Login'
import VendorDashboard from '../pages/Dashboard/VendorDashboard'
import Products from '../pages/Products/Products'
import Orders from '../pages/Orders/Orders'
import Analytics from '../pages/Analytics/Analytics'
import Settings from '../pages/Settings/Settings'

/**
 * AppRoutes Component
 * 
 * Implements Angular-style nested routing:
 * - Login page renders WITHOUT layout (full-screen)
 * - Dashboard pages render WITH layout (sidebar + header + footer + content)
 * 
 * Structure:
 * Root → <Routes> → Login (no layout)
 * Root → <Routes> → Layout → <Outlet> → Dashboard Pages
 */
function AppRoutes() {
    return (
        <Routes>
            {/* Public Routes - No Layout */}
            <Route path="/login" element={<Login />} />

            {/* Protected Routes - With Layout */}
            <Route path="/" element={<Layout />}>
                {/* Redirect root to dashboard */}
                <Route index element={<Navigate to="/dashboard" replace />} />

                {/* Dashboard Routes - Nested inside Layout */}
                <Route path="dashboard" element={<VendorDashboard />} />
                <Route path="products" element={<Products />} />
                <Route path="orders" element={<Orders />} />
                <Route path="analytics" element={<Analytics />} />
                <Route path="settings" element={<Settings />} />
            </Route>

            {/* Catch all - redirect to dashboard */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
    )
}

export default AppRoutes
