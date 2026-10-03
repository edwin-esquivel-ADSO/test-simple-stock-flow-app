import { apiClient } from '../../infrastructure/http/ApiClient.js';

export class ReportUseCase {
  async getSalesReport(from, to) {
    const fromIso = encodeURIComponent(from);
    const toIso = encodeURIComponent(to);
    return await apiClient.request(`/api/reports/sales?from=${fromIso}&to=${toIso}`);
  }
}

export const reportUseCase = new ReportUseCase();
