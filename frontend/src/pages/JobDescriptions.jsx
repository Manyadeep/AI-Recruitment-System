import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { MapPin, Users, Briefcase, Clock, ChevronRight } from 'lucide-react'
import { getJobs } from '../services/api'
import Badge from '../components/ui/Badge'
import { PageSpinner } from '../components/ui/Spinner'
import { formatDate } from '../utils/formatters'

export default function JobDescriptions() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getJobs().then(res => { setJobs(res.data); setLoading(false) }).catch(() => setLoading(false))
  }, [])

  if (loading) return <PageSpinner />

  const DEPT_COLORS = { Engineering: '#4F46E5', 'Data & Analytics': '#7C3AED', 'Product Management': '#06B6D4' }

  return (
    <div className="animate-fade-up">
      {/* Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 24 }}>
        {jobs.map(j => (
          <div key={j.id} className="card" style={{ padding: '16px 20px' }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: DEPT_COLORS[j.department] || '#4F46E5' }}>{j.applicant_count}</div>
            <div style={{ fontSize: 13, color: '#64748B', marginTop: 2 }}>{j.title} Applicants</div>
          </div>
        ))}
      </div>

      {/* Job Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {jobs.map(j => {
          const deptColor = DEPT_COLORS[j.department] || '#4F46E5'
          return (
            <div key={j.id} className="card" style={{ padding: '24px 28px', borderLeft: `4px solid ${deptColor}` }}>
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, flexWrap: 'wrap' }}>
                    <h2 style={{ fontSize: 20, fontWeight: 700, color: '#0F172A' }}>{j.title}</h2>
                    <span style={{ padding: '3px 10px', borderRadius: 6, background: deptColor + '15', color: deptColor, fontSize: 12, fontWeight: 600 }}>{j.department}</span>
                    <Badge label={j.status} type="status" />
                  </div>
                  <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, color: '#64748B' }}><MapPin size={13} /> {j.location}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, color: '#64748B' }}><Clock size={13} /> {j.type}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, color: '#64748B' }}><Briefcase size={13} /> {j.openings} opening{j.openings > 1 ? 's' : ''}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, color: '#64748B' }}><Users size={13} /> {j.applicant_count} applicants</span>
                  </div>
                </div>
                <Link to={`/candidates?role=${encodeURIComponent(j.title)}`} style={{ textDecoration: 'none' }}>
                  <button className="btn btn-primary" style={{ gap: 6, whiteSpace: 'nowrap' }}>
                    View Applicants <ChevronRight size={14} />
                  </button>
                </Link>
              </div>

              {/* Description */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#475569', marginBottom: 8 }}>Role Overview</div>
                <p style={{ fontSize: 14, color: '#374151', lineHeight: 1.65 }}>{j.description}</p>
              </div>

              {/* Requirements */}
              {j.requirements && (
                <div style={{ background: '#F8FAFC', borderRadius: 10, padding: '14px 16px', border: '1px solid #E2E8F0' }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#475569', marginBottom: 8 }}>Requirements</div>
                  <p style={{ fontSize: 13, color: '#475569', lineHeight: 1.65 }}>{j.requirements}</p>
                </div>
              )}

              {/* Footer */}
              <div style={{ marginTop: 16, paddingTop: 14, borderTop: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 12, color: '#94A3B8' }}>Posted: {formatDate(j.created_at)}</span>
                <div style={{ display: 'flex', gap: 12 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#10B981' }}>✓ {j.openings} Open Position{j.openings > 1 ? 's' : ''}</span>
                  <span style={{ fontSize: 13, color: '#64748B' }}>{j.applicant_count} Total Applications</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
