# KitSana Backend

API REST de **KitSana**, la app de primeros auxilios con guías paso a paso y ruta de aprendizaje gamificada. Hecha con **Node.js + TypeScript + Express**. No usa base de datos: los datos viven en **arrays en memoria** y se reinician al reiniciar el servidor.

## Requisitos

- Node.js 18 o superior
- npm

## Instalación y ejecución

```bash
git clone <URL_DEL_REPOSITORIO>
cd kitsana-backend
npm install
cp .env.example .env      # opcional: puerto y secreto JWT
npm run dev               # desarrollo con recarga automática
```

Para producción: `npm run build && npm start`. Por defecto escucha en `http://localhost:3000`.

### Scripts npm

| Script | Descripción |
|---|---|
| `npm run dev` | Servidor con recarga automática (ts-node-dev) |
| `npm run build` | Compila TypeScript a `dist/` |
| `npm start` | Ejecuta la versión compilada |
| `npm run typecheck` | Verifica tipos sin generar archivos |

### Dependencias

- Producción: `express`, `cors`, `jsonwebtoken` (token de sesión), `bcryptjs` (contraseñas cifradas)
- Desarrollo: `typescript`, `ts-node-dev`, `@types/*`

### Variables de entorno

| Variable | Por defecto | Uso |
|---|---|---|
| `PORT` | `3000` | Puerto del servidor |
| `JWT_SECRET` | secreto de desarrollo | Firma de los tokens (cámbialo fuera de desarrollo) |

## Arquitectura

Organización **por módulos** (feature-first) y por capas dentro de cada módulo:

```
src/
├── app.ts                  # Configura Express y monta las rutas
├── server.ts               # Arranque
├── config/env.ts           # Variables de entorno
├── data/                   # "Base de datos" en memoria + datos iniciales
├── shared/                 # Errores, validación, middlewares (auth, manejo de errores)
└── modules/
    ├── auth/               # registro e inicio de sesión
    ├── guias/              # guías de primeros auxilios
    ├── perfil/             # perfil de salud y contactos de emergencia
    └── aprendizaje/        # progreso, ruta, lecciones, ranking
        ├── *.routes.ts      # define las URLs
        ├── *.controller.ts  # capa HTTP: lee la petición y responde
        ├── *.service.ts     # lógica de negocio y validaciones
        └── *.dto.ts         # tipos de entrada/salida
```

Flujo: `routes → controller → service → data`. Cuando se agregue una base de datos real, solo cambia la capa `data`/`service`.

## Endpoints

Todas las rutas empiezan con `/api/v1`. **Auth = Sí** requiere el header `Authorization: Bearer <token>`.

### Implementados

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| POST | `/auth/register` | No | Crea una cuenta y devuelve token |
| POST | `/auth/login` | No | Inicia sesión y devuelve token |
| GET | `/guias` | No | Lista guías (`?categoria=`, `?q=`) |
| GET | `/guias/:id` | No | Detalle de una guía con sus pasos |
| GET | `/perfil` | Sí | Perfil de salud del usuario |
| PUT | `/perfil` | Sí | Actualiza nombre, edad, alergias, condición médica, grupo sanguíneo |
| POST | `/perfil/contactos` | Sí | Agrega un contacto de emergencia (máx. 5) |
| DELETE | `/perfil/contactos/:id` | Sí | Elimina un contacto |
| GET | `/progreso` | Sí | Racha, XP, vidas y meta diaria |
| GET | `/ruta-aprendizaje` | Sí | Unidades y lecciones con su estado |
| POST | `/lecciones/:id/completar` | Sí | Completa una lección y suma XP |
| GET | `/ranking/semanal` | Sí | Ranking semanal del grupo |

### Solo documentados (no implementados en esta entrega)

| Método | Ruta | Auth | Motivo |
|---|---|---|---|
| POST | `/auth/recuperar-contrasena` | No | Requiere un servicio de envío de correo |
| GET | `/logros` | Sí | Pendiente de definir las reglas de las insignias |
| POST | `/emergencias/ubicacion` | Sí | Requiere un proveedor de SMS/notificaciones |

El detalle completo (params, body, respuestas) está en el documento de inventario de endpoints.

## Ejemplos con curl

```bash
# Registro
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Ana M.","correo":"ana@test.com","contrasena":"secreto123"}'

# Login (guarda el token de la respuesta)
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"correo":"ana@test.com","contrasena":"secreto123"}'

# Guías (públicas)
curl "http://localhost:3000/api/v1/guias?categoria=cardiovascular"
curl http://localhost:3000/api/v1/guias/rcp-adulto

# Rutas protegidas: reemplaza TOKEN
curl -H "Authorization: Bearer TOKEN" http://localhost:3000/api/v1/perfil

curl -X PUT http://localhost:3000/api/v1/perfil \
  -H "Authorization: Bearer TOKEN" -H "Content-Type: application/json" \
  -d '{"edad":18,"grupoSanguineo":"O+","alergias":"Penicilina"}'

curl -X POST http://localhost:3000/api/v1/perfil/contactos \
  -H "Authorization: Bearer TOKEN" -H "Content-Type: application/json" \
  -d '{"nombre":"Mamá","telefono":"+573001234567","relacion":"madre"}'

curl -H "Authorization: Bearer TOKEN" http://localhost:3000/api/v1/ruta-aprendizaje
curl -X POST -H "Authorization: Bearer TOKEN" http://localhost:3000/api/v1/lecciones/u1-l1/completar
curl -H "Authorization: Bearer TOKEN" http://localhost:3000/api/v1/ranking/semanal
```

## Formato de errores

```json
{ "error": "Datos de registro inválidos", "detalle": ["correo no tiene un formato válido"] }
```

Códigos usados: `400` datos inválidos, `401` sin token o credenciales incorrectas, `403` lección bloqueada, `404` no encontrado, `409` conflicto (correo repetido, lección ya completada), `500` error interno.

## Colección de Postman

`postman/kitsana.postman_collection.json` incluye todos los requests (implementados y documentados). Impórtala con **Import** en Postman. El request *Login* guarda el token automáticamente en la variable `token`, que usan los demás requests protegidos. Variable `baseUrl`: `http://localhost:3000`.

## Limitaciones conocidas

- Los datos se pierden al reiniciar el servidor (por diseño del taller).
- El ranking usa rivales de ejemplo y no reinicia el XP semanal automáticamente.
- No hay limitación de intentos de login ni renovación de tokens.
