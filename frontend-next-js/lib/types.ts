export interface RiskRule {
  id: number
  name: string
  description: string | null
  type: string
  type_label: string
  parameters: Record<string, unknown>
  severity: "hard" | "soft"
  incidents_before_action: number | null
  is_active: boolean
  actions: RiskAction[]
  actions_count: number
  incidents_count: number
  created_at: string
  updated_at: string
}

export interface RiskAction {
  id: number
  name: string
  type: string
  config: Record<string, unknown>
  is_active: boolean
  order: number | null
  created_at: string
  updated_at: string
}

export interface Incident {
  id: number
  account_id: number
  account_login: string
  trade_id: number | null
  trade_volume: number | null
  risk_rule_id: number
  rule_name: string
  violation_data: Record<string, unknown>
  status: "pending" | "processing" | "resolved"
  resolved_at: string | null
  created_at: string
}

export interface Account {
  id: number
  login: string
  trading_status: string
  status: string
  is_trading_enabled: boolean
  trades_count: number
  open_trades_count: number
  incidents_count: number
  active_incidents_count: number
  created_at: string
}

export interface Trade {
  id: number
  account_id: number
  account_login: string
  type: string
  volume: number
  open_time: string
  close_time: string | null
  open_price: number
  close_price: number | null
  status: string
  duration_seconds: number | null
  metadata: Record<string, unknown>
  incidents_count: number
}

export interface RiskStatus {
  account: Account
  risk_status: {
    total_incidents: number
    active_incidents: number
    trading_enabled: boolean
    rule_status: Array<{
      rule_id: number
      rule_name: string
      incidents_count: number
      is_active: boolean
    }>
    risk_level: "low" | "medium" | "high" | "critical"
  }
}

export interface DashboardStats {
  total_accounts: number
  active_incidents: number
  active_rules: number
  recent_incidents: Incident[]
  high_risk_accounts: Account[]
}
