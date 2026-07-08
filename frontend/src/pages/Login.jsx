import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Sparkles, Brain, Users, BarChart3 } from 'lucide-react'
import { login } from '../services/api'
import useAppStore from '../store/useAppStore'
import { Spinner } from '../components/ui/Spinner'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { setUser } = useAppStore()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await login({ email, password })
      setUser(res.data.user)
      navigate('/')
    } catch {
      setError('Invalid email or password. Use the demo credentials below.')
    } finally {
      setLoading(false)
    }
  }

  const fillDemo = () => {
    setEmail('hr@techvision.com')
    setPassword('admin123')
  }

  const features = [
    { icon: Brain,    label: 'AI Resume Screening',     desc: 'Automated CV scoring & ranking' },
    { icon: Users,    label: 'Candidate Management',    desc: '30 real candidate profiles' },
    { icon: BarChart3,label: 'Bias Detection & Analytics', desc: 'Fairness audit & insights' },
  ]

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: '#0F172A' }}>
      {/* Left panel */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '60px 64px',
        background: 'linear-gradient(135deg, #1E1B4B 0%, #312E81 40%, #4C1D95 100%)',
        position: 'relative', overflow: 'hidden'
      }}>
        {/* BG orbs */}
        <div style={{ position: 'absolute', top: -80, left: -80, width: 300, height: 300, borderRadius: '50%', background: 'rgba(124,58,237,0.2)', filter: 'blur(60px)' }} />
        <div style={{ position: 'absolute', bottom: -60, right: -60, width: 250, height: 250, borderRadius: '50%', background: 'rgba(79,70,229,0.25)', filter: 'blur(60px)' }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 48 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)' }}>
              <Sparkles size={22} color="white" />
            </div>
            <div>
              <div style={{ fontSize: 20, fontWeight: 700, color: 'white' }}>TalentAI</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>Recruitment Platform</div>
            </div>
          </div>

          <h1 style={{ fontSize: 36, fontWeight: 800, color: 'white', lineHeight: 1.25, marginBottom: 16 }}>
            AI-Powered Smart<br />Recruitment System
          </h1>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.6)', marginBottom: 48, lineHeight: 1.6 }}>
            Enterprise-grade hiring platform with intelligent<br />CV screening, bias detection & analytics.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {features.map(({ icon: Icon, label, desc }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={18} color="rgba(255,255,255,0.85)" />
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'white' }}>{label}</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>{desc}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Stats strip */}
          <div style={{ display: 'flex', gap: 32, marginTop: 52 }}>
            {[['30', 'Candidates'], ['3', 'Open Roles'], ['100%', 'Real Data']].map(([n, l]) => (
              <div key={l}>
                <div style={{ fontSize: 24, fontWeight: 800, color: 'white' }}>{n}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div style={{ width: 480, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '60px 52px', background: 'white' }}>
        <div style={{ marginBottom: 36 }}>
          <h2 style={{ fontSize: 26, fontWeight: 700, color: '#0F172A', marginBottom: 8 }}>Welcome back</h2>
          <p style={{ fontSize: 14, color: '#64748B' }}>Sign in to your HR dashboard</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#374151', marginBottom: 6 }}>Email address</label>
            <input
              className="input"
              type="email"
              placeholder="hr@techvision.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#374151', marginBottom: 6 }}>Password</label>
            <div style={{ position: 'relative' }}>
              <input
                className="input"
                type={showPw ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                style={{ paddingRight: 44 }}
              />
              <button type="button" onClick={() => setShowPw(p => !p)}
                style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8' }}>
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <div style={{ background: '#FFF1F2', border: '1px solid #FCA5A5', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#B91C1C' }}>
              {error}
            </div>
          )}

          <button type="submit" className="btn btn-primary" style={{ height: 44, justifyContent: 'center', fontSize: 15, marginTop: 4 }} disabled={loading}>
            {loading ? <Spinner size={18} color="white" /> : 'Sign In'}
          </button>
        </form>

        {/* Demo credentials */}
        <div style={{ marginTop: 24, background: '#F8FAFC', borderRadius: 10, padding: '14px 16px', border: '1px solid #E2E8F0' }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#64748B', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Demo Credentials</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 13, color: '#475569', marginBottom: 10 }}>
            <span>📧 <strong>hr@techvision.com</strong></span>
            <span>🔑 <strong>admin123</strong></span>
          </div>
          <button onClick={fillDemo} className="btn btn-outline" style={{ width: '100%', justifyContent: 'center', fontSize: 13, height: 36 }}>
            Auto-fill Demo Credentials
          </button>
        </div>

        <p style={{ textAlign: 'center', fontSize: 12, color: '#94A3B8', marginTop: 28 }}>
          TalentAI — University Capstone Project · AI-Powered HR Platform
        </p>
      </div>
    </div>
  )
}
