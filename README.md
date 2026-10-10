# test-simple-stock-flow-app

> **Prueba técnica · Ficha ADSO 3413974**
> Horario: de **9:00 a. m. a 3:00 p. m.** (15:00)

Este repositorio es el **frontend** de *Simple Stock Flow*, en **React**. **Empieza vacío a propósito**: se construye en el fork de cada aprendiz.

## Instrucciones

Cada aprendiz debe **crear el fork** de los seis repositorios del proyecto y **resolver el proyecto
con el spec planteado**.

1. Hacer fork, a su cuenta de GitHub, de cada repositorio de la tabla del final.
2. Leer el spec en [`test-simple-stock-flow-docs`](https://github.com/code-sena/test-simple-stock-flow-docs).
   Se entrega en dos versiones: `spec-python/` y `spec-.net/`.
3. Desarrollar en los forks.

## El reto se desarrolla con React y PHP (Laravel)

El spec está escrito para Python y para .NET, pero el reto **no** se hace en esos lenguajes:

| Capa | Tecnología del reto |
|---|---|
| Frontend | React |
| Backend | PHP con Laravel |

Lo que el spec define sobre el negocio —historias, criterios de aceptación, reglas, contrato de la
API, modelo de datos— se respeta. Lo que define sobre la tecnología se traduce a React y Laravel.

## La prueba no consiste en escribir el código

El propósito principal es ver la **capacidad de desempeño con SDD** (*Spec-Driven Development*,
desarrollo guiado por especificación): cómo se lee, se interpreta y se aplica una especificación
para llevarla a un stack distinto. El código es el medio, no el fin.

## Los seis repositorios

| Repositorio | Qué va ahí |
|---|---|
| [`test-simple-stock-flow-docs`](https://github.com/code-sena/test-simple-stock-flow-docs) | El spec: `spec-python/` y `spec-.net/` |
| [`test-simple-stock-flow-api`](https://github.com/code-sena/test-simple-stock-flow-api) | Backend en PHP (Laravel) |
| [`test-simple-stock-flow-app`](https://github.com/code-sena/test-simple-stock-flow-app) | Frontend en React |
| [`test-simple-stock-flow-page`](https://github.com/code-sena/test-simple-stock-flow-page) | Sitio público estático de presentación |
| [`test-simple-stock-flow-infra`](https://github.com/code-sena/test-simple-stock-flow-infra) | Contenedores, red, volúmenes y motor de base de datos vacío |
| [`test-simple-stock-flow-tool`](https://github.com/code-sena/test-simple-stock-flow-tool) | Utilidades: sembrador de datos de demostración |

---

# Documentación Técnica de Implementación — Nivel Senior

## 1. Ficha Técnica del Frontend

- **Tecnología Principal:** React 18.2+ con JSX moderno
- **Herramienta de Empaquetado:** Vite 5.x
- **Estilo Arquitectónico:** Arquitectura Onion (Cebolla) pura en cliente con Inversión de Dependencias (DIP)
- **Gestión de Sesión:** Token JWT almacenado en memoria/cliente con persistencia en `localStorage`
- **Consumo de API:** Adaptador HTTP desacoplado mediante el puerto `HttpClientPort`
- **Estilos:** CSS3 nativo modularizado con diseño responsivo

---

## 2. Topología de la Arquitectura Onion en Frontend

A diferencia de las arquitecturas tradicionales de React donde los componentes se mezclan directamente con llamadas `fetch` o `axios`, esta aplicación implementa **Arquitectura Onion en 4 Anillos Concéntricos**:

```
                    ARQUITECTURA ONION (FRONTEND SPA)
                    
         ┌────────────────────────────────────────────────────────┐
         │  COMPOSITION ROOT (BOOTSTRAP)                          │
         │  src/infrastructure/bootstrap.js                       │
         │  Inyecta adaptadores HTTP a los Casos de Uso           │
         └───────────────────────────┬────────────────────────────┘
        ┌────────────────────────────┴─────────────────────────────┐
        ▼                                                          ▼
┌──────────────────────────────┐            ┌──────────────────────────────┐
│  ANILLO 4: PRESENTACIÓN      │            │  ANILLO 3: INFRAESTRUCTURA   │
│  src/features/               │            │  src/infrastructure/         │
│  - LoginView (Autenticación) │            │  - ApiClient (Fetch/Headers) │
│  - CatalogView (Catálogo)    │            │  - bootstrap.js (Wiring)     │
│  - CartView (Carrito/Venta)  │            │  - Storage & Interceptors    │
│  - SalesHistoryView (Ventas) │            └──────────────┬───────────────┘
│  - ReportView (Reportes)     │                           │
└──────────────┬───────────────┘                           │
               │                                           │
               │           imports hacia adentro           │
               ▼                                           ▼
             ┌──────────────────────────────────────────────────┐
             │  ANILLO 2: APLICACIÓN                            │
             │  src/application/                                │
             │  - use-cases/ (Auth, Catalog, Sale, Report)      │
             │  - ports/ (HttpClientPort)                       │
             │  CERO dependencias hacia Infrastructure/React    │
             └─────────────────────────┬────────────────────────┘
                                       │ solo importa Domain
                                       ▼
             ┌──────────────────────────────────────────────────┐
             │  ANILLO 1: DOMINIO (NÚCLEO PURO)                 │
             │  src/domain/                                     │
             │  - model/ (Cart.js, Money.js)                    │
             │  - Reglas puras de negocio y cálculos en memoria │
             │  JavaScript PURO. 0 React / 0 librerías externas.│
             └──────────────────────────────────────────────────┘
```

### Reglas de Dependencia Inviolables
1. **Dominio (`src/domain/`):** Modelos inmutables como `Cart` y `Money`. No contiene lógica de React ni referencias a la red.
2. **Aplicación (`src/application/`):** Casos de uso (`CatalogUseCase`, `SaleUseCase`, etc.). Definen sus contratos mediante `HttpClientPort`. **Tienen prohibido importar `infrastructure/`**.
3. **Infraestructura (`src/infrastructure/`):** Implementa el cliente HTTP y amarra las dependencias en `bootstrap.js`.
4. **Presentación (`src/features/`):** Componentes visuales de React que interactúan únicamente a través de los casos de uso.

---

## 3. Módulos Funcionales y Casos de Uso

| Módulo | Componente React | Caso de Uso | Responsabilidad de Negocio |
|---|---|---|---|
| **Autenticación** | `LoginView.jsx` | `AuthUseCase.js` | Inicio de sesión, control de rol (`admin`/`seller`), registro de vendedores y cierre de sesión. |
| **Catálogo** | `CatalogView.jsx` | `CatalogUseCase.js` | Exploración de productos paginados, filtrado por categorías, gestión CRUD y carga de fotografías (solo admin). |
| **Carrito y Venta**| `CartView.jsx` | `SaleUseCase.js` | Prevención en UI de agregar más unidades que las disponibles en stock, cálculo reactivo de totales y registro atómico de ventas. |
| **Historial** | `SalesHistoryView.jsx`| `SaleUseCase.js` | Consulta paginada de ventas pasadas con desglose de ítems congelados. |
| **Reportes** | `ReportView.jsx` | `ReportUseCase.js` | Filtros por rango de fechas (`from`, `to`), resumen de recaudación total en COP y agrupación por producto. |

---

## 4. Variables de Entorno y Configuración

| Variable | Tipo | Valor Recomendado | Descripción |
|---|---|---|---|
| `VITE_API_URL` | string | `http://localhost:8000` | URL base de la API REST de backend. |

En el despliegue integrado con Docker, las peticiones hacia `/api/` y `/media/` son enrutadas transparentemente por el reverse proxy (Nginx).

---

## 5. Puesta en Marcha y Compilación

### Modo Desarrollo Local:
```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar servidor de desarrollo con Vite
npm run dev
```
La aplicación estará disponible en `http://localhost:5173`.

### Compilación para Producción:
```bash
# Generar los artefactos estáticos optimizados en /dist
npm run build

# Previsualizar el build de producción
npm run preview
```
