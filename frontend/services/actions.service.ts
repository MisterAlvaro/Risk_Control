import { actionsApi } from "../lib/api/endpoints";

export const fetchActions = () => actionsApi.getAll();

