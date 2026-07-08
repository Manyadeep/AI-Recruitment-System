import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
})

// Auth
export const login = (data) => api.post('/auth/login', data)
export const logout = () => api.post('/auth/logout')
export const getMe = () => api.get('/auth/me')

// Dashboard / Analytics
export const getDashboardStats = () => api.get('/analytics/dashboard/stats')
export const getDashboardFunnel = () => api.get('/analytics/dashboard/funnel')
export const getRecentApplications = () => api.get('/analytics/dashboard/recent-applications')
export const getRecentScreening = () => api.get('/analytics/dashboard/recent-screening')
export const getNotifications = () => api.get('/analytics/dashboard/notifications')
export const getAnalyticsOverview = () => api.get('/analytics/overview')

// Candidates
export const getCandidates = (params) => api.get('/candidates/', { params })
export const getCandidate = (id) => api.get(`/candidates/${id}`)
export const updateCandidateStatus = (id, status) => api.put(`/candidates/${id}/status`, { status })
export const getResumeUrl = (id) => `/api/candidates/${id}/resume`

// Screening
export const getScreeningResults = (role) => api.get('/screening/results', { params: { role } })
export const getScreeningResult = (id) => api.get(`/screening/results/${id}`)
export const getLeaderboard = () => api.get('/screening/leaderboard')
export const getScreeningSummary = () => api.get('/screening/summary')

// Interviews & Questions
export const getInterviews = () => api.get('/interviews/')
export const createInterview = (data) => api.post('/interviews/', data)
export const getQuestions = (params) => api.get('/interviews/questions', { params })

// Bias
export const getBiasReport = () => api.get('/bias/report')
export const getBiasMetrics = () => api.get('/bias/metrics')

// Jobs
export const getJobs = () => api.get('/jobs/')
export const updateJob = (id, data) => api.put(`/jobs/${id}`, data)

// Company
export const getCompany = () => api.get('/company/')

export default api
