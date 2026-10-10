# Arquitectura Frontend — test-simple-stock-flow-app

> **Frontend SPA en React bajo Arquitectura Onion (Cebolla) Pura**  
> **Prueba técnica · Ficha ADSO 3413974**  
> Desacoplamiento total entre lógica de negocio, casos de uso, adaptadores HTTP e interfaz visual.

---

## 1. Topología de Capas Concéntricas

La aplicación organiza su código fuente en 4 anillos estrictamente delimitados:

```
src/
├── domain/                      # ANILLO 1 (NÚCLEO): Reglas de negocio y modelos sin React
│   ├── model/
│   │   ├── Cart.js              # Manejo del carrito de compras en memoria
│   │   └── Money.js             # Formateo y validaciones monetarias
│
├── application/                 # ANILLO 2: Casos de uso de frontend y puertos
│   ├── ports/
│   │   └── HttpClientPort.js    # Interfaz/Contrato para clientes HTTP
│   └── use-cases/
│       ├── AuthUseCase.js       # Orquestación de inicio de sesión y sesión
│       ├── CatalogUseCase.js    # Casos de uso del catálogo de productos
│       ├── SaleUseCase.js       # Registro y consulta de ventas
│       └── ReportUseCase.js     # Consulta de balances y reportes
│
├── infrastructure/              # ANILLO 3: Adaptadores técnicos y Composition Root
│   ├── http/
│   │   └── ApiClient.js         # Cliente Fetch con inyección de JWT y manejo de errores
│   └── bootstrap.js             # Composition Root: inyecta adaptadores a Casos de Uso
│
└── features/                    # ANILLO 4: PRESENTACIÓN (Vistas React)
    ├── auth/LoginView.jsx
    ├── catalog/CatalogView.jsx
    ├── cart/CartView.jsx
    ├── sales/SalesHistoryView.jsx
    └── reports/ReportView.jsx
```

---

## 2. Inversión de Dependencias y Composition Root

### La Regla de Dependencia Hacia Adentro
Los casos de uso ubicados en `src/application/` **no conocen la implementación concreta del cliente HTTP**. En su lugar:
1. `src/application/ports/HttpClientPort.js` define el contrato esperado por la aplicación.
2. Cada caso de uso declara un constructor o método inyector `setHttpClient(client)` que satisface dicho puerto.
3. El módulo `src/infrastructure/bootstrap.js` actúa como el **Composition Root**: es el único punto donde se instancia el `ApiClient` y se inyecta en cada uno de los casos de uso.
4. Las vistas ubicadas en `src/features/` consumen los casos de uso ya cableados, asegurando que un cambio en la librería HTTP (ej. migrar de Fetch a Axios) no afecte en absoluto ni a la aplicación ni a la UI.
