import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'
import { TransactionProvider } from './contexts/TransactionContext'
import { ProProvider } from './contexts/ProContext'
import { DietProvider } from './contexts/DietContext'
import './styles/global.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <ProProvider>
          <AuthProvider>
            <DietProvider>
            <TransactionProvider>
              <App />
              <Toaster
                position="top-right"
                toastOptions={{
                  style: { background: '#131A26', color: '#E2E8F0', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', fontSize: '14px' },
                  success: { iconTheme: { primary: '#10B981', secondary: '#fff' } },
                }}
              />
            </TransactionProvider>
            </DietProvider>
          </AuthProvider>
        </ProProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
)
