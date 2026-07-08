import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'

export default function TopSkillsChart({ data }) {
  if (!data?.length) return null
  return (
    <ResponsiveContainer width="100%" height={Math.max(220, data.length * 28)}>
      <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 60, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" horizontal={false} />
        <XAxis type="number" tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} allowDecimals={false} />
        <YAxis type="category" dataKey="skill" tick={{ fontSize: 12, fill: '#475569' }} axisLine={false} tickLine={false} width={55} />
        <Tooltip
          contentStyle={{ borderRadius: 8, border: '1px solid #E2E8F0', fontSize: 13 }}
          formatter={(v) => [v, 'Candidates']}
        />
        <Bar dataKey="count" radius={[0, 5, 5, 0]} maxBarSize={18}>
          {data.map((_, i) => (
            <Cell key={i} fill={i % 2 === 0 ? '#4F46E5' : '#7C3AED'} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
