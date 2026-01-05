import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { api, type PaginatedResponse } from "./api-client"
import type { RiskRule, RiskAction, Incident, Account, Trade, RiskStatus } from "./types"

// Risk Rules Queries
export const useRiskRules = (params?: Record<string, string | number>) => {
  const queryString = params ? `?${new URLSearchParams(params as Record<string, string>).toString()}` : ""
  return useQuery({
    queryKey: ["riskRules", params],
    queryFn: () => api.get<PaginatedResponse<RiskRule>>(`/risk-rules${queryString}`),
  })
}

export const useRiskRule = (id: number) => {
  return useQuery({
    queryKey: ["riskRule", id],
    queryFn: () => api.get<{ data: RiskRule }>(`/risk-rules/${id}`),
    select: (data) => data.data,
  })
}

export const useCreateRiskRule = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<RiskRule>) => api.post<{ data: RiskRule }>("/risk-rules", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["riskRules"] })
    },
  })
}

export const useUpdateRiskRule = (id: number) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<RiskRule>) => api.put<{ data: RiskRule }>(`/risk-rules/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["riskRules"] })
      queryClient.invalidateQueries({ queryKey: ["riskRule", id] })
    },
  })
}

export const useDeleteRiskRule = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => api.delete(`/risk-rules/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["riskRules"] })
    },
  })
}

export const useAttachAction = (ruleId: number) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (actionId: number) => api.post(`/risk-rules/${ruleId}/actions/${actionId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["riskRule", ruleId] })
    },
  })
}

export const useDetachAction = (ruleId: number) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (actionId: number) => api.delete(`/risk-rules/${ruleId}/actions/${actionId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["riskRule", ruleId] })
    },
  })
}

export const useReorderActions = (ruleId: number) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (actions: Array<{ id: number; order: number }>) =>
      api.put(`/risk-rules/${ruleId}/actions/order`, { actions }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["riskRule", ruleId] })
    },
  })
}

// Actions Queries
export const useActions = (params?: Record<string, string>) => {
  const queryString = params ? `?${new URLSearchParams(params).toString()}` : ""
  return useQuery({
    queryKey: ["actions", params],
    queryFn: () => api.get<{ data: RiskAction[] }>(`/actions${queryString}`),
    select: (data) => data.data,
  })
}

// Incidents Queries
export const useIncidents = (params?: Record<string, string | number>) => {
  const queryString = params ? `?${new URLSearchParams(params as Record<string, string>).toString()}` : ""
  return useQuery({
    queryKey: ["incidents", params],
    queryFn: () => api.get<PaginatedResponse<Incident>>(`/incidents${queryString}`),
  })
}

export const useIncident = (id: number) => {
  return useQuery({
    queryKey: ["incident", id],
    queryFn: () => api.get<{ data: Incident }>(`/incidents/${id}`),
    select: (data) => data.data,
  })
}

export const useResolveIncident = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => api.post(`/incidents/${id}/resolve`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["incidents"] })
    },
  })
}

// Accounts Queries
export const useAccounts = (params?: Record<string, string | number>) => {
  const queryString = params ? `?${new URLSearchParams(params as Record<string, string>).toString()}` : ""
  return useQuery({
    queryKey: ["accounts", params],
    queryFn: () => api.get<PaginatedResponse<Account>>(`/accounts${queryString}`),
  })
}

export const useAccount = (id: number) => {
  return useQuery({
    queryKey: ["account", id],
    queryFn: () => api.get<{ data: Account }>(`/accounts/${id}`),
    select: (data) => data.data,
  })
}

export const useAccountRiskStatus = (id: number) => {
  return useQuery({
    queryKey: ["accountRiskStatus", id],
    queryFn: () => api.get<{ data: RiskStatus }>(`/accounts/${id}/risk-status`),
    select: (data) => data.data,
  })
}

export const useAccountTrades = (id: number, params?: Record<string, string>) => {
  const queryString = params ? `?${new URLSearchParams(params).toString()}` : ""
  return useQuery({
    queryKey: ["accountTrades", id, params],
    queryFn: () => api.get<PaginatedResponse<Trade>>(`/accounts/${id}/trades${queryString}`),
  })
}

// Trades Queries
export const useTrades = (params?: Record<string, string | number>) => {
  const queryString = params ? `?${new URLSearchParams(params as Record<string, string>).toString()}` : ""
  return useQuery({
    queryKey: ["trades", params],
    queryFn: () => api.get<PaginatedResponse<Trade>>(`/trades${queryString}`),
  })
}

export const useTrade = (id: number) => {
  return useQuery({
    queryKey: ["trade", id],
    queryFn: () => api.get<{ data: Trade }>(`/trades/${id}`),
    select: (data) => data.data,
  })
}
