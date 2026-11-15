import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import MascotGallery from './mascot/MascotGallery.tsx'
import { applyPalette, resolvePalette } from './palette.ts'

// Set the palette before the first render so there is no flash of the wrong colours.
applyPalette(resolvePalette(window.location.search))

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {new URLSearchParams(window.location.search).get('view') === 'mascot' ? <MascotGallery /> : <App />}
  </StrictMode>,
)
