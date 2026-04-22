import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth()
  if (loading) return <div style={styles.loader}>Loading...</div>
  return user ? children : <Navigate to="/login" replace />
}

export const AdminRoute = ({ children }) => {
  const { user, loading, isAdmin } = useAuth()
  if (loading) return <div style={styles.loader}>Loading...</div>
  if (!user) return <Navigate to="/login" replace />
  if (!isAdmin) return <Navigate to="/dashboard" replace />
  return children
}

const styles = {
  loader: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    fontSize: '1.2rem',
    color: '#6c63ff',
  },
}
