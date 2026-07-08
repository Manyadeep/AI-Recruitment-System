import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts'

export default function ScoreRadarChart({ data }) {
  // data: { skill_match_pct, experience_score, education_score, keyword_score, overall_score }
  const chartData = [
    { subject: 'Skills',      value: data?.skill_match_pct   || 0 },
    { subject: 'Experience',  value: data?.experience_score  || 0 },
    { subject: 'Education',   value: data?.education_score   || 0 },
    { subject: 'Keywords',    value: data?.keyword_score     || 0 },
    { subject: 'Overall',     value: data?.overall_score     || 0 },
  ]

  return (
    <ResponsiveContainer width="100%" height={240}>
      <RadarChart data={chartData} margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
        <PolarGrid stroke="#E2E8F0" />
        <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12, fill: '#64748B' }} />
        <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10, fill: '#94A3B8' }} />
        <Tooltip
          formatter={(v) => [`${v.toFixed(1)}`, 'Score']}
          contentStyle={{ borderRadius: 8, border: '1px solid #E2E8F0', fontSize: 13 }}
        />
        <Radar dataKey="value" stroke="#4F46E5" fill="#4F46E5" fillOpacity={0.15} strokeWidth={2} />
      </RadarChart>
    </ResponsiveContainer>
  )
}
