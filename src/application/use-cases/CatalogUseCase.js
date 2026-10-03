import { apiClient } from '../../infrastructure/http/ApiClient.js';

export class CatalogUseCase {
  async getProducts(params = {}) {
    const searchParams = new URLSearchParams();
    if (params.page) searchParams.append('page', params.page);
    if (params.size) searchParams.append('size', params.size);
    if (params.categoryId) searchParams.append('categoryId', params.categoryId);

    const query = searchParams.toString() ? `?${searchParams.toString()}` : '';
    return await apiClient.request(`/api/products${query}`);
  }

  async getCategories() {
    return await apiClient.request('/api/categories');
  }

  async createProduct(data) {
    return await apiClient.request('/api/products', {
      method: 'POST',
      body: data,
    });
  }

  async updateProduct(id, data) {
    return await apiClient.request(`/api/products/${id}`, {
      method: 'PUT',
      body: data,
    });
  }

  async deleteProduct(id) {
    return await apiClient.request(`/api/products/${id}`, {
      method: 'DELETE',
    });
  }
}

export const catalogUseCase = new CatalogUseCase();
