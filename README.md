# Aldi Fotografía — portfolio y tienda

Sitio de fotografía con portfolio, tienda (impresiones físicas + descargas
digitales) y mapa interactivo de países visitados.

**Stack:** Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · Prisma
(SQLite en local) · Stripe Checkout · Zustand · react-simple-maps.

## Puesta en marcha

```bash
npm install
cp .env.example .env      # ya trae un DATABASE_URL de SQLite listo para usar
npm run db:migrate        # crea la base de datos y las tablas
npm run db:seed           # carga categorías, países y 29 fotos de ejemplo
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

Las fotos del catálogo de ejemplo son **imágenes generadas** (gradientes),
no fotografías reales — están para que puedas ver el diseño y el flujo de
compra funcionando de inmediato. Sección "Sustituir las fotos de ejemplo"
más abajo explica cómo poner las tuyas.

## Estructura

```
src/app/            páginas (App Router): home, portfolio, ficha de foto,
                     países (mapa), sobre mí, carrito, checkout, API routes
src/components/      componentes de UI
src/lib/             acceso a datos, carrito (Zustand), Stripe, config del sitio
prisma/schema.prisma  modelo de datos (Category, Country, Photo, PriceOption, Order)
prisma/seed.ts        datos de ejemplo
public/photos/        imágenes (sustituir por las reales)
public/maps/           topojson del mapa mundial (react-simple-maps)
```

## Personalizar la marca

Edita **`src/lib/site-config.ts`**: nombre, tagline, descripción, email,
ubicación y redes sociales. Se usa en la navegación, el footer, los metadatos
SEO/Open Graph y la página "Sobre mí".

La página `/sobre-mi` (`src/app/sobre-mi/page.tsx`) tiene biografía,
trayectoria y equipo escritos como ejemplo — sustitúyelos por tu propio
texto.

## Sustituir las fotos de ejemplo

1. Añade tus archivos (JPEG/WebP recomendado) a `public/photos/`.
2. Actualiza `src/lib/seed-data.ts`: cada foto tiene `slug`, `title`,
   `description`, `location`, `capturedAt`, `category`, `country`, el
   `width`/`height` (usa la **relación de aspecto**, p. ej. `4`/`5`, no los
   píxeles reales) y sus `prices` (digital / impresiones).
3. Ajusta `src/lib/countries-geo.ts` si cambias los países — el campo
   `isoCode` es el código numérico ISO 3166-1 que usa el mapa (revisa
   [countries-110m.json](https://github.com/topojson/world-atlas) para el
   código de un país nuevo).
4. Vuelve a poblar la base de datos: `npm run db:seed`.

El script `npm run placeholders:generate` regenera las imágenes de ejemplo
(`scripts/generate-placeholders.mjs`) — no lo necesitas si ya tienes fotos
reales.

## Pagos con Stripe

1. Crea una cuenta en [Stripe](https://dashboard.stripe.com) y copia tu
   clave secreta de prueba en `STRIPE_SECRET_KEY` (archivo `.env`).
2. Para que los pedidos se marquen como pagados automáticamente, configura
   un webhook (`checkout.session.completed`) apuntando a
   `https://tu-dominio.com/api/webhook` y copia el *signing secret* en
   `STRIPE_WEBHOOK_SECRET`. En local puedes usar
   [Stripe CLI](https://stripe.com/docs/stripe-cli):
   ```bash
   stripe listen --forward-to localhost:3000/api/webhook
   ```
3. Sin claves configuradas, el botón "Ir al pago" muestra un aviso claro en
   lugar de fallar de forma confusa — así puedes probar todo el resto del
   sitio sin tener Stripe configurado todavía.
4. Cuando estés listo para vender de verdad, activa tu cuenta de Stripe y
   sustituye las claves de prueba (`sk_test_…`) por las claves live
   (`sk_live_…`).

El precio de cada artículo se recalcula **en el servidor** a partir de la
base de datos en `src/app/api/checkout/route.ts` — nunca se confía en el
precio que envía el navegador.

## Base de datos en producción

SQLite es perfecto para desarrollar sin configurar nada, pero **no es
apto para producción en plataformas serverless** (como Vercel): el
sistema de archivos es de solo lectura y no persiste entre despliegues, así
que los pedidos nuevos se perderían.

Antes de lanzar la tienda en real:

1. Crea una base de datos Postgres gestionada (por ejemplo
   [Prisma Postgres](https://www.prisma.io/postgres), [Neon](https://neon.tech)
   o [Supabase](https://supabase.com)).
2. Cambia el `provider` en `prisma/schema.prisma` de `sqlite` a `postgresql`
   y quita el generator `output` si prefieres el cliente estándar (o manten
   `prisma-client` con adapter `@prisma/adapter-pg`).
3. Actualiza `src/lib/db.ts` para usar `PrismaPg` en vez de
   `PrismaBetterSqlite3` (ver `.agents`/documentación de Prisma 7 sobre
   *driver adapters* si la necesitas).
4. Define `DATABASE_URL` con la cadena de conexión de Postgres en las
   variables de entorno del hosting.
5. Ejecuta `npx prisma migrate deploy` y `npm run db:seed` contra la nueva
   base de datos.

El catálogo (fotos, categorías, países, precios) es de solo lectura desde la
web pública — solo tú lo modificas editando `seed-data.ts`/`countries-geo.ts`
y volviendo a hacer `db:seed`, o directamente con `npm run db:studio`
(interfaz visual de Prisma) una vez tengas Postgres configurado.

## Desplegar con tu propio dominio

1. **Despliega el proyecto.** La opción más sencilla es
   [Vercel](https://vercel.com/new) (los creadores de Next.js): conecta este
   repositorio de GitHub y despliega — detecta Next.js automáticamente.
   Añade allí las variables de entorno (`DATABASE_URL`,
   `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`).
2. **Compra tu dominio** en cualquier registrador (Namecheap, Google
   Domains/Squarespace, IONOS, Dinahosting, etc.) si todavía no tienes uno.
3. **Conéctalo:** en el proyecto de Vercel ve a *Settings → Domains*, añade
   tu dominio y sigue las instrucciones para apuntar los registros DNS
   (normalmente un registro `A`/`ALIAS` en la raíz y un `CNAME` para `www`)
   desde el panel de tu registrador. La propagación puede tardar hasta 24h.
4. Actualiza `url` en `src/lib/site-config.ts` con tu dominio definitivo
   (se usa para SEO y Open Graph) y vuelve a desplegar.
5. Repite el paso del webhook de Stripe apuntando ya a tu dominio real.

Cualquier otro proveedor compatible con Next.js (Netlify, Railway, tu propio
VPS con `next start` detrás de Nginx…) funciona igual: build con
`npm run build`, arranque con `npm run start`, variables de entorno
equivalentes.

## Comandos

| Comando | Qué hace |
| --- | --- |
| `npm run dev` | Servidor de desarrollo |
| `npm run build` / `npm run start` | Build e inicio en producción |
| `npm run lint` | ESLint |
| `npm run db:migrate` | Aplica el esquema de Prisma a la base de datos |
| `npm run db:seed` | Carga/recarga los datos de ejemplo |
| `npm run db:studio` | Explorador visual de la base de datos |
| `npm run placeholders:generate` | Regenera las imágenes de ejemplo |
