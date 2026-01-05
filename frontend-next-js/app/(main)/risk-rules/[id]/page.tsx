"use client"

import { use, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ActionsDragList } from "@/components/risk-rules/actions-drag-list"
import { ActionAttachDialog } from "@/components/risk-rules/action-attach-dialog"
import { RuleFormDialog } from "@/components/risk-rules/rule-form-dialog"
import { useRiskRule, useAttachAction, useDetachAction, useReorderActions } from "@/lib/queries"
import { ArrowLeft, Plus, Pencil } from "lucide-react"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"

export default function RiskRuleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const ruleId = Number.parseInt(resolvedParams.id)
  const { toast } = useToast()

  const [attachDialogOpen, setAttachDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)

  const { data: rule, isLoading } = useRiskRule(ruleId)
  const attachMutation = useAttachAction(ruleId)
  const detachMutation = useDetachAction(ruleId)
  const reorderMutation = useReorderActions(ruleId)

  const handleAttach = async (actionId: number) => {
    try {
      await attachMutation.mutateAsync(actionId)
      toast({
        title: "Action attached",
        description: "Action has been attached to this rule.",
      })
      setAttachDialogOpen(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to attach action",
        variant: "destructive",
      })
    }
  }

  const handleDetach = async (actionId: number) => {
    try {
      await detachMutation.mutateAsync(actionId)
      toast({
        title: "Action detached",
        description: "Action has been removed from this rule.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to detach action",
        variant: "destructive",
      })
    }
  }

  const handleReorder = async (actions: Array<{ id: number; order: number }>) => {
    try {
      await reorderMutation.mutateAsync(actions)
      toast({
        title: "Actions reordered",
        description: "Action order has been updated.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reorder actions",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-96" />
      </div>
    )
  }

  if (!rule) {
    return <div className="text-center text-muted-foreground">Rule not found</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/risk-rules">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">{rule.name}</h1>
          <p className="text-muted-foreground">{rule.description || "No description"}</p>
        </div>
        <Button variant="outline" onClick={() => setEditDialogOpen(true)}>
          <Pencil className="mr-2 h-4 w-4" />
          Edit
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Rule Configuration</CardTitle>
            <CardDescription>Basic settings and parameters</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm font-medium text-muted-foreground">Type</div>
                <Badge variant="outline" className="mt-1">
                  {rule.type_label}
                </Badge>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">Severity</div>
                <Badge variant={rule.severity === "hard" ? "destructive" : "secondary"} className="mt-1">
                  {rule.severity}
                </Badge>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">Status</div>
                {rule.is_active ? (
                  <Badge className="mt-1 bg-green-500/10 text-green-500 border-green-500/20">Active</Badge>
                ) : (
                  <Badge variant="outline" className="mt-1">
                    Inactive
                  </Badge>
                )}
              </div>
              {rule.incidents_before_action && (
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Incidents Before Action</div>
                  <div className="mt-1 font-semibold">{rule.incidents_before_action}</div>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-border">
              <div className="text-sm font-medium mb-2">Parameters</div>
              <div className="space-y-2 rounded-lg bg-muted/50 p-3">
                {Object.entries(rule.parameters).map(([key, value]) => (
                  <div key={key} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{key.replace(/_/g, " ")}:</span>
                    <span className="font-medium">{String(value)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
              <div>
                <div className="text-sm font-medium text-muted-foreground">Total Incidents</div>
                <div className="text-2xl font-bold">{rule.incidents_count}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">Attached Actions</div>
                <div className="text-2xl font-bold">{rule.actions_count}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Actions</CardTitle>
                <CardDescription>Drag to reorder execution sequence</CardDescription>
              </div>
              <Button size="sm" onClick={() => setAttachDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Attach Action
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ActionsDragList actions={rule.actions} onReorder={handleReorder} onDetach={handleDetach} />
          </CardContent>
        </Card>
      </div>

      <ActionAttachDialog
        open={attachDialogOpen}
        onOpenChange={setAttachDialogOpen}
        onAttach={handleAttach}
        attachedActionIds={rule.actions.map((a) => a.id)}
      />

      <RuleFormDialog open={editDialogOpen} onOpenChange={setEditDialogOpen} rule={rule} />
    </div>
  )
}
