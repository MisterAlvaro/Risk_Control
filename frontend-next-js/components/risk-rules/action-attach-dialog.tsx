"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useActions } from "@/lib/queries"
import { Search } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

interface ActionAttachDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAttach: (actionId: number) => void
  attachedActionIds: number[]
}

export function ActionAttachDialog({ open, onOpenChange, onAttach, attachedActionIds }: ActionAttachDialogProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const { data: actions, isLoading } = useActions({ is_active: "1" })

  const filteredActions = actions?.filter(
    (action) =>
      !attachedActionIds.includes(action.id) &&
      (action.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        action.type.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Attach Action</DialogTitle>
          <DialogDescription>Select an action to attach to this risk rule.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search actions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>

          <div className="max-h-[400px] space-y-2 overflow-y-auto">
            {isLoading ? (
              <>
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-16" />
                ))}
              </>
            ) : filteredActions && filteredActions.length > 0 ? (
              filteredActions.map((action) => (
                <div
                  key={action.id}
                  className="flex items-center justify-between rounded-lg border border-border bg-card p-4 hover:bg-accent/50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="font-medium">{action.name}</div>
                    <div className="text-sm text-muted-foreground">Type: {action.type}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{action.type}</Badge>
                    <Button size="sm" onClick={() => onAttach(action.id)}>
                      Attach
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">
                {searchTerm ? "No actions found matching your search." : "All actions are already attached."}
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
