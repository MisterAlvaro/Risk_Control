import { incidentsApi } from "../lib/api/endpoints";

export const fetchIncidents = () => incidentsApi.getAll();

