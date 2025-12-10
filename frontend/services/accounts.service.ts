import { apiClient } from "../lib/api/client";
import { endpoints } from "../lib/api/endpoints";

export const fetchAccounts = () => apiClient(endpoints.accounts);

