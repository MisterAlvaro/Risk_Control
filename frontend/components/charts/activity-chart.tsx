'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const data = [
  { day: 'Lun', incidents: 4, resolved: 3 },
  { day: 'Mar', incidents: 8, resolved: 6 },
  { day: 'Mié', incidents: 6, resolved: 4 },
  { day: 'Jue', incidents: 12, resolved: 9 },
  { day: 'Vie', incidents: 10, resolved: 8 },
  { day: 'Sab', incidents: 5, resolved: 4 },
  { day: 'Dom', incidents: 7, resolved: 5 },
]

export function ActivityChart() {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis dataKey="day" stroke="var(--muted-foreground)" style={{ fontSize: '12px' }} />
        <YAxis stroke="var(--muted-foreground)" style={{ fontSize: '12px' }} />
        <Tooltip 
          contentStyle={{
            backgroundColor: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: '8px',
            color: 'var(--foreground)'
          }}
        />
        <Bar dataKey="incidents" fill="var(--primary)" radius={[8, 8, 0, 0]} />
        <Bar dataKey="resolved" fill="#10b981" radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
