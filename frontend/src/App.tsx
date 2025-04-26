import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { AppSidebar } from "@/components/sidebar/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

function App() {
  return (
    <Router>
      <SidebarProvider>
        <AppSidebar variant="inset" />
        <SidebarInset>
          <Routes>
            <Route path="/admin" element={<></>} />
          </Routes>
        </SidebarInset>
      </SidebarProvider>
    </Router>
  )
}

export default App
