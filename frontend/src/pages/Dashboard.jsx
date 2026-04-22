import { useState, useEffect, useCallback } from 'react'
import { fetchTasks, createTask, updateTask, deleteTask } from '../api'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'

const STATUS_COLORS = { pending: '#f59e0b', 'in-progress': '#3b82f6', completed: '#10b981' }
const PRIORITY_COLORS = { low: '#64748b', medium: '#f97316', high: '#ef4444' }

const emptyForm = { title: '', description: '', status: 'pending', priority: 'medium', dueDate: '' }

const Dashboard = () => {
  const { user, isAdmin } = useAuth()
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editTask, setEditTask] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Search & Pagination State
  const [filterStatus, setFilterStatus] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const loadTasks = async () => {
    setLoading(true)
    try {
      const params = {
        page,
        limit: 6,
        status: filterStatus || undefined,
        search: searchTerm || undefined
      }
      const res = await fetchTasks(params)
      setTasks(res.data.data)
      setTotalPages(res.data.pagination.pages)
    } catch (err) {
      setError('Failed to load tasks')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      loadTasks()
    }, 500)
    return () => clearTimeout(delayDebounceFn)
  }, [filterStatus, searchTerm, page])

  const openCreate = () => { setEditTask(null); setForm(emptyForm); setShowModal(true) }
  const openEdit = (task) => {
    setEditTask(task)
    setForm({
      title: task.title,
      description: task.description || '',
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
    })
    setShowModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      if (editTask) {
        await updateTask(editTask._id, form)
        setSuccess('Task updated successfully!')
      } else {
        await createTask(form)
        setSuccess('Task created! Great job.')
      }
      setShowModal(false)
      loadTasks()
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return
    try {
      await deleteTask(id)
      setSuccess('Task deleted successfully.')
      loadTasks()
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError('Failed to delete task')
    }
  }

  return (
    <div className="animate-fade">
      <Navbar />
      <div className="container">
        {/* Header Section */}
        <header style={localStyles.header}>
          <div>
            <h1 style={localStyles.pageTitle}>Project Workspace</h1>
            <p style={localStyles.subtitle}>Welcome back, <span style={{ fontWeight: 700, color: 'var(--primary)' }}>{user?.name}</span>. Ready to be productive?</p>
          </div>
          <button onClick={openCreate} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.2rem' }}>+</span> Create Task
          </button>
        </header>

        {/* Feedback Messages */}
        <div style={localStyles.alertArea}>
          {error && <div className="animate-fade" style={localStyles.errorAlert}>{error}</div>}
          {success && <div className="animate-fade" style={localStyles.successAlert}>{success}</div>}
        </div>

        {/* Controls: Search & Filter */}
        <div className="glass" style={localStyles.controlsRow}>
          <div style={localStyles.searchWrapper}>
            <span style={localStyles.searchIcon}>🔍</span>
            <input
              type="text"
              placeholder="Search by title or description..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
              style={localStyles.searchInput}
            />
          </div>

          <div style={localStyles.filterActions}>
            {['', 'pending', 'in-progress', 'completed'].map((s) => (
              <button
                key={s}
                onClick={() => { setFilterStatus(s); setPage(1); }}
                style={{
                  ...localStyles.filterBtn,
                  background: filterStatus === s ? 'var(--primary)' : 'rgba(255,255,255,0.5)',
                  color: filterStatus === s ? '#fff' : 'var(--text-muted)',
                  boxShadow: filterStatus === s ? '0 4px 10px rgba(99,102,241,0.3)' : 'none'
                }}
              >
                {s ? s.charAt(0).toUpperCase() + s.slice(1) : 'All Tasks'}
              </button>
            ))}
          </div>
        </div>

        {/* Task Grid */}
        {loading ? (
          <div style={localStyles.loadingContainer}>
            <div className="loader"></div>
            <p>Gathering your tasks...</p>
          </div>
        ) : tasks.length === 0 ? (
          <div className="glass" style={localStyles.emptyState}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>☕</div>
            <h3>No tasks found</h3>
            <p>Try adjusting your search or filters, or create a brand new task above.</p>
          </div>
        ) : (
          <>
            <div style={localStyles.grid}>
              {tasks.map((task) => (
                <div key={task._id} className="glass" style={localStyles.taskCard}>
                  <div style={localStyles.cardHeader}>
                    <span className="badge" style={{ background: STATUS_COLORS[task.status] }}>{task.status}</span>
                    <span className="badge" style={{ background: PRIORITY_COLORS[task.priority] }}>{task.priority}</span>
                  </div>

                  <h3 style={localStyles.taskTitle}>{task.title}</h3>
                  <p style={localStyles.taskDesc}>{task.description || "No description provided."}</p>

                  <div style={localStyles.cardMeta}>
                    {task.dueDate && (
                      <div style={localStyles.metaItem}>
                        <span>📅</span> {new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                    )}
                    {isAdmin && task.user && (
                      <div style={localStyles.metaItem}>
                        <span>👤</span> {task.user.name}
                      </div>
                    )}
                  </div>

                  <div style={localStyles.cardActions}>
                    <button onClick={() => openEdit(task)} style={localStyles.iconBtn} title="Edit Task">📝 Edit</button>
                    <button onClick={() => handleDelete(task._id)} style={localStyles.deleteBtn} title="Delete Task">🗑️ Delete</button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={localStyles.pagination}>
                <button
                  disabled={page === 1}
                  onClick={() => setPage(p => p - 1)}
                  style={page === 1 ? localStyles.pageBtnDisabled : localStyles.pageBtn}
                >
                  ← Previous
                </button>
                <span style={localStyles.pageInfo}>Page {page} of {totalPages}</span>
                <button
                  disabled={page === totalPages}
                  onClick={() => setPage(p => p + 1)}
                  style={page === totalPages ? localStyles.pageBtnDisabled : localStyles.pageBtn}
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div style={localStyles.overlay} onClick={() => setShowModal(false)}>
          <div className="glass" style={localStyles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h2 style={{ margin: 0 }}>{editTask ? 'Update Task' : 'New Task Creation'}</h2>
              <button onClick={() => setShowModal(false)} style={localStyles.closeBtn}>×</button>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={localStyles.field}>
                <label style={localStyles.label}>Task Title</label>
                <input
                  style={{ width: '100%' }}
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="What needs to be done?"
                  required
                />
              </div>

              <div style={localStyles.field}>
                <label style={localStyles.label}>Description (Optional)</label>
                <textarea
                  style={{ width: '100%', minHeight: '100px', resize: 'vertical' }}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Add some details..."
                />
              </div>

              <div style={localStyles.formRow}>
                <div style={localStyles.field}>
                  <label style={localStyles.label}>Current Status</label>
                  <select style={{ width: '100%' }} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                    <option value="pending">🟡 Pending</option>
                    <option value="in-progress">🔵 In Progress</option>
                    <option value="completed">🟢 Completed</option>
                  </select>
                </div>
                <div style={localStyles.field}>
                  <label style={localStyles.label}>Priority Level</label>
                  <select style={{ width: '100%' }} value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">🔥 High</option>
                  </select>
                </div>
              </div>

              <div style={localStyles.field}>
                <label style={localStyles.label}>Target Due Date</label>
                <input
                  style={{ width: '100%' }}
                  type="date"
                  value={form.dueDate}
                  onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                />
              </div>

              <div style={localStyles.modalActions}>
                <button type="button" onClick={() => setShowModal(false)} style={localStyles.cancelBtn}>Cancel</button>
                <button type="submit" className="btn-primary" style={{ flex: 2 }}>{editTask ? 'Save Changes' : 'Create Task'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

const localStyles = {
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' },
  pageTitle: { fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-main)', margin: 0, letterSpacing: '-0.5px' },
  subtitle: { color: 'var(--text-muted)', fontSize: '1rem', marginTop: '0.4rem' },
  alertArea: { marginBottom: '1.5rem' },
  errorAlert: { background: '#fef2f2', color: '#b91c1c', padding: '1rem', borderRadius: '10px', border: '1px solid #fee2e2' },
  successAlert: { background: '#f0fdf4', color: '#15803d', padding: '1rem', borderRadius: '10px', border: '1px solid #dcfce7' },
  controlsRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.2rem', borderRadius: '16px', marginBottom: '2rem', gap: '1rem' },
  searchWrapper: { position: 'relative', flex: 1, maxWidth: '450px' },
  searchIcon: { position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 },
  searchInput: { width: '100%', paddingLeft: '2.5rem', background: 'rgba(255,255,255,0.8)' },
  filterActions: { display: 'flex', gap: '8px' },
  filterBtn: { border: 'none', padding: '0.6rem 1.2rem', borderRadius: '30px', fontSize: '0.85rem', fontWeight: 600 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.5rem' },
  taskCard: { borderRadius: '20px', padding: '1.5rem', display: 'flex', flexDirection: 'column', transition: 'all 0.3s' },
  cardHeader: { display: 'flex', gap: '8px', marginBottom: '1.2rem' },
  taskTitle: { fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.6rem', color: 'var(--text-main)' },
  taskDesc: { color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '1.5rem', lineHeight: 1.6, flex: 1 },
  cardMeta: { display: 'flex', gap: '1rem', marginBottom: '1.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' },
  metaItem: { display: 'flex', alignItems: 'center', gap: '6px' },
  cardActions: { display: 'flex', gap: '10px', borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '1.2rem' },
  iconBtn: { flex: 1, padding: '0.6rem', border: 'none', background: '#f1f5f9', color: '#475569', borderRadius: '8px', fontWeight: 600 },
  deleteBtn: { flex: 1, padding: '0.6rem', border: 'none', background: '#fef2f2', color: '#ef4444', borderRadius: '8px', fontWeight: 600 },
  pagination: { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1.5rem', marginTop: '3rem' },
  pageBtn: { background: 'white', border: '1px solid #e2e8f0', padding: '0.6rem 1.2rem', borderRadius: '10px', boxShadow: 'var(--shadow-sm)' },
  pageBtnDisabled: { background: '#f8fafc', color: '#cbd5e1', border: '1px solid #e2e8f0', padding: '0.6rem 1.2rem', borderRadius: '10px', cursor: 'not-allowed' },
  pageInfo: { fontWeight: 600, color: 'var(--text-muted)' },
  overlay: { position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
  modal: { padding: '2.5rem', width: '90%', maxWidth: '540px', borderRadius: '24px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' },
  field: { marginBottom: '1.5rem' },
  label: { display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-main)' },
  formRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' },
  modalActions: { display: 'flex', gap: '1rem', marginTop: '1rem' },
  cancelBtn: { flex: 1, background: '#f1f5f9', border: 'none', color: '#475569', padding: '0.8rem' },
  closeBtn: { background: 'none', border: 'none', fontSize: '1.8rem', color: 'var(--text-muted)', lineHeight: 1 },
  loadingContainer: { textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' },
  emptyState: { textAlign: 'center', padding: '4rem 2rem', borderRadius: '24px' },
}

export default Dashboard


