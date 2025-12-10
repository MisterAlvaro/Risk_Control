import { apiClient } from "../lib/api/client";
import { endpoints } from "../lib/api/endpoints";

export const fetchIncidents = () => apiClient(endpoints.incidents);

