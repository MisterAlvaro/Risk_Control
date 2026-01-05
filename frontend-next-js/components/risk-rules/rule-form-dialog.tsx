"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
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
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { useCreateRiskRule, useUpdateRiskRule } from "@/lib/queries"
import type { RiskRule } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

interface RuleFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  rule?: RiskRule
}

const ruleTypes = [
  "OPEN_TRADES_COUNT",
  "POSITION_SIZE",
  "DAILY_LOSS",
  "WEEKLY_LOSS",
  "MONTHLY_LOSS",
  "MAX_DRAWDOWN",
  "WIN_RATE",
  "CONSECUTIVE_LOSSES",
]

export function RuleFormDialog({ open, onOpenChange, rule }: RuleFormDialogProps) {
  const { toast } = useToast()
  const isEditing = !!rule
  const [ruleType, setRuleType] = useState(rule?.type || "OPEN_TRADES_COUNT")

  const { register, handleSubmit, formState, watch, setValue } = useForm({
    defaultValues: {
      name: rule?.name || "",
      description: rule?.description || "",
      type: rule?.type || "OPEN_TRADES_COUNT",
      severity: rule?.severity || "soft",
      incidents_before_action: rule?.incidents_before_action || 3,
      is_active: rule?.is_active ?? true,
      // Parameter fields
      time_window_minutes: (rule?.parameters?.time_window_minutes as number) || 60,
      max_open_trades: (rule?.parameters?.max_open_trades as number) || 5,
      max_position_size: (rule?.parameters?.max_position_size as number) || 100,
      threshold_amount: (rule?.parameters?.threshold_amount as number) || 1000,
      max_drawdown_percent: (rule?.parameters?.max_drawdown_percent as number) || 10,
      min_win_rate_percent: (rule?.parameters?.min_win_rate_percent as number) || 50,
      consecutive_losses_count: (rule?.parameters?.consecutive_losses_count as number) || 5,
    },
  })

  const createMutation = useCreateRiskRule()
  const updateMutation = useUpdateRiskRule(rule?.id || 0)

  const severity = watch("severity")

  const onSubmit = handleSubmit(async (data) => {
    // Build parameters based on rule type
    let parameters: Record<string, unknown> = {}

    switch (data.type) {
      case "OPEN_TRADES_COUNT":
        parameters = {
          time_window_minutes: data.time_window_minutes,
          max_open_trades: data.max_open_trades,
        }
        break
      case "POSITION_SIZE":
        parameters = {
          max_position_size: data.max_position_size,
        }
        break
      case "DAILY_LOSS":
      case "WEEKLY_LOSS":
      case "MONTHLY_LOSS":
        parameters = {
          threshold_amount: data.threshold_amount,
        }
        break
      case "MAX_DRAWDOWN":
        parameters = {
          max_drawdown_percent: data.max_drawdown_percent,
        }
        break
      case "WIN_RATE":
        parameters = {
          min_win_rate_percent: data.min_win_rate_percent,
          time_window_minutes: data.time_window_minutes,
        }
        break
      case "CONSECUTIVE_LOSSES":
        parameters = {
          consecutive_losses_count: data.consecutive_losses_count,
        }
        break
    }

    const payload = {
      name: data.name,
      description: data.description || null,
      type: data.type,
      parameters,
      severity: data.severity as "hard" | "soft",
      incidents_before_action: data.severity === "soft" ? data.incidents_before_action : null,
      is_active: data.is_active,
    }

    try {
      if (isEditing) {
        await updateMutation.mutateAsync(payload)
        toast({
          title: "Rule updated",
          description: "Risk rule has been updated successfully.",
        })
      } else {
        await createMutation.mutateAsync(payload)
        toast({
          title: "Rule created",
          description: "Risk rule has been created successfully.",
        })
      }
      onOpenChange(false)
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save rule",
        variant: "destructive",
      })
    }
  })

  const renderParameterFields = () => {
    const type = watch("type")

    switch (type) {
      case "OPEN_TRADES_COUNT":
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="time_window_minutes">Time Window (minutes)</Label>
              <Input id="time_window_minutes" type="number" {...register("time_window_minutes")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="max_open_trades">Max Open Trades</Label>
              <Input id="max_open_trades" type="number" {...register("max_open_trades")} />
            </div>
          </>
        )
      case "POSITION_SIZE":
        return (
          <div className="space-y-2">
            <Label htmlFor="max_position_size">Max Position Size</Label>
            <Input id="max_position_size" type="number" step="0.01" {...register("max_position_size")} />
          </div>
        )
      case "DAILY_LOSS":
      case "WEEKLY_LOSS":
      case "MONTHLY_LOSS":
        return (
          <div className="space-y-2">
            <Label htmlFor="threshold_amount">Threshold Amount</Label>
            <Input id="threshold_amount" type="number" step="0.01" {...register("threshold_amount")} />
          </div>
        )
      case "MAX_DRAWDOWN":
        return (
          <div className="space-y-2">
            <Label htmlFor="max_drawdown_percent">Max Drawdown (%)</Label>
            <Input id="max_drawdown_percent" type="number" step="0.01" {...register("max_drawdown_percent")} />
          </div>
        )
      case "WIN_RATE":
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="min_win_rate_percent">Min Win Rate (%)</Label>
              <Input id="min_win_rate_percent" type="number" step="0.01" {...register("min_win_rate_percent")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time_window_minutes">Time Window (minutes)</Label>
              <Input id="time_window_minutes" type="number" {...register("time_window_minutes")} />
            </div>
          </>
        )
      case "CONSECUTIVE_LOSSES":
        return (
          <div className="space-y-2">
            <Label htmlFor="consecutive_losses_count">Consecutive Losses Count</Label>
            <Input id="consecutive_losses_count" type="number" {...register("consecutive_losses_count")} />
          </div>
        )
      default:
        return null
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Risk Rule" : "Create Risk Rule"}</DialogTitle>
          <DialogDescription>
            {isEditing ? "Update the risk rule configuration." : "Configure a new risk rule for your system."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input id="name" {...register("name", { required: true })} placeholder="High open trades" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" {...register("description")} placeholder="Optional description" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Rule Type *</Label>
            <Select
              value={watch("type")}
              onValueChange={(value) => {
                setValue("type", value)
                setRuleType(value)
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ruleTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type.replace(/_/g, " ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-lg border border-border bg-muted/50 p-4 space-y-4">
            <h4 className="font-medium text-sm">Parameters</h4>
            {renderParameterFields()}
          </div>

          <div className="space-y-2">
            <Label htmlFor="severity">Severity *</Label>
            <Select value={watch("severity")} onValueChange={(value) => setValue("severity", value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="soft">Soft (warnings)</SelectItem>
                <SelectItem value="hard">Hard (immediate action)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {severity === "soft" && (
            <div className="space-y-2">
              <Label htmlFor="incidents_before_action">Incidents Before Action *</Label>
              <Input id="incidents_before_action" type="number" {...register("incidents_before_action")} />
            </div>
          )}

          <div className="flex items-center justify-between rounded-lg border border-border p-4">
            <div className="space-y-0.5">
              <Label htmlFor="is_active">Active</Label>
              <div className="text-sm text-muted-foreground">Enable this rule immediately</div>
            </div>
            <Switch
              id="is_active"
              checked={watch("is_active")}
              onCheckedChange={(checked) => setValue("is_active", checked)}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
              {(createMutation.isPending || updateMutation.isPending) && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {isEditing ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
