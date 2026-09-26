# Multitrato · Beta 1.0 para Vercel + Neon

Mercado de productos, servicios y alquileres para Ecuador. Proyecto editable en Next.js 16, con registro por correo y contraseña mediante Better Auth, Neon Postgres y Vercel Blob para imágenes.

## Publicar en Vercel

1. Sube esta carpeta a un repositorio privado de GitHub y conéctalo a un proyecto nuevo de Vercel. Cada cambio en `main` publicará producción y otras ramas crearán vistas previas para la Beta 2.0.
2. Desde el panel del proyecto Vercel, agrega la integración **Neon**. Vercel creará la base y añadirá una URL de conexión. Este proyecto acepta `DATABASE_URL` y también el nombre generado por la integración actual, `almacenamientomultitrato_DATABASE_URL`.
3. Crea una tienda **Vercel Blob** conectada al mismo proyecto. Esto añadirá `BLOB_READ_WRITE_TOKEN`.
4. Copia `.env.example` como `.env.local` para el desarrollo local y completa sus valores. En Vercel añade los mismos nombres como variables de entorno; nunca subas valores secretos a Git.
5. Configura `BETTER_AUTH_URL` con el dominio final de Vercel, crea `BETTER_AUTH_SECRET` aleatorio (32+ caracteres) y, opcionalmente, define `ADMIN_EMAIL`.
7. Una vez que `DATABASE_URL` esté disponible, ejecuta `npm run db:migrate` una vez para crear las tablas en Neon. Después publica con `npm run build` o deja que Vercel compile desde GitHub.

## Desarrollo local

```sh
pnpm install
copy .env.example .env.local
# Completa DATABASE_URL y el resto de variables en .env.local.
pnpm run db:migrate
pnpm run dev
```

`pnpm run db:generate` crea una nueva migración después de modificar `db/schema.ts`. `pnpm run db:push` sirve para iteración local rápida; para producción conserva y ejecuta las migraciones versionadas.

## Evolución a Beta 2.0

- La interfaz está en `app/` y los componentes en `components/`.
- El modelo de datos central está en `db/schema.ts`; las migraciones se generan en `drizzle-neon/`.
- Las credenciales viven exclusivamente en las variables de entorno de Vercel.
- Los anuncios, perfiles, chats, favoritos, reseñas y moderación se guardan en Neon; las imágenes se almacenan en Vercel Blob.

Esta copia empieza con una base vacía. Los anuncios, fotos y cuentas de la versión anterior no se trasladan automáticamente: planifica esa migración antes de cambiar el dominio público.
