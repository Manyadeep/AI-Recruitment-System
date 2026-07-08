import { useEffect, useState } from 'react'
import { ChevronDown, ChevronUp, Copy, Check } from 'lucide-react'
import { getQuestions } from '../services/api'
import Badge from '../components/ui/Badge'
import { PageSpinner } from '../components/ui/Spinner'

const ROLES = ['Software Engineer', 'Data Analyst', 'Product Manager']
const CATEGORIES = ['Technical', 'Behavioral', 'Situational']
const DIFFICULTIES = ['Easy', 'Medium', 'Hard']

function QuestionCard({ q }) {
  const [expanded, setExpanded] = useState(false)
  const [copied, setCopied] = useState(false)

  const copy = () => {
    navigator.clipboard.writeText(q.question)
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  return (
    <div className="card" style={{ padding: 0, marginBottom: 10, overflow: 'hidden' }}>
      <div
        onClick={() => setExpanded(e => !e)}
        style={{ padding: '16px 20px', cursor: 'pointer', display: 'flex', alignItems: 'flex-start', gap: 12, justifyContent: 'space-between' }}
      >
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
            <Badge label={q.category} type="category" />
            <Badge label={q.difficulty} type="difficulty" />
          </div>
          <p style={{ fontSize: 14, fontWeight: 500, color: '#0F172A', lineHeight: 1.5 }}>{q.question}</p>
        </div>
        <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
          <button onClick={e => { e.stopPropagation(); copy() }} className="btn btn-ghost" style={{ padding: 6 }} title="Copy question">
            {copied ? <Check size={14} color="#10B981" /> : <Copy size={14} />}
          </button>
          {expanded ? <ChevronUp size={16} color="#94A3B8" /> : <ChevronDown size={16} color="#94A3B8" />}
        </div>
      </div>
      {expanded && q.sample_answer && (
        <div style={{ padding: '0 20px 16px', borderTop: '1px solid #F1F5F9' }}>
          <div style={{ paddingTop: 12 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#4F46E5', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
              💡 Sample Answer
            </div>
            <p style={{ fontSize: 13, color: '#475569', lineHeight: 1.65, background: '#F8FAFC', padding: '12px 14px', borderRadius: 8, border: '1px solid #E2E8F0' }}>
              {q.sample_answer}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default function InterviewQuestionBank() {
  const [allQuestions, setAllQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeRole, setActiveRole] = useState('Software Engineer')
  const [category, setCategory] = useState('')
  const [difficulty, setDifficulty] = useState('')

  useEffect(() => {
    getQuestions().then(res => { setAllQuestions(res.data); setLoading(false) }).catch(() => setLoading(false))
  }, [])

  const filtered = allQuestions.filter(q => {
    if (q.role !== activeRole) return false
    if (category && q.category !== category) return false
    if (difficulty && q.difficulty !== difficulty) return false
    return true
  })

  const counts = CATEGORIES.reduce((acc, cat) => {
    acc[cat] = allQuestions.filter(q => q.role === activeRole && q.category === cat).length
    return acc
  }, {})

  if (loading) return <PageSpinner />

  return (
    <div className="animate-fade-up">
      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 20 }}>
        <div className="card" style={{ padding: '14px 18px' }}>
          <div style={{ fontSize: 22, fontWeight: 700, color: '#4F46E5' }}>{allQuestions.filter(q => q.role === activeRole).length}</div>
          <div style={{ fontSize: 13, color: '#64748B', marginTop: 2 }}>Total Questions</div>
        </div>
        {CATEGORIES.map(cat => (
          <div key={cat} className="card" style={{ padding: '14px 18px' }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: cat === 'Technical' ? '#4F46E5' : cat === 'Behavioral' ? '#7C3AED' : '#06B6D4' }}>{counts[cat]}</div>
            <div style={{ fontSize: 13, color: '#64748B', marginTop: 2 }}>{cat}</div>
          </div>
        ))}
      </div>

      {/* Role Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 16, background: 'white', border: '1px solid #E2E8F0', borderRadius: 10, padding: 4, width: 'fit-content' }}>
        {ROLES.map(r => (
          <button key={r} onClick={() => { setActiveRole(r); setCategory(''); setDifficulty('') }} style={{
            padding: '7px 20px', borderRadius: 7, border: 'none', cursor: 'pointer',
            background: activeRole === r ? '#4F46E5' : 'transparent',
            color: activeRole === r ? 'white' : '#64748B',
            fontWeight: 500, fontSize: 13, fontFamily: 'inherit', transition: 'all 0.15s',
          }}>{r}</button>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 16, alignItems: 'center' }}>
        <select className="input" value={category} onChange={e => setCategory(e.target.value)} style={{ width: 160, height: 38 }}>
          <option value="">All Categories</option>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select className="input" value={difficulty} onChange={e => setDifficulty(e.target.value)} style={{ width: 140, height: 38 }}>
          <option value="">All Difficulties</option>
          {DIFFICULTIES.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
        {(category || difficulty) && (
          <button className="btn btn-outline" style={{ height: 38 }} onClick={() => { setCategory(''); setDifficulty('') }}>Clear</button>
        )}
        <span style={{ fontSize: 13, color: '#94A3B8', marginLeft: 'auto' }}>{filtered.length} questions</span>
      </div>

      {/* Questions */}
      <div>
        {filtered.length === 0
          ? <div style={{ textAlign: 'center', padding: 40, color: '#94A3B8', fontSize: 14 }}>No questions match the selected filters.</div>
          : filtered.map(q => <QuestionCard key={q.id} q={q} />)
        }
      </div>
    </div>
  )
}
