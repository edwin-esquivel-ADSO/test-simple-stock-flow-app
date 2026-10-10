export class SaleUseCase {
  constructor(httpClient = null) {
    this.httpClient = httpClient;
  }

  setHttpClient(httpClient) {
    this.httpClient = httpClient;
  }

  get client() {
    if (!this.httpClient) {
      throw new Error('HttpClientPort not bound in SaleUseCase');
    }
    return this.httpClient;
  }

  async registerSale(cartItems) {
    const lines = cartItems.map(item => ({
      productId: item.product.id,
      quantity: item.quantity,
    }));

    return await this.client.request('/api/sales', {
      method: 'POST',
      body: { lines },
    });
  }

  async getSales(page = 1, size = 20) {
    return await this.client.request(`/api/sales?page=${page}&size=${size}`);
  }

  async getSaleById(id) {
    return await this.client.request(`/api/sales/${id}`);
  }
}

export const saleUseCase = new SaleUseCase();
