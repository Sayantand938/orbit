import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { SidebarLayout } from '@/components/layout/SidebarLayout'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { Login } from '@/pages/Login'
import { Signup } from '@/pages/Signup'
import { Transactions } from '@/pages/Transactions'
import { Logs } from '@/pages/Logs'
import { Sessions } from '@/pages/Sessions'
import { Settings } from '@/pages/Settings'

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <SidebarLayout>
                <Routes>
                  <Route path="/" element={<Transactions />} />
                  <Route path="/transactions" element={<Transactions />} />
                  <Route path="/logs" element={<Logs />} />
                  <Route path="/sessions" element={<Sessions />} />
                  <Route path="/settings" element={<Settings />} />
                </Routes>
              </SidebarLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App