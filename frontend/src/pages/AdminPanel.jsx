import { useState, useEffect } from 'react'
import { fetchAllUsers, updateUserRole, deleteUser } from '../api'
import Navbar from '../components/Navbar'

const AdminPanel = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const loadUsers = async () => {
    try {
      const res = await fetchAllUsers()
      setUsers(res.data.data)
    } catch (err) {
      setError('Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadUsers() }, [])

  const handleRoleChange = async (id, newRole) => {
    try {
      await updateUserRole(id, newRole)
      setSuccess(`Role updated to ${newRole}`)
      loadUsers()
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError('Failed to update role')
    }
  }

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete user "${name}"? This cannot be undone.`)) return
    try {
      await deleteUser(id)
      setSuccess('User deleted')
      loadUsers()
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError('Failed to delete user')
    }
  }

  return (
    <div>
      <Navbar />
      <div style={styles.container}>
        <h1 style={styles.title}>👑 Admin Panel</h1>
        <p style={styles.subtitle}>Manage all registered users</p>

        {error && <div style={styles.error}>{error}</div>}
        {success && <div style={styles.success}>{success}</div>}

        {loading ? (
          <p style={styles.center}>Loading users...</p>
        ) : (
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.thead}>
                  <th style={styles.th}>Name</th>
                  <th style={styles.th}>Email</th>
                  <th style={styles.th}>Role</th>
                  <th style={styles.th}>Joined</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id} style={styles.tr}>
                    <td style={styles.td}>{u.name}</td>
                    <td style={styles.td}>{u.email}</td>
                    <td style={styles.td}>
                      <span style={{ ...styles.roleBadge, background: u.role === 'admin' ? '#f39c12' : '#6c63ff' }}>
                        {u.role}
                      </span>
                    </td>
                    <td style={styles.td}>{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td style={styles.td}>
                      <div style={styles.actions}>
                        <button
                          onClick={() => handleRoleChange(u._id, u.role === 'admin' ? 'user' : 'admin')}
                          style={styles.roleBtn}
                        >
                          Make {u.role === 'admin' ? 'User' : 'Admin'}
                        </button>
                        <button onClick={() => handleDelete(u._id, u.name)} style={styles.delBtn}>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

const styles = {
  container: { maxWidth: '1000px', margin: '0 auto', padding: '2rem 1.5rem' },
  title: { fontSize: '1.8rem', fontWeight: 700, color: '#1a1a2e' },
  subtitle: { color: '#888', marginBottom: '1.5rem' },
  error: { background: '#fff5f5', color: '#e53e3e', border: '1px solid #fed7d7', borderRadius: '8px', padding: '0.7rem 1rem', marginBottom: '1rem' },
  success: { background: '#f0fff4', color: '#276749', border: '1px solid #9ae6b4', borderRadius: '8px', padding: '0.7rem 1rem', marginBottom: '1rem' },
  center: { textAlign: 'center', color: '#888', padding: '2rem' },
  tableWrapper: { background: '#fff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' },
  table: { width: '100%', borderCollapse: 'collapse' },
  thead: { background: '#1a1a2e' },
  th: { padding: '1rem', textAlign: 'left', color: '#fff', fontWeight: 600, fontSize: '0.85rem' },
  tr: { borderBottom: '1px solid #f0f0f0', transition: 'background 0.15s' },
  td: { padding: '0.9rem 1rem', color: '#333', fontSize: '0.9rem' },
  roleBadge: { color: '#fff', padding: '2px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600 },
  actions: { display: 'flex', gap: '0.5rem' },
  roleBtn: { padding: '5px 12px', background: '#ebf8ff', color: '#2b6cb0', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 500 },
  delBtn: { padding: '5px 12px', background: '#fff5f5', color: '#e53e3e', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 500 },
}

export default AdminPanel
