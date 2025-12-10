export interface PaginatedResponse<T> {
  data: T[];
  links: {
    first: string | null;
    last: string | null;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    path: string;
    per_page: number;
    to: number;
    total: number;
  };
}

export interface RiskRule {
  id: number;
  name: string;
  description: string | null;
  type: 'duration' | 'volume_consistency' | 'open_trades_count';
  type_label?: string;
  parameters: {
    min_duration_seconds?: number;
    min_factor?: number;
    max_factor?: number;
    lookback_trades?: number;
    time_window_minutes?: number;
    min_open_trades?: number;
    max_open_trades?: number;
  };
  severity: 'hard' | 'soft';
  incidents_before_action: number | null;
  is_active: boolean;
  actions?: RiskAction[];
  actions_count?: number;
  incidents_count?: number;
  created_at: string;
  updated_at: string;
}

export interface Account {
  id: number;
  login: number;
  trading_status: 'enable' | 'disable';
  status: 'enable' | 'disable';
  is_trading_enabled: boolean;
  trades_count?: number;
  open_trades_count?: number;
  incidents_count?: number;
  active_incidents_count?: number;
  created_at: string;
  updated_at: string;
}

export interface Trade {
  id: number;
  account_id: number;
  account_login?: number;
  type: 'BUY' | 'SELL';
  volume: number;
  open_time: string;
  close_time: string | null;
  open_price: number;
  close_price: number | null;
  status: 'open' | 'closed';
  duration_seconds?: number | null;
  metadata: Record<string, any>;
  incidents_count?: number;
  created_at: string;
  updated_at: string;
}

export interface Incident {
  id: number;
  account_id: number;
  account_login?: number;
  trade_id: number | null;
  trade_volume?: number;
  risk_rule_id: number;
  rule_name?: string;
  violation_data: Record<string, any>;
  status: 'pending' | 'processed' | 'action_executed';
  resolved_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface RiskAction {
  id: number;
  name: string;
  type: 'email' | 'slack' | 'disable_trading' | 'disable_account';
  config: Record<string, any> | null;
  is_active: boolean;
  order?: number;
  created_at: string;
  updated_at: string;
}

export interface AccountRiskStatus {
  account: Account;
  risk_status: {
    total_incidents: number;
    active_incidents: number;
    trading_enabled: boolean;
    risk_level: 'low' | 'medium' | 'high' | 'critical';
    rule_status: Array<{
      rule_id: number;
      rule_name: string;
      rule_type: string;
      severity: string;
      incidents_count: number;
      is_violated: boolean;
    }>;
  };
}

export interface CreateRiskRuleRequest {
  name: string;
  description?: string;
  type: 'duration' | 'volume_consistency' | 'open_trades_count';
  parameters: Record<string, any>;
  severity: 'hard' | 'soft';
  incidents_before_action?: number;
  is_active?: boolean;
}

export interface UpdateRiskRuleRequest {
  name?: string;
  description?: string;
  parameters?: Record<string, any>;
  severity?: 'hard' | 'soft';
  incidents_before_action?: number;
  is_active?: boolean;
}