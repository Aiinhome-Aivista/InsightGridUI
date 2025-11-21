import { BrowserRouter } from 'react-router-dom'
import AppRoutes from './routes/AppRoutes'
import { ThemeProvider } from './theme'

/**
 * Root App Component
 * Wraps the entire application with BrowserRouter for routing functionality
 */
function App() {
    return (
        <ThemeProvider>
            <BrowserRouter>
                <AppRoutes />
            </BrowserRouter>
        </ThemeProvider>
    )
}

export default App
