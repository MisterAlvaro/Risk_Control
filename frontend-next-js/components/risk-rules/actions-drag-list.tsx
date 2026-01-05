"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { RiskAction } from "@/lib/types"
import { GripVertical, Trash2 } from "lucide-react"
import { Card } from "@/components/ui/card"

interface ActionsDragListProps {
  actions: RiskAction[]
  onReorder: (actions: Array<{ id: number; order: number }>) => void
  onDetach: (actionId: number) => void
}

export function ActionsDragList({ actions, onReorder, onDetach }: ActionsDragListProps) {
  const [orderedActions, setOrderedActions] = useState([...actions].sort((a, b) => (a.order || 0) - (b.order || 0)))
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)

  const handleDragStart = (index: number) => {
    setDraggedIndex(index)
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (draggedIndex === null || draggedIndex === index) return

    const newActions = [...orderedActions]
    const draggedItem = newActions[draggedIndex]
    newActions.splice(draggedIndex, 1)
    newActions.splice(index, 0, draggedItem)

    setOrderedActions(newActions)
    setDraggedIndex(index)
  }

  const handleDragEnd = () => {
    if (draggedIndex === null) return

    const reorderedActions = orderedActions.map((action, index) => ({
      id: action.id,
      order: index,
    }))

    onReorder(reorderedActions)
    setDraggedIndex(null)
  }

  if (actions.length === 0) {
    return (
      <div className="flex h-32 items-center justify-center rounded-lg border border-dashed border-border text-sm text-muted-foreground">
        No actions attached. Click "Attach Action" to add one.
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {orderedActions.map((action, index) => (
        <Card
          key={action.id}
          draggable
          onDragStart={() => handleDragStart(index)}
          onDragOver={(e) => handleDragOver(e, index)}
          onDragEnd={handleDragEnd}
          className={`flex items-center gap-3 p-4 cursor-move transition-all ${
            draggedIndex === index ? "opacity-50" : ""
          }`}
        >
          <GripVertical className="h-5 w-5 text-muted-foreground" />
          <div className="flex-1">
            <div className="font-medium">{action.name}</div>
            <div className="text-sm text-muted-foreground">Order: {index + 1}</div>
          </div>
          <Badge variant="outline">{action.type}</Badge>
          <Button variant="ghost" size="sm" onClick={() => onDetach(action.id)}>
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </Card>
      ))}
    </div>
  )
}
