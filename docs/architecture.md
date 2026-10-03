# Arquitectura Frontend — test-simple-stock-flow-app

> **Frontend SPA en React bajo Capas Concéntricas**
> **Prueba técnica · Ficha ADSO 3413974**

---

## 1. Organización en Capas (Frontend)

```
src/
├── domain/              # ANILLO 1: Modelos puros y reglas de carrito sin React
│   ├── model/           # Product, Cart, SaleItem, Money, Quantity
│   └── error/
├── application/         # ANILLO 2: Casos de uso de frontend
│   ├── ports/           # ProductRepository, CartRepository, SessionRepository
│   ├── use-cases/       # BrowseCatalog, AddToCart, Checkout, Login, ViewSalesReport
│   └── state/
├── infrastructure/      # ANILLO 3: Clientes HTTP y Mappers
│   ├── http/            # Axios / Fetch client, interceptores, DTOs de API
│   ├── mappers/
│   └── providers.ts
└── features/            # ANILLO 4: PRESENTACIÓN (Componentes y Páginas React)
    ├── auth/            # Login
    ├── catalog/         # Listado y mantenimiento de productos
    ├── cart/            # Carrito y venta
    ├── sales/           # Historial de ventas
    └── reports/         # Reporte de ventas
```

## 2. Regla Fundamental
Las vistas en `features/` invocan casos de uso de `application/`, nunca llaman directamente a clientes HTTP de infraestructura. Esto permite probar la lógica de cliente sin red ni navegador.
