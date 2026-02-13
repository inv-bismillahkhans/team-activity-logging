'use client'

import React from "react"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plus } from 'lucide-react'

const colorOptions = [
  'bg-blue-600',
  'bg-green-600',
  'bg-purple-600',
  'bg-pink-600',
  'bg-red-600',
  'bg-yellow-600',
  'bg-indigo-600',
  'bg-cyan-600',
]

export function MembersPanel({ members, onAddMember }: any) {
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [role, setRole] = useState('')
  const [email, setEmail] = useState('')
  const [phone,setPhone] = useState('')
  const [selectedColor, setSelectedColor] = useState(colorOptions[0])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!name || !role || !email) {
      alert('Please fill in all fields')
      return
    }

    const newMember = {
      id: name.toLowerCase().replace(/\s+/g, '-'),
      name,
      role,
      email,
      color: selectedColor,
    }

    onAddMember(newMember)
    setName('')
    setRole('')
    setEmail('')
    setSelectedColor(colorOptions[0])
    setShowForm(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Team Members</h2>
          <p className="text-sm text-muted-foreground">Manage your team members</p>
        </div>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Member
        </Button>
      </div>

      {showForm && (
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Add New Member</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-foreground">
                    Name *
                  </Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Full name"
                    className="bg-secondary border-border text-foreground"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-foreground">
                    Email *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@company.com"
                    className="bg-secondary border-border text-foreground"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role" className="text-foreground">
                    Role *
                  </Label>
                  <Input
                    id="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="Job title"
                    className="bg-secondary border-border text-foreground"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-foreground">Avatar Color</Label>
                  <div className="grid grid-cols-4 gap-2">
                    {colorOptions.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setSelectedColor(color)}
                        className={`w-8 h-8 rounded ${color} ${
                          selectedColor === color ? 'ring-2 ring-primary' : ''
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowForm(false)}
                  className="border-border hover:bg-secondary"
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  Add Member
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {members.map((member: any) => (
          <Card key={member.id} className="bg-card border-border">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-lg ${member.color} flex items-center justify-center text-white font-bold`}>
                  {member.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground truncate">{member.name}</h3>
                  <p className="text-sm text-muted-foreground truncate">{member.role}</p>
                  <p className="text-xs text-muted-foreground truncate mt-1">{member.email}</p>
                  <p className="text-xs text-muted-foreground truncate mt-1">{member.phone}</p>
                  <Badge variant="secondary" className="mt-2">
                    Active
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
