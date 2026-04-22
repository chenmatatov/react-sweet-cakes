import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { CartProvider } from './context/CartContext.tsx'
import { FavoritesProvider } from './context/FavoritesContext.tsx'

createRoot(document.getElementById('root')!).render(
    <BrowserRouter>
        <CartProvider>
            <FavoritesProvider>
                <App />
            </FavoritesProvider>
        </CartProvider>
    </BrowserRouter>
)
