import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import AppLayout from './components/layout/AppLayout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Candidates from './pages/Candidates'
import CandidateDetail from './pages/CandidateDetail'
import ResumeViewer from './pages/ResumeViewer'
import AIScreening from './pages/AIScreening'
import InterviewQuestionBank from './pages/InterviewQuestionBank'
import BiasAudit from './pages/BiasAudit'
import Analytics from './pages/Analytics'
import JobDescriptions from './pages/JobDescriptions'
import CompanyProfile from './pages/CompanyProfile'
import Settings from './pages/Settings'
import NotFound from './pages/NotFound'
import useAppStore from './store/useAppStore'

function PrivateRoute({ children }) {
  const { user } = useAppStore()
  return user ? children : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<PrivateRoute><AppLayout /></PrivateRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="candidates" element={<Candidates />} />
          <Route path="candidates/:id" element={<CandidateDetail />} />
          <Route path="candidates/:id/resume" element={<ResumeViewer />} />
          <Route path="screening" element={<AIScreening />} />
          <Route path="questions" element={<InterviewQuestionBank />} />
          <Route path="bias-audit" element={<BiasAudit />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="jobs" element={<JobDescriptions />} />
          <Route path="company" element={<CompanyProfile />} />
          <Route path="settings" element={<Settings />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}
