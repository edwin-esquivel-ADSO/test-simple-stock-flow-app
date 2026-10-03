import { apiClient } from '../../infrastructure/http/ApiClient.js';

export class AuthUseCase {
  async login(username, password) {
    const data = await apiClient.request('/api/auth/login', {
      method: 'POST',
      body: { username, password },
    });
    apiClient.setToken(data.accessToken);
    localStorage.setItem('auth_user', JSON.stringify({
      username: data.username,
      role: data.role,
    }));
    return data;
  }

  logout() {
    apiClient.setToken(null);
    localStorage.removeItem('auth_user');
  }

  getCurrentUser() {
    const raw = localStorage.getItem('auth_user');
    return raw ? JSON.parse(raw) : null;
  }

  async registerSeller(username, password) {
    return await apiClient.request('/api/auth/register', {
      method: 'POST',
      body: { username, password },
    });
  }
}

export const authUseCase = new AuthUseCase();
