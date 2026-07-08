import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import TopBar from './TopBar'

const PAGE_TITLES = {
  '/':           'Dashboard',
  '/candidates': 'Candidate Management',
  '/screening':  'AI Resume Screening',
  '/questions':  'Interview Question Bank',
  '/bias-audit': 'AI Bias & Fairness Audit',
  '/analytics':  'Analytics',
  '/jobs':       'Job Descriptions',
  '/company':    'Company Profile',
  '/settings':   'Settings',
}

export default function AppLayout() {
  const { pathname } = useLocation()
  const baseRoute = '/' + pathname.split('/')[1]
  const title = PAGE_TITLES[baseRoute] || 'TalentAI'

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: '#F8FAFC' }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <TopBar title={title} />
        <main style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
