import { useState } from 'react'
import { User, Bell, Sliders, Moon, Save, Check } from 'lucide-react'
import useAppStore from '../store/useAppStore'

export default function Settings() {
  const { user } = useAppStore()
  const [saved, setSaved] = useState(false)
  const [weights, setWeights] = useState({ skills: 35, experience: 30, education: 20, keywords: 15 })
  const [notifications, setNotifications] = useState({ newApplication: true, screeningComplete: true, biasAlert: true, interviewReminder: true })

  const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="animate-fade-up" style={{ maxWidth: 720 }}>
      {/* Profile */}
      <div className="card" style={{ padding: 24, marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <User size={18} color="#4F46E5" />
          <h3 style={{ fontSize: 15, fontWeight: 600, color: '#0F172A' }}>Profile</h3>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#374151', marginBottom: 6 }}>Full Name</label>
            <input className="input" defaultValue={user?.name || 'Priya Sharma'} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#374151', marginBottom: 6 }}>Email</label>
            <input className="input" defaultValue={user?.email || 'hr@techvision.com'} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#374151', marginBottom: 6 }}>Role</label>
            <input className="input" defaultValue={user?.role || 'HR Manager'} readOnly style={{ background: '#F8FAFC', color: '#94A3B8' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#374151', marginBottom: 6 }}>Organization</label>
            <input className="input" defaultValue="TechVision Solutions" readOnly style={{ background: '#F8FAFC', color: '#94A3B8' }} />
          </div>
        </div>
      </div>

      {/* Scoring Weights */}
      <div className="card" style={{ padding: 24, marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Sliders size={18} color="#7C3AED" />
            <h3 style={{ fontSize: 15, fontWeight: 600, color: '#0F172A' }}>AI Scoring Weights</h3>
          </div>
          <span style={{ fontSize: 13, fontWeight: 600, color: totalWeight === 100 ? '#10B981' : '#EF4444' }}>
            Total: {totalWeight}% {totalWeight === 100 ? '✓' : '(must be 100%)'}
          </span>
        </div>
        {Object.entries(weights).map(([key, val]) => (
          <div key={key} style={{ marginBottom: 18 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <label style={{ fontSize: 14, fontWeight: 500, color: '#374151', textTransform: 'capitalize' }}>{key} Match</label>
              <span style={{ fontSize: 14, fontWeight: 700, color: '#4F46E5' }}>{val}%</span>
            </div>
            <input
              type="range" min={0} max={100} value={val}
              onChange={e => setWeights(w => ({ ...w, [key]: parseInt(e.target.value) }))}
              style={{ width: '100%', accentColor: '#4F46E5' }}
            />
          </div>
        ))}
      </div>

      {/* Notifications */}
      <div className="card" style={{ padding: 24, marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <Bell size={18} color="#F59E0B" />
          <h3 style={{ fontSize: 15, fontWeight: 600, color: '#0F172A' }}>Notifications</h3>
        </div>
        {[
          { key: 'newApplication',    label: 'New Application Received',  desc: 'When a candidate applies to an open role' },
          { key: 'screeningComplete', label: 'AI Screening Complete',      desc: 'When CV scoring finishes for a batch' },
          { key: 'biasAlert',         label: 'Bias Alert Triggered',       desc: 'When the audit detects high bias risk' },
          { key: 'interviewReminder', label: 'Interview Reminder',         desc: '24 hours before a scheduled interview' },
        ].map(({ key, label, desc }) => (
          <div key={key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0', borderBottom: '1px solid #F1F5F9' }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 500, color: '#0F172A' }}>{label}</div>
              <div style={{ fontSize: 12, color: '#94A3B8', marginTop: 2 }}>{desc}</div>
            </div>
            <div
              onClick={() => setNotifications(n => ({ ...n, [key]: !n[key] }))}
              style={{
                width: 44, height: 24, borderRadius: 999, cursor: 'pointer', flexShrink: 0,
                background: notifications[key] ? '#4F46E5' : '#E2E8F0',
                position: 'relative', transition: 'background 0.2s',
              }}
            >
              <div style={{
                position: 'absolute', top: 3, left: notifications[key] ? 22 : 3,
                width: 18, height: 18, borderRadius: '50%', background: 'white',
                boxShadow: '0 1px 3px rgba(0,0,0,0.2)', transition: 'left 0.2s',
              }} />
            </div>
          </div>
        ))}
      </div>

      {/* Save */}
      <button onClick={handleSave} className="btn btn-primary" style={{ height: 44, paddingInline: 28, gap: 8, fontSize: 15 }}>
        {saved ? <><Check size={16} /> Saved!</> : <><Save size={16} /> Save Settings</>}
      </button>
    </div>
  )
}
