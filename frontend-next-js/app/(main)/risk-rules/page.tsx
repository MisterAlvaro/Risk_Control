"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RulesTable } from "@/components/risk-rules/rules-table"
import { RuleFormDialog } from "@/components/risk-rules/rule-form-dialog"
import { useRiskRules, useDeleteRiskRule } from "@/lib/queries"
import type { RiskRule } from "@/lib/types"
import { Plus, Filter } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function RiskRulesPage() {
  const { toast } = useToast()
  const [page, setPage] = useState(1)
  const [isActiveFilter, setIsActiveFilter] = useState<string>("all")
  const [severityFilter, setSeverityFilter] = useState<string>("all")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingRule, setEditingRule] = useState<RiskRule | undefined>()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deletingRule, setDeletingRule] = useState<RiskRule | undefined>()

  const queryParams: Record<string, string | number> = { page }
  if (isActiveFilter !== "all") queryParams.is_active = isActiveFilter
  if (severityFilter !== "all") queryParams.severity = severityFilter

  const { data, isLoading } = useRiskRules(queryParams)
  const deleteMutation = useDeleteRiskRule()

  const handleEdit = (rule: RiskRule) => {
    setEditingRule(rule)
    setDialogOpen(true)
  }

  const handleDelete = (rule: RiskRule) => {
    setDeletingRule(rule)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!deletingRule) return

    try {
      await deleteMutation.mutateAsync(deletingRule.id)
      toast({
        title: "Rule deleted",
        description: "Risk rule has been deleted successfully.",
      })
      setDeleteDialogOpen(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete rule",
        variant: "destructive",
      })
    }
  }

  const handleCreateNew = () => {
    setEditingRule(undefined)
    setDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Risk Rules</h1>
          <p className="text-muted-foreground">Manage and configure risk monitoring rules</p>
        </div>
        <Button onClick={handleCreateNew}>
          <Plus className="mr-2 h-4 w-4" />
          Create Rule
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Rules List</CardTitle>
              <CardDescription>
                {data?.meta?.total || 0} total rules • Page {page} of {data?.meta?.last_page || 1}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={isActiveFilter} onValueChange={setIsActiveFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="1">Active Only</SelectItem>
                  <SelectItem value="0">Inactive Only</SelectItem>
                </SelectContent>
              </Select>
              <Select value={severityFilter} onValueChange={setSeverityFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Severity</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                  <SelectItem value="soft">Soft</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-16" />
              ))}
            </div>
          ) : (
            <>
              <RulesTable rules={data?.data || []} onEdit={handleEdit} onDelete={handleDelete} />
              {data && data.meta.last_page > 1 && (
                <div className="mt-4 flex items-center justify-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => setPage(page - 1)} disabled={page === 1}>
                    Previous
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Page {page} of {data.meta.last_page}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(page + 1)}
                    disabled={page === data.meta.last_page}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <RuleFormDialog open={dialogOpen} onOpenChange={setDialogOpen} rule={editingRule} />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Risk Rule</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deletingRule?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
