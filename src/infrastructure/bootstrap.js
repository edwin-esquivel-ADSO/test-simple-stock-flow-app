/**
 * Composition Root del Frontend en React.
 * Ensambla los adaptadores de infraestructura (ApiClient) con los casos de uso de Application.
 * Garantiza la regla de dependencia de Arquitectura Onion pura (Inward Dependency).
 */
import { apiClient } from './http/ApiClient.js';
import { authUseCase } from '../application/use-cases/AuthUseCase.js';
import { catalogUseCase } from '../application/use-cases/CatalogUseCase.js';
import { saleUseCase } from '../application/use-cases/SaleUseCase.js';
import { reportUseCase } from '../application/use-cases/ReportUseCase.js';

// Enlace de puertos con adaptadores
authUseCase.setHttpClient(apiClient);
catalogUseCase.setHttpClient(apiClient);
saleUseCase.setHttpClient(apiClient);
reportUseCase.setHttpClient(apiClient);

export {
  apiClient,
  authUseCase,
  catalogUseCase,
  saleUseCase,
  reportUseCase,
};
