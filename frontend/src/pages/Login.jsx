import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { loginUser } from '../api'
import { useAuth } from '../context/AuthContext'

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await loginUser(form)
      login(res.data.token, res.data.user)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>✅ TaskManager</h1>
        <h2 style={styles.subtitle}>Welcome back</h2>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <input
              style={styles.input}
              type="email"
              name="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input
              style={styles.input}
              type="password"
              name="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>
          <button style={styles.btn} type="submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p style={styles.footer}>
          No account? <Link to="/register" style={styles.link}>Register here</Link>
        </p>
      </div>
    </div>
  )
}

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
  },
  card: {
    background: '#fff',
    borderRadius: '16px',
    padding: '2.5rem',
    width: '100%',
    maxWidth: '400px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
  },
  title: {
    textAlign: 'center',
    color: '#6c63ff',
    fontSize: '1.6rem',
    marginBottom: '0.3rem',
  },
  subtitle: {
    textAlign: 'center',
    color: '#666',
    fontWeight: 400,
    fontSize: '1rem',
    marginBottom: '1.5rem',
  },
  error: {
    background: '#fff5f5',
    color: '#e53e3e',
    border: '1px solid #fed7d7',
    borderRadius: '8px',
    padding: '0.7rem 1rem',
    marginBottom: '1rem',
    fontSize: '0.9rem',
  },
  field: { marginBottom: '1.2rem' },
  label: { display: 'block', marginBottom: '0.4rem', color: '#555', fontWeight: 600, fontSize: '0.85rem' },
  input: {
    width: '100%',
    padding: '0.75rem 1rem',
    border: '1.5px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '0.95rem',
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  btn: {
    width: '100%',
    padding: '0.85rem',
    background: 'linear-gradient(135deg, #6c63ff, #5a52d5)',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: 600,
    cursor: 'pointer',
    marginTop: '0.5rem',
    transition: 'opacity 0.2s',
  },
  footer: { textAlign: 'center', marginTop: '1.2rem', color: '#666', fontSize: '0.9rem' },
  link: { color: '#6c63ff', textDecoration: 'none', fontWeight: 600 },
}

export default Login
