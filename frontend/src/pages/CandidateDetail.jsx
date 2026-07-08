import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Mail, Phone, MapPin, Briefcase, GraduationCap, FileText, Calendar, Star } from 'lucide-react'
import { getCandidate, getResumeUrl } from '../services/api'
import { formatDate, formatScore, scoreColor } from '../utils/formatters'
import Avatar from '../components/ui/Avatar'
import Badge from '../components/ui/Badge'
import ScoreRadarChart from '../components/charts/ScoreRadarChart'
import ProgressBar from '../components/ui/ProgressBar'
import { PageSpinner } from '../components/ui/Spinner'

function InfoRow({ icon: Icon, label, value }) {
  if (!value) return null
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 10 }}>
      <div style={{ width: 32, height: 32, borderRadius: 8, background: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icon size={14} color="#64748B" />
      </div>
      <div>
        <div style={{ fontSize: 11, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
        <div style={{ fontSize: 14, color: '#0F172A', fontWeight: 500 }}>{value}</div>
      </div>
    </div>
  )
}

export default function CandidateDetail() {
  const { id } = useParams()
  const [candidate, setCandidate] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    getCandidate(id).then(res => { setCandidate(res.data); setLoading(false) }).catch(() => setLoading(false))
  }, [id])

  if (loading) return <PageSpinner />
  if (!candidate) return <div style={{ padding: 40, textAlign: 'center', color: '#94A3B8' }}>Candidate not found.</div>

  const score = candidate.cv_score
  const scoreDimensions = score ? [
    { label: 'Skill Match',  value: score.skill_match_pct },
    { label: 'Experience',   value: score.experience_score },
    { label: 'Education',    value: score.education_score },
    { label: 'Keywords',     value: score.keyword_score },
    { label: 'Overall',      value: score.overall_score },
  ] : []

  const tabs = ['overview', 'scores', 'interviews']

  return (
    <div className="animate-fade-up">
      {/* Back */}
      <Link to="/candidates" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#64748B', textDecoration: 'none', marginBottom: 16 }}>
        <ArrowLeft size={15} /> Back to Candidates
      </Link>

      {/* Header Card */}
      <div className="card" style={{ padding: '24px 28px', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20, flexWrap: 'wrap' }}>
          <Avatar name={candidate.name} size={68} fontSize={24} />
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 6 }}>
              <h1 style={{ fontSize: 22, fontWeight: 700, color: '#0F172A' }}>{candidate.name}</h1>
              <Badge label={candidate.status} type="status" />
              {score && <Badge label={score.screening_status} type="screening" />}
            </div>
            <div style={{ fontSize: 15, color: '#64748B', marginBottom: 12 }}>{candidate.applied_role} &nbsp;·&nbsp; {candidate.experience_years} years experience</div>
            <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
              {candidate.email && <span style={{ fontSize: 13, color: '#475569', display: 'flex', alignItems: 'center', gap: 5 }}><Mail size={13} /> {candidate.email}</span>}
              {candidate.phone && <span style={{ fontSize: 13, color: '#475569', display: 'flex', alignItems: 'center', gap: 5 }}><Phone size={13} /> {candidate.phone}</span>}
              {candidate.location && <span style={{ fontSize: 13, color: '#475569', display: 'flex', alignItems: 'center', gap: 5 }}><MapPin size={13} /> {candidate.location}</span>}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, flexShrink: 0 }}>
            {score && (
              <div style={{ textAlign: 'center', padding: '12px 20px', borderRadius: 12, background: scoreColor(score.overall_score) + '15', border: `1px solid ${scoreColor(score.overall_score)}30` }}>
                <div style={{ fontSize: 28, fontWeight: 800, color: scoreColor(score.overall_score) }}>{formatScore(score.overall_score)}</div>
                <div style={{ fontSize: 11, color: '#64748B' }}>AI Score</div>
              </div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <Link to={`/candidates/${id}/resume`}>
                <button className="btn btn-primary" style={{ gap: 6 }}><FileText size={14} /> View Resume</button>
              </Link>
              <a href={getResumeUrl(id)}>
                <button className="btn btn-outline" style={{ gap: 6, width: '100%' }}>Download</button>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 20, background: 'white', border: '1px solid #E2E8F0', borderRadius: 10, padding: 4, width: 'fit-content' }}>
        {tabs.map(t => (
          <button key={t} onClick={() => setActiveTab(t)} style={{
            padding: '7px 18px', borderRadius: 7, border: 'none', cursor: 'pointer',
            background: activeTab === t ? '#4F46E5' : 'transparent',
            color: activeTab === t ? 'white' : '#64748B',
            fontWeight: 500, fontSize: 13, fontFamily: 'inherit', textTransform: 'capitalize', transition: 'all 0.15s',
          }}>
            {t === 'scores' ? 'AI Scores' : t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 20 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="card" style={{ padding: 20 }}>
              <h3 style={{ fontSize: 15, fontWeight: 600, color: '#0F172A', marginBottom: 16 }}>Profile Information</h3>
              <InfoRow icon={GraduationCap} label="Education" value={candidate.education} />
              <InfoRow icon={Briefcase}     label="Experience" value={candidate.experience_years ? `${candidate.experience_years} years` : null} />
              <InfoRow icon={MapPin}        label="Location"   value={candidate.location} />
              <InfoRow icon={Calendar}      label="Applied On" value={formatDate(candidate.applied_date)} />
              <InfoRow icon={Star}          label="Gender"     value={candidate.gender} />
              <InfoRow icon={Star}          label="Age"        value={candidate.age ? `${candidate.age} years` : null} />
            </div>
            {candidate.skills?.length > 0 && (
              <div className="card" style={{ padding: 20 }}>
                <h3 style={{ fontSize: 15, fontWeight: 600, color: '#0F172A', marginBottom: 12 }}>Skills</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {candidate.skills.map(s => (
                    <span key={s} style={{ padding: '5px 12px', borderRadius: 6, background: '#EEF2FF', color: '#4F46E5', fontSize: 13, fontWeight: 500 }}>{s}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
          {score && (
            <div className="card" style={{ padding: 20 }}>
              <h3 style={{ fontSize: 15, fontWeight: 600, color: '#0F172A', marginBottom: 4 }}>AI Screening Result</h3>
              <Badge label={score.screening_status} type="screening" style={{ marginBottom: 16 }} />
              <ScoreRadarChart data={score} />
              {score.notes && (
                <div style={{ marginTop: 16, padding: 12, background: '#F8FAFC', borderRadius: 8, border: '1px solid #E2E8F0', fontSize: 13, color: '#475569', lineHeight: 1.5 }}>
                  <div style={{ fontWeight: 600, color: '#0F172A', marginBottom: 6 }}>AI Remarks</div>
                  {score.notes}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {activeTab === 'scores' && score && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <div className="card" style={{ padding: 20 }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, color: '#0F172A', marginBottom: 16 }}>Score Breakdown</h3>
            {scoreDimensions.map(({ label, value }) => (
              <div key={label} style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 13, fontWeight: 500, color: '#475569' }}>{label}</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: scoreColor(value) }}>{formatScore(value)}</span>
                </div>
                <ProgressBar value={value} />
              </div>
            ))}
          </div>
          <div className="card" style={{ padding: 20 }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, color: '#0F172A', marginBottom: 4 }}>Radar Chart</h3>
            <ScoreRadarChart data={score} />
          </div>
        </div>
      )}

      {activeTab === 'interviews' && (
        <div className="card" style={{ padding: 20 }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: '#0F172A', marginBottom: 16 }}>Interview History</h3>
          {candidate.interviews?.length === 0
            ? <p style={{ color: '#94A3B8', fontSize: 13 }}>No interviews scheduled yet.</p>
            : candidate.interviews?.map(i => (
              <div key={i.id} style={{ padding: '14px 0', borderBottom: '1px solid #F1F5F9', display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Calendar size={16} color="#4F46E5" />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', gap: 8, marginBottom: 4 }}>
                    <span style={{ fontWeight: 600, fontSize: 14, color: '#0F172A' }}>Round {i.round} — {i.type}</span>
                    <Badge label={i.status} type="status" />
                  </div>
                  <div style={{ fontSize: 12, color: '#64748B' }}>Interviewer: {i.interviewer} · {i.scheduled_at}</div>
                  {i.feedback && <div style={{ fontSize: 13, color: '#475569', marginTop: 6, fontStyle: 'italic' }}>"{i.feedback}"</div>}
                  {i.rating && (
                    <div style={{ display: 'flex', gap: 2, marginTop: 6 }}>
                      {Array(5).fill(0).map((_, j) => (
                        <Star key={j} size={13} fill={j < Math.round(i.rating) ? '#F59E0B' : 'none'} color={j < Math.round(i.rating) ? '#F59E0B' : '#D1D5DB'} />
                      ))}
                      <span style={{ fontSize: 12, color: '#64748B', marginLeft: 4 }}>{i.rating}/5</span>
                    </div>
                  )}
                </div>
              </div>
            ))
          }
        </div>
      )}
    </div>
  )
}
