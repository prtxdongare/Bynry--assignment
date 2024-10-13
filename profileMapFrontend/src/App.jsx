import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from 'react-query'
import ProfileList from './components/ProfileList'
import ProfileDetails from './components/ProfileDetails'
import AdminPanel from './components/AdminPanel'


const queryClient = new QueryClient()

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <header className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between">
              <Link to={"/"}><h1 className="text-2xl font-semibold text-gray-900">Profile Mapper</h1></Link>
              <Link to={"/admin"}><h1 className="text-2xl font-semibold text-blue-900">Admin</h1></Link>
            </div>
          </header>
          <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <Routes>
              <Route path="/" element={<ProfileList />} />
              <Route path="/profile/:id" element={<ProfileDetails />} />
              <Route path="/admin" element={<AdminPanel />} />
            </Routes>
          </main>
        </div>
      </Router>
    </QueryClientProvider>
  )
}

