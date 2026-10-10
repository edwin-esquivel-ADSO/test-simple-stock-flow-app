export class ReportUseCase {
  constructor(httpClient = null) {
    this.httpClient = httpClient;
  }

  setHttpClient(httpClient) {
    this.httpClient = httpClient;
  }

  get client() {
    if (!this.httpClient) {
      throw new Error('HttpClientPort not bound in ReportUseCase');
    }
    return this.httpClient;
  }

  async getSalesReport(from, to) {
    const fromIso = encodeURIComponent(from);
    const toIso = encodeURIComponent(to);
    return await this.client.request(`/api/reports/sales?from=${fromIso}&to=${toIso}`);
  }
}

export const reportUseCase = new ReportUseCase();
