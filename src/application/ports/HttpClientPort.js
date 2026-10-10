/**
 * Puerto de Entrada/Salida para clientes HTTP en la Capa de Aplicación.
 * Permite desacoplar los Casos de Uso de la implementación concreta (Fetch/Axios/ApiClient).
 */
export class HttpClientPort {
  async request(path, options = {}) {
    throw new Error('Method request() must be implemented.');
  }

  setToken(token) {
    throw new Error('Method setToken() must be implemented.');
  }
}
