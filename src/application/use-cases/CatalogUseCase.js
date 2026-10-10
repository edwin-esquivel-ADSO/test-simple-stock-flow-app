export class CatalogUseCase {
  constructor(httpClient = null) {
    this.httpClient = httpClient;
  }

  setHttpClient(httpClient) {
    this.httpClient = httpClient;
  }

  get client() {
    if (!this.httpClient) {
      throw new Error('HttpClientPort not bound in CatalogUseCase');
    }
    return this.httpClient;
  }

  async getProducts(params = {}) {
    const searchParams = new URLSearchParams();
    if (params.page) searchParams.append('page', params.page);
    if (params.size) searchParams.append('size', params.size);
    if (params.categoryId) searchParams.append('categoryId', params.categoryId);

    const query = searchParams.toString() ? `?${searchParams.toString()}` : '';
    return await this.client.request(`/api/products${query}`);
  }

  async getCategories() {
    return await this.client.request('/api/categories');
  }

  async createProduct(data) {
    return await this.client.request('/api/products', {
      method: 'POST',
      body: data,
    });
  }

  async updateProduct(id, data) {
    return await this.client.request(`/api/products/${id}`, {
      method: 'PUT',
      body: data,
    });
  }

  async deleteProduct(id) {
    return await this.client.request(`/api/products/${id}`, {
      method: 'DELETE',
    });
  }
}

export const catalogUseCase = new CatalogUseCase();
