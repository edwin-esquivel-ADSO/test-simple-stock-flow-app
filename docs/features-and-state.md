# Módulos y Flujos de Estado — test-simple-stock-flow-app

> **Guía de Vistas, Flujos de Negocio y Ciclo de Vida del Frontend**  
> **Prueba técnica · Ficha ADSO 3413974**

---

## 1. Módulos del Sistema

### 1.1 Autenticación (`features/auth`)
- **Login:** Captura credenciales y delega a `AuthUseCase.login()`. Almacena el token Bearer en el cliente HTTP y los datos mínimos del usuario (`username`, `role`) en `localStorage`.
- **Control de Acceso:** 
  - Vistas operativas accesibles tanto para rol `admin` como `seller`.
  - Acciones privilegiadas (crear producto, editar, baja lógica, subir imagen y registrar vendedores) visibles exclusivamente para el rol `admin`.

### 1.2 Catálogo y Productos (`features/catalog`)
- **Visualización:** Paginación reactiva controlada por servidor (`page`, `size`) y filtro por categoría.
- **Acciones Admin:** Formularios modales para alta y edición de producto con validación de precios y stock positivos. Carga asíncrona de imágenes de producto (`multipart/form-data`).

### 1.3 Carrito y Venta Atómica (`features/cart`)
- **Prevención de Sobreventa en UI:** El selector de cantidad de cada producto tiene como límite máximo el stock disponible actual reportado por la API.
- **Cálculo de Totales:** Uso del modelo `Cart.js` y `Money.js` para sumar subtotales sin pérdida de precisión.
- **Confirmación Atómica:** Al enviar la venta, se despachan las líneas a la API. Si ocurre un conflicto de concurrencia (`409 Conflict`), se le notifica al usuario para refrescar el catálogo.

### 1.4 Historial y Reportes (`features/sales` y `features/reports`)
- **Historial:** Vista cronológica de transacciones pasadas con desglose de ítems congelados.
- **Reporte:** Selección de período (`from` y `to`), visualización del total recaudado en COP y desglose consolidado por producto vendido.
