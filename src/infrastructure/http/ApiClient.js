export class ApiClient {
  constructor(baseUrl = '') {
    this.baseUrl = baseUrl;
  }

  getToken() {
    return localStorage.getItem('access_token');
  }

  setToken(token) {
    if (token) {
      localStorage.setItem('access_token', token);
    } else {
      localStorage.removeItem('access_token');
    }
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      'Accept': 'application/json',
      ...(options.headers || {}),
    };

    const token = this.getToken();
    if (token && !headers['Authorization']) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    if (options.body && !(options.body instanceof FormData) && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json';
      options.body = JSON.stringify(options.body);
    }

    const response = await fetch(url, { ...options, headers });

    if (response.status === 401) {
      this.setToken(null);
      window.dispatchEvent(new Event('auth:unauthorized'));
    }

    if (response.status === 204 || response.headers.get('content-length') === '0') {
      return null;
    }

    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json') || contentType.includes('application/problem+json')) {
      const data = await response.json();
      if (!response.ok) {
        const error = new Error(data.detail || data.title || 'Error en la solicitud');
        error.status = response.status;
        error.data = data;
        throw error;
      }
      return data;
    }

    if (!response.ok) {
      const error = new Error(`Error HTTP ${response.status}`);
      error.status = response.status;
      throw error;
    }

    return response;
  }
}

export const apiClient = new ApiClient();
