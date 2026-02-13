'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { Download } from 'lucide-react'

export function ActivityReports({ activities, members, activityTypes }: any) {
  const [period, setPeriod] = useState('month')

  // Calculate total hours by member
  const hoursByMember = members.map((member: any) => {
    const totalMinutes = activities
      .filter((activity: any) => activity.memberId === member.id)
      .reduce((sum: number, activity: any) => sum + activity.duration, 0)
    return {
      name: member.name,
      hours: parseFloat((totalMinutes / 60).toFixed(1)),
      minutes: totalMinutes,
    }
  })

  // Calculate activities by type
  const activitiesByType = activityTypes.map((type: any) => {
    const count = activities.filter((activity: any) => activity.activityType === type.id).length
    return {
      name: type.name,
      value: count,
      color: type.color,
    }
  })

  // Total statistics
  const totalActivities = activities.length
  const totalHours = activities.reduce((sum: number, activity: any) => sum + activity.duration, 0) / 60
  const avgActivityLength = totalActivities > 0 ? Math.round(activities.reduce((sum: number, activity: any) => sum + activity.duration, 0) / totalActivities) : 0

  // Activities by day (last 7 days)
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - i)
    return {
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      count: activities.filter((activity: any) => {
        const actDate = new Date(activity.date)
        return actDate.toDateString() === date.toDateString()
      }).length,
    }
  }).reverse()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Activity Reports</h2>
          <p className="text-sm text-muted-foreground">Analytics and insights on team activities</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
          <Download className="w-4 h-4 mr-2" />
          Export Report
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Total Activities</p>
              <p className="text-3xl font-bold text-primary">{totalActivities}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Total Hours</p>
              <p className="text-3xl font-bold text-primary">{totalHours.toFixed(1)}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Avg. Duration</p>
              <p className="text-3xl font-bold text-primary">{avgActivityLength}m</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Team Members</p>
              <p className="text-3xl font-bold text-primary">{members.length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Activities by Member</CardTitle>
            <CardDescription>Total hours logged per team member</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={hoursByMember}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '0.5rem',
                  }}
                  formatter={(value) => `${value}h`}
                />
                <Legend />
                <Bar dataKey="hours" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Activities by Type</CardTitle>
            <CardDescription>Distribution of activity categories</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={activitiesByType}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {activitiesByType.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value} activities`} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Activities Last 7 Days</CardTitle>
          <CardDescription>Daily activity count</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={last7Days}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '0.5rem',
                }}
              />
              <Bar dataKey="count" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Member Activity Summary</CardTitle>
          <CardDescription>Detailed breakdown by team member</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {hoursByMember.map((member: any) => (
              <div key={member.name} className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground">{member.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {activities.filter((a: any) => a.memberName === member.name).length} activities · {member.minutes} minutes total
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary">{member.hours}</div>
                  <p className="text-sm text-muted-foreground">hours</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
