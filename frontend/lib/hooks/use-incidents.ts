import { useApi } from "./use-api";
import { apiClient } from "../api/client";
import { endpoints } from "../api/endpoints";

export function useIncidents() {
  return useApi(() => apiClient(endpoints.incidents));
}

