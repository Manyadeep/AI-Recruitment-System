import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Download, ChevronLeft, ChevronRight, FileText } from 'lucide-react'
import { getCandidate, getResumeUrl } from '../services/api'
import Badge from '../components/ui/Badge'
import Avatar from '../components/ui/Avatar'
import { formatScore, scoreColor } from '../utils/formatters'
import { PageSpinner } from '../components/ui/Spinner'

// Simulate resume content display from parsed .docx
function ResumeContent({ candidate }) {
  const score = candidate.cv_score
  return (
    <div style={{ fontFamily: 'Georgia, serif', lineHeight: 1.7, color: '#1a1a1a', maxWidth: 700, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ borderBottom: '2px solid #4F46E5', paddingBottom: 16, marginBottom: 20 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: '#0F172A', marginBottom: 4 }}>{candidate.name}</h1>
        <div style={{ fontSize: 14, color: '#475569', display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          {candidate.email && <span>📧 {candidate.email}</span>}
          {candidate.phone && <span>📞 {candidate.phone}</span>}
          {candidate.location && <span>📍 {candidate.location}</span>}
        </div>
      </div>

      {/* Objective */}
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 14, fontWeight: 700, color: '#4F46E5', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8, borderLeft: '3px solid #4F46E5', paddingLeft: 10 }}>Professional Summary</h2>
        <p style={{ fontSize: 14, color: '#374151' }}>
          Experienced {candidate.applied_role} with {candidate.experience_years} years of industry experience.
          Proficient in {candidate.skills?.slice(0, 4).join(', ') || 'various technologies'} and passionate about building scalable, high-quality solutions.
          Seeking to leverage technical expertise and problem-solving skills in a dynamic enterprise environment.
        </p>
      </div>

      {/* Education */}
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 14, fontWeight: 700, color: '#4F46E5', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8, borderLeft: '3px solid #4F46E5', paddingLeft: 10 }}>Education</h2>
        <div style={{ fontSize: 14 }}>
          <div style={{ fontWeight: 600, color: '#0F172A' }}>{candidate.education}</div>
          <div style={{ color: '#64748B', fontSize: 13 }}>Graduated: 2021 &nbsp;|&nbsp; Grade: First Class</div>
        </div>
      </div>

      {/* Experience */}
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 14, fontWeight: 700, color: '#4F46E5', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8, borderLeft: '3px solid #4F46E5', paddingLeft: 10 }}>Work Experience</h2>
        <div style={{ marginBottom: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ fontWeight: 600, fontSize: 14, color: '#0F172A' }}>{candidate.applied_role}</div>
            <div style={{ fontSize: 13, color: '#64748B' }}>2022 — Present</div>
          </div>
          <div style={{ fontSize: 13, color: '#4F46E5', marginBottom: 8 }}>Tech Startup, {candidate.location}</div>
          <ul style={{ paddingLeft: 18, fontSize: 13, color: '#374151', display: 'flex', flexDirection: 'column', gap: 4 }}>
            <li>Developed and maintained production-grade applications using {candidate.skills?.[0] || 'modern technologies'}</li>
            <li>Collaborated with cross-functional teams to deliver features on schedule</li>
            <li>Improved system performance by 35% through code optimization</li>
            <li>Participated in agile sprints, code reviews, and architecture discussions</li>
          </ul>
        </div>
      </div>

      {/* Skills */}
      {candidate.skills?.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <h2 style={{ fontSize: 14, fontWeight: 700, color: '#4F46E5', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8, borderLeft: '3px solid #4F46E5', paddingLeft: 10 }}>Technical Skills</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {candidate.skills.map(s => (
              <span key={s} style={{ padding: '4px 12px', background: '#EEF2FF', color: '#4338CA', borderRadius: 4, fontSize: 13, fontFamily: 'monospace' }}>{s}</span>
            ))}
          </div>
        </div>
      )}

      {/* AI Score note */}
      {score && (
        <div style={{ marginTop: 24, padding: '12px 16px', background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 8 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#15803D', marginBottom: 4 }}>🤖 AI Screening Result</div>
          <div style={{ fontSize: 13, color: '#166534' }}>Overall Score: <strong>{formatScore(score.overall_score)}/100</strong> · Status: <strong>{score.screening_status}</strong></div>
          {score.notes && <div style={{ fontSize: 12, color: '#15803D', marginTop: 4, fontStyle: 'italic' }}>{score.notes}</div>}
        </div>
      )}
    </div>
  )
}

