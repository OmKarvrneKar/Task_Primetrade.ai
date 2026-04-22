import axios from 'axios'

const API = axios.create({
  baseURL: '/api/v1',
})

// Attach JWT token to every request automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Handle 401 globally - auto logout
API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

// Auth endpoints
export const registerUser = (data) => API.post('/auth/register', data)
export const loginUser = (data) => API.post('/auth/login', data)
export const getMe = () => API.get('/auth/me')

// Task endpoints
export const fetchTasks = (params) => API.get('/tasks', { params })
export const fetchTask = (id) => API.get(`/tasks/${id}`)
export const createTask = (data) => API.post('/tasks', data)
export const updateTask = (id, data) => API.put(`/tasks/${id}`, data)
export const deleteTask = (id) => API.delete(`/tasks/${id}`)

// Admin endpoints
export const fetchAllUsers = () => API.get('/users')
export const updateUserRole = (id, role) => API.put(`/users/${id}/role`, { role })
export const deleteUser = (id) => API.delete(`/users/${id}`)

export default API
