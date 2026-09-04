import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { SidebarLayout } from '@/components/layout/SidebarLayout'
import { Transactions } from '@/pages/Transactions'
import { Logs } from '@/pages/Logs'
import { Sessions } from '@/pages/Sessions'
import { Settings } from '@/pages/Settings'   // 👈 new import

export function App() {
  return (
    <BrowserRouter>
      <SidebarLayout>
        <Routes>
          <Route path="/" element={<Transactions />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/logs" element={<Logs />} />
          <Route path="/sessions" element={<Sessions />} />
          <Route path="/settings" element={<Settings />} />   {/* 👈 new route */}
        </Routes>
      </SidebarLayout>
    </BrowserRouter>
  )
}

export default App