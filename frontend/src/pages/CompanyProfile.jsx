import { useEffect, useState } from 'react'
import { Globe, MapPin, Users, Building2, Target, Eye } from 'lucide-react'
import { getCompany } from '../services/api'
import { PageSpinner } from '../components/ui/Spinner'

export default function CompanyProfile() {
  const [company, setCompany] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getCompany().then(res => { setCompany(res.data); setLoading(false) }).catch(() => setLoading(false))
  }, [])

  if (loading) return <PageSpinner />
  if (!company) return null

  return (
    <div className="animate-fade-up">
      {/* Hero */}
      <div className="card" style={{ padding: '32px 36px', marginBottom: 20, background: 'linear-gradient(135deg, #1E1B4B 0%, #312E81 100%)', color: 'white', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
            <div style={{ width: 64, height: 64, borderRadius: 16, background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>🏢</div>
            <div>
              <h1 style={{ fontSize: 26, fontWeight: 700, marginBottom: 4 }}>{company.name}</h1>
              <p style={{ fontSize: 14, opacity: 0.7 }}>{company.industry} · Founded {company.founded}</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, opacity: 0.8 }}><MapPin size={14} /> {company.headquarters}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, opacity: 0.8 }}><Users size={14} /> {company.size}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, opacity: 0.8 }}><Globe size={14} /> {company.website}</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        {/* Mission */}
        <div className="card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Target size={16} color="#4F46E5" /></div>
            <h3 style={{ fontSize: 15, fontWeight: 600, color: '#0F172A' }}>Mission</h3>
          </div>
          <p style={{ fontSize: 14, color: '#475569', lineHeight: 1.65 }}>{company.mission}</p>
        </div>

        {/* Vision */}
        <div className="card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: '#F5F3FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Eye size={16} color="#7C3AED" /></div>
            <h3 style={{ fontSize: 15, fontWeight: 600, color: '#0F172A' }}>Vision</h3>
          </div>
          <p style={{ fontSize: 14, color: '#475569', lineHeight: 1.65 }}>{company.vision}</p>
        </div>
      </div>

      {/* About */}
      <div className="card" style={{ padding: 24, marginBottom: 16 }}>
        <h3 style={{ fontSize: 15, fontWeight: 600, color: '#0F172A', marginBottom: 12 }}>About the Company</h3>
        <p style={{ fontSize: 14, color: '#475569', lineHeight: 1.7 }}>{company.about}</p>
      </div>

      {/* Departments */}
      <div className="card" style={{ padding: 24, marginBottom: 16 }}>
        <h3 style={{ fontSize: 15, fontWeight: 600, color: '#0F172A', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}><Building2 size={16} color="#4F46E5" /> Departments</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {company.departments.map((d, i) => {
            const colors = ['#4F46E5', '#7C3AED', '#06B6D4', '#10B981', '#F59E0B']
            const color = colors[i % colors.length]
            return (
              <div key={d.name} style={{ padding: '14px 16px', borderRadius: 10, background: color + '0D', border: `1px solid ${color}25` }}>
                <div style={{ fontSize: 20, fontWeight: 700, color }}>{d.head_count}</div>
                <div style={{ fontSize: 13, color: '#475569', marginTop: 2 }}>{d.name}</div>
                <div style={{ fontSize: 11, color: '#94A3B8' }}>employees</div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Recruitment stats */}
      <div className="card" style={{ padding: 24 }}>
        <h3 style={{ fontSize: 15, fontWeight: 600, color: '#0F172A', marginBottom: 16 }}>Current Recruitment</h3>
        <div style={{ display: 'flex', gap: 24 }}>
          <div style={{ padding: '16px 24px', background: '#EEF2FF', borderRadius: 10, textAlign: 'center' }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: '#4F46E5' }}>{company.open_roles}</div>
            <div style={{ fontSize: 13, color: '#64748B' }}>Open Roles</div>
          </div>
          <div style={{ padding: '16px 24px', background: '#F5F3FF', borderRadius: 10, textAlign: 'center' }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: '#7C3AED' }}>{company.total_applicants}</div>
            <div style={{ fontSize: 13, color: '#64748B' }}>Total Applicants</div>
          </div>
        </div>
      </div>
    </div>
  )
}
