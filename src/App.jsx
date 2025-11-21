import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import AppRoutes from './routes/AppRoutes'

/**
 * Root App Component
 * Wraps the entire application with BrowserRouter for routing functionality
 */
function App() {
    return (
        <BrowserRouter>
            <AppRoutes />
        </BrowserRouter>
    )
}

export default App
