import { accountsApi } from "../lib/api/endpoints";

export const fetchAccounts = () => accountsApi.getAll();

