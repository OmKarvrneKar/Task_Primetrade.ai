import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav style={styles.nav}>
      <Link to="/dashboard" style={styles.brand}>
        ✅ TaskManager
      </Link>
      {user && (
        <div style={styles.right}>
          <span style={styles.badge(isAdmin)}>{isAdmin ? '👑 Admin' : '👤 User'}</span>
          <span style={styles.name}>{user.name}</span>
          {isAdmin && (
            <Link to="/admin" style={styles.link}>Users</Link>
          )}
          <Link to="/dashboard" style={styles.link}>Tasks</Link>
          <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
        </div>
      )}
    </nav>
  )
}

const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 2rem',
    height: '60px',
    background: '#1a1a2e',
    color: '#fff',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
  },
  brand: {
    color: '#6c63ff',
    textDecoration: 'none',
    fontWeight: 700,
    fontSize: '1.2rem',
    letterSpacing: '0.5px',
  },
  right: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.2rem',
  },
  badge: (isAdmin) => ({
    background: isAdmin ? '#f39c12' : '#6c63ff',
    color: '#fff',
    padding: '2px 10px',
    borderRadius: '20px',
    fontSize: '0.75rem',
    fontWeight: 600,
  }),
  name: {
    color: '#ccc',
    fontSize: '0.9rem',
  },
  link: {
    color: '#a0aec0',
    textDecoration: 'none',
    fontSize: '0.9rem',
    transition: 'color 0.2s',
  },
  logoutBtn: {
    background: 'transparent',
    border: '1px solid #e53e3e',
    color: '#e53e3e',
    padding: '5px 14px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.85rem',
    transition: 'all 0.2s',
  },
}

export default Navbar
