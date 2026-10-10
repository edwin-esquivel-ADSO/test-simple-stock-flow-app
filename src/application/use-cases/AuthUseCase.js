export class AuthUseCase {
  constructor(httpClient = null) {
    this.httpClient = httpClient;
  }

  setHttpClient(httpClient) {
    this.httpClient = httpClient;
  }

  get client() {
    if (!this.httpClient) {
      throw new Error('HttpClientPort not bound in AuthUseCase');
    }
    return this.httpClient;
  }

  async login(username, password) {
    const data = await this.client.request('/api/auth/login', {
      method: 'POST',
      body: { username, password },
    });
    this.client.setToken(data.accessToken);
    localStorage.setItem('auth_user', JSON.stringify({
      username: data.username,
      role: data.role,
    }));
    return data;
  }

  logout() {
    if (this.httpClient) {
      this.httpClient.setToken(null);
    }
    localStorage.removeItem('auth_user');
  }

  getCurrentUser() {
    const raw = localStorage.getItem('auth_user');
    return raw ? JSON.parse(raw) : null;
  }

  async registerSeller(username, password) {
    return await this.client.request('/api/auth/register', {
      method: 'POST',
      body: { username, password },
    });
  }
}

export const authUseCase = new AuthUseCase();
