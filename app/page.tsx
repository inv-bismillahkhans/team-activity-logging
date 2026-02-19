'use client'

import { useState, useEffect } from 'react'
import { Dashboard } from '@/components/dashboard'
import { ActivityForm } from '@/components/activity-form'
import { DayDetails } from '@/components/day-details'
import { MembersPanel } from '@/components/members-panel'
import { ActivityTypesPanel } from '@/components/activity-types-panel'
import { ActivityReports } from '@/components/activity-reports'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Plus, Loader2, AlertCircle } from 'lucide-react'
import { ThemeToggle } from '@/components/ui/theme-toggle'


export default function Page() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [showActivityForm, setShowActivityForm] = useState(false)
  const [showDayDetails, setShowDayDetails] = useState(false)
  const [selectedDay, setSelectedDay] = useState<number | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [formInitialDate, setFormInitialDate] = useState<Date | null>(null)
  const [activities, setActivities] = useState<any[]>([])
  const [members, setMembers] = useState<any[]>([])
  const [activityTypes, setActivityTypes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(null)
        const [actRes, memRes, typesRes] = await Promise.all([
          fetch('/api/activities'),
          fetch('/api/members'),
          fetch('/api/activity-types'),
        ])
        if (!actRes.ok) throw new Error(await actRes.text())
        if (!memRes.ok) throw new Error(await memRes.text())
        if (!typesRes.ok) throw new Error(await typesRes.text())
        const [actData, memData, typesData] = await Promise.all([
          actRes.json(),
          memRes.json(),
          typesRes.json(),
        ])
        setActivities(actData.map((a: any) => ({ ...a, date: new Date(a.date) })))
        setMembers(memData)
        setActivityTypes(typesData)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data')
        setActivities([])
        setMembers([])
        setActivityTypes([])
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleAddActivity = async (newActivity: any) => {
    try {
      const res = await fetch('/api/activities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newActivity),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Failed to save activity')
      }
      const saved = await res.json()
      setActivities((prev) => [{ ...saved, date: new Date(saved.date) }, ...prev])
      setShowActivityForm(false)
      setShowDayDetails(false)
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to save activity')
    }
  }

  const handleAddMember = async (newMember: any) => {
    try {
      const res = await fetch('/api/members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMember),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Failed to add member')
      }
      const saved = await res.json()
      setMembers((prev) => [...prev, saved])
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to add member')
    }
  }

  const handleAddActivityType = async (newType: any) => {
    try {
      const res = await fetch('/api/activity-types', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newType),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Failed to add activity type')
      }
      const saved = await res.json()
      setActivityTypes((prev) => [...prev, saved])
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to add activity type')
    }
  }

  const handleSelectDay = (day: number, date: Date) => {
    setSelectedDay(day)
    setSelectedDate(date)
    setShowDayDetails(true)
  }

  const handleOpenForm = (date: Date) => {
    setFormInitialDate(date)
  }

  const handleOpenFormFromDayDetails = () => {
    setShowDayDetails(false)
    setShowActivityForm(true)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {error && (
        <div className="bg-destructive/10 border-b border-destructive/20 px-4 py-2 flex items-center gap-2 text-destructive text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
     <nav className="border-b border-border bg-card">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary">Team Activity Logger</h1>
          <p className="text-sm text-muted-foreground">Track and manage team member activities</p>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />

          <Button
            onClick={() => setShowActivityForm(true)}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <Plus className="w-4 h-4 mr-2" />
            Log Activity
          </Button>
        </div>
      </div>
    </nav>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-secondary">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="members">Members</TabsTrigger>
            <TabsTrigger value="types">Activity Types</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <Dashboard
              activities={activities}
              members={members}
              activityTypes={activityTypes}
              onSelectDay={handleSelectDay}
              onOpenForm={handleOpenForm}
            />
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <ActivityReports activities={activities} members={members} activityTypes={activityTypes} />
          </TabsContent>

          <TabsContent value="members">
            <MembersPanel members={members} onAddMember={handleAddMember} />
          </TabsContent>

          <TabsContent value="types">
            <ActivityTypesPanel types={activityTypes} onAddType={handleAddActivityType} />
          </TabsContent>
        </Tabs>
      </div>

      {showActivityForm && (
        <ActivityForm
          members={members}
          activityTypes={activityTypes}
          onSubmit={handleAddActivity}
          onClose={() => setShowActivityForm(false)}
          initialDate={formInitialDate}
        />
      )}

      {showDayDetails && selectedDay !== null && selectedDate && (
        <DayDetails
          day={selectedDay}
          date={selectedDate}
          activities={activities}
          members={members}
          activityTypes={activityTypes}
          onClose={() => setShowDayDetails(false)}
          onAddActivity={handleOpenFormFromDayDetails}
        />
      )}
    </div>
  )
}
