import { useApi } from './use-api'
import { riskRulesApi } from '../api/endpoints'

export function useRiskRules() {
  return useApi(() => riskRulesApi.getAll())
}

