import { Link } from 'react-router-dom'
import { Home, AlertCircle } from 'lucide-react'

export default function NotFound() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F8FAFC' }}>
      <div style={{ textAlign: 'center' }}>
        <AlertCircle size={64} color="#E2E8F0" style={{ margin: '0 auto 16px' }} />
        <h1 style={{ fontSize: 40, fontWeight: 800, color: '#0F172A', marginBottom: 8 }}>404</h1>
        <p style={{ fontSize: 16, color: '#64748B', marginBottom: 24 }}>Page not found.</p>
        <Link to="/"><button className="btn btn-primary" style={{ gap: 6 }}><Home size={15} /> Go to Dashboard</button></Link>
      </div>
    </div>
  )
}
