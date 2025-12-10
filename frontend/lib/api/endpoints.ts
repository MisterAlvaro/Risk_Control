import { apiClient } from './client';
import {
  RiskRule,
  Account,
  Trade,
  Incident,
  RiskAction,
  AccountRiskStatus,
  PaginatedResponse,
  CreateRiskRuleRequest,
  UpdateRiskRuleRequest,
} from './types';

export const riskRulesApi = {
  getAll: (params?: {
    is_active?: boolean;
    type?: string;
    severity?: string;
    page?: number;
  }) => apiClient.get<PaginatedResponse<RiskRule>>('/risk-rules', params),

  getById: (id: number) => apiClient.get<{ data: RiskRule }>(`/risk-rules/${id}`),

  create: (data: CreateRiskRuleRequest) => 
    apiClient.post<{ data: RiskRule }>('/risk-rules', data),

  update: (id: number, data: UpdateRiskRuleRequest) => 
    apiClient.put<{ data: RiskRule }>(`/risk-rules/${id}`, data),

  delete: (id: number) => 
    apiClient.delete<{ message: string }>(`/risk-rules/${id}`),

  attachAction: (ruleId: number, actionId: number) =>
    apiClient.post<{ message: string; rule: { data: RiskRule } }>(
      `/risk-rules/${ruleId}/actions/${actionId}`
    ),

  detachAction: (ruleId: number, actionId: number) =>
    apiClient.delete<{ message: string; rule: { data: RiskRule } }>(
      `/risk-rules/${ruleId}/actions/${actionId}`
    ),

  updateActionsOrder: (ruleId: number, actions: Array<{ id: number; order: number }>) =>
    apiClient.put<{ message: string; rule: { data: RiskRule } }>(
      `/risk-rules/${ruleId}/actions/order`,
      { actions }
    ),
};

export const accountsApi = {
  getAll: (params?: {
    trading_status?: string;
    status?: string;
    login?: string;
    page?: number;
  }) => apiClient.get<PaginatedResponse<Account>>('/accounts', params),

  getById: (id: number) => apiClient.get<{ data: Account }>(`/accounts/${id}`),

  getTrades: (accountId: number, page?: number) =>
    apiClient.get<PaginatedResponse<Trade>>(`/accounts/${accountId}/trades`, { page }),

  getRiskStatus: (accountId: number) =>
    apiClient.get<AccountRiskStatus>(`/accounts/${accountId}/risk-status`),
};

export const incidentsApi = {
  getAll: (params?: {
    account_id?: number;
    risk_rule_id?: number;
    status?: string;
    trade_id?: number;
    from_date?: string;
    to_date?: string;
    sort_by?: string;
    sort_order?: string;
    page?: number;
  }) => apiClient.get<PaginatedResponse<Incident>>('/incidents', params),

  getById: (id: number) => apiClient.get<{ data: Incident }>(`/incidents/${id}`),

  getByAccount: (accountId: number, page?: number) =>
    apiClient.get<PaginatedResponse<Incident>>(`/accounts/${accountId}/incidents`, { page }),

  getByRule: (ruleId: number, page?: number) =>
    apiClient.get<PaginatedResponse<Incident>>(`/risk-rules/${ruleId}/incidents`, { page }),

  resolve: (id: number) =>
    apiClient.post<{ message: string; incident: { data: Incident } }>(`/incidents/${id}/resolve`),
};

export const actionsApi = {
  getAll: (params?: { type?: string; is_active?: boolean }) =>
    apiClient.get<{ data: RiskAction[] }>('/actions', params),
};

export const tradesApi = {
  getAll: (params?: {
    account_id?: number;
    status?: string;
    type?: string;
    from_date?: string;
    to_date?: string;
    min_volume?: number;
    max_volume?: number;
    page?: number;
  }) => apiClient.get<PaginatedResponse<Trade>>('/trades', params),

  getById: (id: number) => apiClient.get<{ data: Trade }>(`/trades/${id}`),
};
