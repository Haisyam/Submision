import { ADMIN_PATH } from './config/appConfig'
import AdminDashboard from './pages/AdminDashboard'
import Landing from './pages/Landing'

const normalizePath = (value) => {
  if (!value) return '/'
  const trimmed = value.trim()
  const withSlash = trimmed.startsWith('/') ? trimmed : `/${trimmed}`
  return withSlash.length > 1 && withSlash.endsWith('/')
    ? withSlash.slice(0, -1)
    : withSlash
}

function App() {
  const adminPath = normalizePath(ADMIN_PATH)
  const currentPath = normalizePath(window.location.pathname)
  const isAdminRoute = currentPath === adminPath

  return isAdminRoute ? <AdminDashboard /> : <Landing />
}

export default App
