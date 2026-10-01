# Multitrato · Cloudflare + Neon

Marketplace en Next.js 16, con registro por correo y contraseña, perfiles automáticos, Neon Postgres y Cloudflare R2 para nuevas imágenes. Las imágenes anteriores de Vercel Blob siguen siendo legibles mientras el almacén anterior esté activo.

## Publicar desde GitHub

1. En Cloudflare, crea un bucket R2 llamado `multitrato-images`. No necesita acceso público: las rutas de la aplicación sirven las fotos.
2. En **Workers & Pages → Create application → Import a repository**, conecta este repositorio de GitHub y selecciona la rama con estos cambios.
3. Usa el nombre de Worker `multitrato-ec`, que debe coincidir con `wrangler.jsonc`. Comando de compilación: `npm run build:cloudflare`. Comando de despliegue: `npx wrangler deploy --config dist/server/wrangler.json`.
4. Configura los secretos `DATABASE_URL` y `BETTER_AUTH_SECRET`, y la variable `BETTER_AUTH_URL` con la URL HTTPS final del Worker. Opcional: `ADMIN_EMAIL` y `BLOB_READ_WRITE_TOKEN` para eliminar imágenes antiguas. No publiques secretos en GitHub. Si la compilación necesita estas variables, configúralas también como variables y secretos de compilación.
5. Conserva la URL de Neon y el secreto de autenticación actuales para mantener las cuentas y los anuncios. Para una base nueva, completa `.env.local` y ejecuta `npm run db:migrate` desde un equipo seguro antes del primer uso. No ejecutes migraciones automáticamente en cada despliegue.
6. Confirma en la configuración del Worker el enlace R2 `IMAGES` al bucket `multitrato-images`. Cada cambio en la rama conectada activa una compilación y un despliegue.

## Desarrollo

```sh
npm ci
cp .env.example .env.local
# Completa las variables. Para el runtime local Workers, usa también .dev.vars.
npm run dev:cloudflare
npm run typecheck
npm run build:cloudflare
```

`npm run dev` mantiene el servidor de Next.js para la interfaz; las imágenes R2 necesitan el runtime de Workers. Usa `npm run deploy` para desplegar con vinext desde un equipo autenticado en Cloudflare.

## Registro

El formulario distingue iniciar sesión de crear cuenta. El registro pide nombre y apellido, correo, contraseña y confirmación, ciudad, tipo Persona/Negocio y aceptación de términos. Better Auth valida los datos en el servidor y crea un perfil en Neon con su fecha de ingreso. El usuario puede agregar foto, WhatsApp y descripción desde Mi perfil. Elegir Negocio no concede verificación automática. Google OAuth todavía no está configurado.

## Migración de imágenes

Las nuevas fotos y avatares se almacenan en R2. No borres el almacén Vercel Blob anterior hasta copiar sus objetos y actualizar `photos.objectKey` y `profiles.avatarKey` en Neon. Este cambio no copia automáticamente las imágenes anteriores.
