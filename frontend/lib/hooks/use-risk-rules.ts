import { useApi } from "./use-api";
import { apiClient } from "../api/client";
import { endpoints } from "../api/endpoints";

export function useRiskRules() {
  return useApi(() => apiClient(endpoints.rules));
}