export default function ResumeViewer() {
  const { id } = useParams()
  const [candidate, setCandidate] = useState(null)
  const [loading, setLoading] = useState(true)

  // Simple navigation: C001→C030
  const numId = parseInt(id?.replace('C', '') || '1')
  const prevId = numId > 1 ? `C${String(numId - 1).padStart(3, '0')}` : null
  const nextId = numId < 30 ? `C${String(numId + 1).padStart(3, '0')}` : null

  useEffect(() => {
    setLoading(true)
    getCandidate(id).then(res => { setCandidate(res.data); setLoading(false) }).catch(() => setLoading(false))
  }, [id])

  if (loading) return <PageSpinner />
  if (!candidate) return <div style={{ padding: 40, textAlign: 'center', color: '#94A3B8' }}>Candidate not found.</div>

  return (
    <div className="animate-fade-up" style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 20, height: 'calc(100vh - 88px - 48px)' }}>
      {/* Left panel */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Link to={`/candidates/${id}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#64748B', textDecoration: 'none' }}>
          <ArrowLeft size={14} /> Back to Profile
        </Link>

        <div className="card" style={{ padding: 20 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, marginBottom: 16, textAlign: 'center' }}>
            <Avatar name={candidate.name} size={56} fontSize={20} />
            <div>
              <div style={{ fontWeight: 700, fontSize: 15, color: '#0F172A' }}>{candidate.name}</div>
              <div style={{ fontSize: 13, color: '#64748B' }}>{candidate.applied_role}</div>
            </div>
            <Badge label={candidate.status} type="status" />
          </div>

          {candidate.cv_score && (
            <div style={{ textAlign: 'center', padding: '12px', background: scoreColor(candidate.cv_score.overall_score) + '12', borderRadius: 10, marginBottom: 16 }}>
              <div style={{ fontSize: 26, fontWeight: 800, color: scoreColor(candidate.cv_score.overall_score) }}>
                {formatScore(candidate.cv_score.overall_score)}
              </div>
              <div style={{ fontSize: 12, color: '#64748B' }}>AI Score</div>
              <Badge label={candidate.cv_score.screening_status} type="screening" style={{ marginTop: 6 }} />
            </div>
          )}

          <a href={getResumeUrl(id)} download style={{ textDecoration: 'none' }}>
            <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', gap: 6 }}>
              <Download size={14} /> Download .docx
            </button>
          </a>
        </div>

        {/* Navigation */}
        <div style={{ display: 'flex', gap: 8 }}>
          {prevId
            ? <Link to={`/candidates/${prevId}/resume`} style={{ flex: 1, textDecoration: 'none' }}>
                <button className="btn btn-outline" style={{ width: '100%', justifyContent: 'center' }}><ChevronLeft size={14} /> Prev</button>
              </Link>
            : <button className="btn btn-outline" disabled style={{ flex: 1, justifyContent: 'center' }}><ChevronLeft size={14} /> Prev</button>
          }
          {nextId
            ? <Link to={`/candidates/${nextId}/resume`} style={{ flex: 1, textDecoration: 'none' }}>
                <button className="btn btn-outline" style={{ width: '100%', justifyContent: 'center' }}>Next <ChevronRight size={14} /></button>
              </Link>
            : <button className="btn btn-outline" disabled style={{ flex: 1, justifyContent: 'center' }}>Next <ChevronRight size={14} /></button>
          }
        </div>
        <div style={{ fontSize: 12, textAlign: 'center', color: '#94A3B8' }}>{candidate.id} of C030</div>
      </div>

      {/* Resume panel */}
      <div className="card" style={{ padding: '32px 40px', overflowY: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24, paddingBottom: 16, borderBottom: '1px solid #F1F5F9' }}>
          <FileText size={16} color="#4F46E5" />
          <span style={{ fontSize: 13, fontWeight: 600, color: '#64748B' }}>Resume — {candidate.name}</span>
        </div>
        <ResumeContent candidate={candidate} />
      </div>
    </div>
  )
}
