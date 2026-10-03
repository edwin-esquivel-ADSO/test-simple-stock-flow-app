import { apiClient } from '../../infrastructure/http/ApiClient.js';

export class SaleUseCase {
  async registerSale(cartItems) {
    const lines = cartItems.map(item => ({
      productId: item.product.id,
      quantity: item.quantity,
    }));

    return await apiClient.request('/api/sales', {
      method: 'POST',
      body: { lines },
    });
  }

  async getSales(page = 1, size = 20) {
    return await apiClient.request(`/api/sales?page=${page}&size=${size}`);
  }

  async getSaleById(id) {
    return await apiClient.request(`/api/sales/${id}`);
  }
}

export const saleUseCase = new SaleUseCase();
