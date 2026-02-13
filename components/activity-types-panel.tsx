'use client'

import React from "react"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plus } from 'lucide-react'

const defaultColors = ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444', '#06B6D4', '#EC4899', '#6366F1']

const iconOptions = ['📅', '🎓', '📊', '💼', '🚀', '💻', '🤝', '⚡']

export function ActivityTypesPanel({ types, onAddType }: any) {
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [color, setColor] = useState(defaultColors[0])
  const [selectedIcon, setSelectedIcon] = useState(iconOptions[0])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!name) {
      alert('Please enter an activity type name')
      return
    }

    const newType = {
      id: name.toLowerCase().replace(/\s+/g, '-'),
      name,
      color,
      icon: selectedIcon,
    }

    onAddType(newType)
    setName('')
    setColor(defaultColors[0])
    setSelectedIcon(iconOptions[0])
    setShowForm(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Activity Types</h2>
          <p className="text-sm text-muted-foreground">Define and customize activity categories</p>
        </div>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Type
        </Button>
      </div>

      {showForm && (
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Add New Activity Type</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-foreground">
                    Type Name *
                  </Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Conference"
                    className="bg-secondary border-border text-foreground"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="color" className="text-foreground">
                    Color
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="color"
                      type="color"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      className="bg-secondary border-border h-10 w-20"
                    />
                    <div className="text-sm text-muted-foreground mt-2">{color}</div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-foreground">Icon</Label>
                <div className="grid grid-cols-4 gap-2">
                  {iconOptions.map((icon) => (
                    <button
                      key={icon}
                      type="button"
                      onClick={() => setSelectedIcon(icon)}
                      className={`text-2xl p-2 rounded border ${
                        selectedIcon === icon ? 'border-primary bg-primary/10' : 'border-border'
                      }`}
                    >
                      {icon}
                    </button>
                  ))}
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
                  Add Type
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {types.map((type: any) => (
          <Card key={type.id} className="bg-card border-border">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div
                  className="w-16 h-16 rounded-lg flex items-center justify-center text-3xl"
                  style={{ backgroundColor: `${type.color}20`, color: type.color }}
                >
                  {type.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">{type.name}</h3>
                  <div className="flex items-center gap-2 mt-2">
                    <div
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: type.color }}
                    />
                    <span className="text-xs text-muted-foreground">{type.color}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
