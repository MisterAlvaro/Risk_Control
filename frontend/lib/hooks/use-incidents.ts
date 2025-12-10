import { useApi } from './use-api'
import { incidentsApi } from '../api/endpoints'

export function useIncidents() {
  return useApi(() => incidentsApi.getAll())
}

