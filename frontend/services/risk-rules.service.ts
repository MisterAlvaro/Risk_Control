import { riskRulesApi } from "../lib/api/endpoints";

export const fetchRiskRules = () => riskRulesApi.getAll();

