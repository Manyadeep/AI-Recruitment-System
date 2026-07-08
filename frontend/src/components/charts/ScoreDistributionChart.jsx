import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { scoreColor } from '../../utils/formatters'

export default function ScoreDistributionChart({ data }) {
  if (!data?.length) return null
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
        <XAxis dataKey="range" tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 12, fill: '#64748B' }} axisLine={false} tickLine={false} allowDecimals={false} />
        <Tooltip
          contentStyle={{ borderRadius: 8, border: '1px solid #E2E8F0', fontSize: 13 }}
          formatter={(v) => [v, 'Candidates']}
        />
        <Bar dataKey="count" radius={[5, 5, 0, 0]} maxBarSize={44}>
          {data.map((entry, i) => {
            const midScore = parseInt(entry.range.split('-')[0]) + 5
            return <Cell key={i} fill={scoreColor(midScore)} />
          })}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
