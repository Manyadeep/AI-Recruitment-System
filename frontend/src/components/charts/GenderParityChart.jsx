import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

export default function GenderParityChart({ data }) {
  // data: [{role, male_shortlist_rate, female_shortlist_rate}]
  if (!data?.length) return null
  const chartData = data.map(d => ({
    role: d.role.replace(' ', '\n'),
    Male: d.male_shortlist_rate,
    Female: d.female_shortlist_rate,
  }))

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={chartData} margin={{ top: 5, right: 10, left: -15, bottom: 5 }} barCategoryGap="30%">
        <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
        <XAxis dataKey="role" tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} unit="%" />
        <Tooltip
          contentStyle={{ borderRadius: 8, border: '1px solid #E2E8F0', fontSize: 13 }}
          formatter={(v, name) => [`${v}%`, name]}
        />
        <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
        <Bar dataKey="Male"   fill="#4F46E5" radius={[4,4,0,0]} maxBarSize={28} />
        <Bar dataKey="Female" fill="#EC4899" radius={[4,4,0,0]} maxBarSize={28} />
      </BarChart>
    </ResponsiveContainer>
  )
}
