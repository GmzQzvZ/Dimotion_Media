# Dimotion

Monorepo inicial para el MVP de Dimotion Media, una agencia de publicidad y producción audiovisual. Angular y Express se mantienen como aplicaciones independientes dentro de un solo repositorio Git. PostgreSQL, Auth y las migraciones usan Supabase como servicio externo.

## Estructura

```text
frontend/                 Angular standalone, rutas públicas y portales
  src/app/core/            Auth, guards y servicios globales
  src/app/shared/          Componentes reutilizables
  src/app/layout/          Navegación y estructura general
  src/app/features/        public, auth, client, campaign-tracking,
                           admin, brands, packages y models
backend/                  API Express + TypeScript
  src/config/              Variables de entorno y cliente Supabase
  src/middleware/          Auth, roles, validación y errores
  src/modules/             Campañas, marcas, paquetes, modelos,
                           perfiles y reservas (preparado)
  src/routes/              Registro central de rutas
```

La navegación pública no requiere sesión. Las rutas del cliente y de administración están protegidas por sesión de Supabase y rol de perfil (`client` / `admin`). Esas guardas mejoran la navegación, pero la autorización real de datos vive en RLS y debe mantenerse también en el backend.

## Requisitos

- Node.js 20.19 o superior (el scaffold se generó con Angular 22).
- npm.
- Proyecto Supabase propio para habilitar Auth y las rutas autenticadas.
- Figma para los diseños; los enlaces y archivos de diseño se administran por separado.

## Instalación y ejecución

Desde la raíz:

```bash
npm run install:all
```

En dos terminales, desde la raíz:

```bash
npm run frontend
```

```bash
npm run backend
```

Angular queda disponible normalmente en `http://localhost:4200`; Express escucha en `http://localhost:3000`. La comprobación pública de salud es `GET http://localhost:3000/api/health`. También se puede ejecutar `npm run build` desde la raíz para compilar ambas aplicaciones.

## Configuración manual

1. Copia `backend/.env.example` a `backend/.env` y define `PORT`, `SUPABASE_URL` y `SUPABASE_ANON_KEY`. No se necesita una clave `service_role` y nunca debe enviarse al navegador.
2. Copia `frontend/.env.example` como referencia y configura `supabaseUrl` y `supabaseAnonKey` en `frontend/src/environments/environment.ts`. La clave anon/pública es la única clave Supabase que debe aparecer en el frontend; la seguridad depende de RLS.
3. Aplica `backend/supabase/migrations/20261023000000_initial_schema.sql` a tu proyecto Supabase con Supabase CLI o el SQL Editor. La migración crea tablas, índices, triggers, historial de estados y políticas RLS.
4. La migración crea perfiles con rol `client` al registrarse. Para promover una cuenta a administradora, hazlo desde un entorno de confianza, por ejemplo en el SQL Editor tras verificar el usuario: `update public.profiles set role = 'admin' where email = 'correo-verificado@ejemplo.com';`. Nunca permitas que una persona se asigne su propio rol.

Sin credenciales, la aplicación Angular y el backend compilan, las pruebas locales funcionan y `GET /api/health` responde. La autenticación y las rutas que acceden a datos requieren Supabase configurado.

## API del backend

Todos los endpoints devuelven JSON salvo los `DELETE`, que responden `204`. Las rutas protegidas requieren `Authorization: Bearer <access_token>` de Supabase Auth. Los roles se obtienen del perfil validado por el backend; RLS vuelve a aplicar el aislamiento en PostgreSQL.

| Método | Ruta | Acceso | Uso |
| --- | --- | --- | --- |
| `GET` | `/api/health` | Público | Estado del servicio |
| `GET` | `/api/packages` y `/api/packages/:packageId` | Público | Paquetes activos |
| `GET` | `/api/packages/manage` | Administrador | Todos los paquetes |
| `POST` | `/api/packages` | Administrador | Crear paquete |
| `PATCH`, `DELETE` | `/api/packages/:packageId` | Administrador | Actualizar o eliminar paquete |
| `GET` | `/api/campaigns` | Cliente/administrador | Campañas visibles para el perfil |
| `GET` | `/api/campaigns/:campaignId/history` | Cliente/administrador | Historial de estados |
| `POST` | `/api/campaigns` | Administrador | Crear campaña |
| `PATCH` | `/api/campaigns/:campaignId/status` | Administrador | Actualizar estado |
| `GET` | `/api/brands` y `/api/brands/:brandId` | Cliente/administrador | Marcas propias o todas para administración |
| `POST`, `PATCH`, `DELETE` | `/api/brands[/:brandId]` | Administrador | Gestionar marcas |
| `GET` | `/api/models` y `/api/models/:modelId` | Administrador | Consultar modelos |
| `GET` | `/api/models/manage` | Administrador | Todos los modelos |
| `POST`, `PATCH`, `DELETE` | `/api/models[/:modelId]` | Administrador | Gestionar modelos |
| `GET` | `/api/users` y `/api/users/:userId` | Administrador | Consultar perfiles |
| `PATCH` | `/api/users/:userId` | Administrador | Actualizar nombre o rol |
| `GET` | `/api/reservations` y `/api/reservations/:reservationId` | Cliente/administrador | Reservas propias o todas para administración |
| `POST` | `/api/reservations` | Cliente | Solicitar una reserva para una marca propia |
| `PATCH`, `DELETE` | `/api/reservations/:reservationId` | Administrador | Gestionar reservas |

Los cuerpos de campañas usan `brandId`, `packageId` y `modelId`; las demás propiedades reflejan los nombres de columnas en `snake_case`, excepto las reservas, que reciben `brandId`, `campaignId` y `scheduledAt`. Los errores de validación responden `400`, la falta de sesión `401`, la falta de permisos `403`, recursos inexistentes `404` y conflictos de integridad `409`.

Para compilar y ejecutar las pruebas del backend:

```bash
npm --prefix backend run build
npm --prefix backend test
```

## Datos y seguridad

- `profiles.id` referencia `auth.users.id`; no se guardan contraseñas.
- `brands.owner_profile_id` enlaza marcas con el perfil cliente y `campaigns.brand_id` restringe campañas por marca.
- `campaigns` referencia opcionalmente paquetes y modelos; `campaign_status_history` guarda cada estado inicial/cambio mediante trigger.
- Los estados son `payment_received`, `production`, `editing`, `delivery` y `completed`.
- Clientes pueden leer campañas e historial de sus marcas; solo administradores pueden insertar o cambiar campañas. El historial se registra con trigger y las campañas no se eliminan para conservar la auditoría.
- Los paquetes activos son legibles públicamente; los modelos y operaciones administrativas están restringidos.
- Clientes pueden solicitar reservas vinculadas a sus propias marcas; solo administradores las actualizan o eliminan.
- Fotografías y videos no se almacenan en PostgreSQL en este MVP. Si se requiere alojarlos, se debe evaluar Supabase Storage con políticas propias.

## Diseño

Usa Figma para los flujos, wireframes y sistema visual de Dimotion. No se incluye un archivo ni una URL de Figma porque no se proporcionaron credenciales o un diseño existente.