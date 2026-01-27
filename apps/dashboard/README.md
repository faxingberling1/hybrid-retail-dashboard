dashboard
├── .env.local
├── .next
│   ├── app-build-manifest.json
│   ├── build-manifest.json
│   ├── cache
│   ├── package.json
│   ├── react-loadable-manifest.json
│   ├── server
│   │   ├── app
│   │   │   ├── api
│   │   │   │   ├── auth
│   │   │   │   │   └── [...nextauth]
│   │   │   │   │       └── route.js
│   │   │   │   ├── database
│   │   │   │   │   └── route.js
│   │   │   │   └── notifications
│   │   │   │       └── route.js
│   │   │   ├── login
│   │   │   │   ├── page.js
│   │   │   │   └── page_client-reference-manifest.js
│   │   │   └── super-admin
│   │   │       ├── database
│   │   │       │   ├── page.js
│   │   │       │   └── page_client-reference-manifest.js
│   │   │       ├── page.js
│   │   │       ├── page_client-reference-manifest.js
│   │   │       ├── settings
│   │   │       │   ├── page.js
│   │   │       │   └── page_client-reference-manifest.js
│   │   │       └── system
│   │   │           ├── page.js
│   │   │           └── page_client-reference-manifest.js
│   │   ├── app-paths-manifest.json
│   │   ├── edge-runtime-webpack.js
│   │   ├── middleware-build-manifest.js
│   │   ├── middleware-manifest.json
│   │   ├── middleware-react-loadable-manifest.js
│   │   ├── middleware.js
│   │   ├── next-font-manifest.js
│   │   ├── next-font-manifest.json
│   │   ├── pages-manifest.json
│   │   ├── server-reference-manifest.js
│   │   ├── server-reference-manifest.json
│   │   ├── static
│   │   │   └── webpack
│   │   │       └── 633457081244afec._.hot-update.json
│   │   ├── vendor-chunks
│   │   │   ├── @babel.js
│   │   │   ├── @panva.js
│   │   │   ├── @reduxjs.js
│   │   │   ├── @swc.js
│   │   │   ├── @tanstack.js
│   │   │   ├── clsx.js
│   │   │   ├── d3-array.js
│   │   │   ├── d3-color.js
│   │   │   ├── d3-format.js
│   │   │   ├── d3-interpolate.js
│   │   │   ├── d3-path.js
│   │   │   ├── d3-scale.js
│   │   │   ├── d3-shape.js
│   │   │   ├── d3-time-format.js
│   │   │   ├── d3-time.js
│   │   │   ├── date-fns.js
│   │   │   ├── decimal.js-light.js
│   │   │   ├── es-toolkit.js
│   │   │   ├── eventemitter3.js
│   │   │   ├── framer-motion.js
│   │   │   ├── immer.js
│   │   │   ├── internmap.js
│   │   │   ├── jose.js
│   │   │   ├── lucide-react.js
│   │   │   ├── next-auth.js
│   │   │   ├── next.js
│   │   │   ├── oauth.js
│   │   │   ├── oidc-token-hash.js
│   │   │   ├── openid-client.js
│   │   │   ├── preact-render-to-string.js
│   │   │   ├── preact.js
│   │   │   ├── react-is.js
│   │   │   ├── react-redux.js
│   │   │   ├── recharts.js
│   │   │   ├── redux-thunk.js
│   │   │   ├── redux.js
│   │   │   ├── reselect.js
│   │   │   ├── sonner.js
│   │   │   ├── tiny-invariant.js
│   │   │   ├── use-sync-external-store.js
│   │   │   ├── uuid.js
│   │   │   └── victory-vendor.js
│   │   └── webpack-runtime.js
│   ├── static
│   │   ├── chunks
│   │   │   ├── _app-pages-browser_node_modules_recharts_es6_index_js.js
│   │   │   ├── app
│   │   │   │   ├── layout.js
│   │   │   │   ├── login
│   │   │   │   │   └── page.js
│   │   │   │   └── super-admin
│   │   │   │       ├── database
│   │   │   │       │   └── page.js
│   │   │   │       ├── layout.js
│   │   │   │       ├── page.js
│   │   │   │       ├── settings
│   │   │   │       │   └── page.js
│   │   │   │       └── system
│   │   │   │           └── page.js
│   │   │   ├── app-pages-internals.js
│   │   │   ├── main-app.js
│   │   │   ├── polyfills.js
│   │   │   └── webpack.js
│   │   ├── css
│   │   │   └── app
│   │   │       └── layout.css
│   │   ├── development
│   │   │   ├── _buildManifest.js
│   │   │   └── _ssgManifest.js
│   │   ├── media
│   │   │   ├── 19cfc7226ec3afaa-s.woff2
│   │   │   ├── 21350d82a1f187e9-s.woff2
│   │   │   ├── 8e9860b6e62d6359-s.woff2
│   │   │   ├── ba9851c3c22cd980-s.woff2
│   │   │   ├── c5fe6dc8356a8c31-s.woff2
│   │   │   ├── df0a9ae256c0569c-s.woff2
│   │   │   └── e4af272ccee01ff0-s.p.woff2
│   │   └── webpack
│   │       ├── 37b503fd1a1f4e66.webpack.hot-update.json
│   │       ├── 633457081244afec._.hot-update.json
│   │       ├── 83b3383f7fcd96c1.webpack.hot-update.json
│   │       ├── app
│   │       │   └── layout.83b3383f7fcd96c1.hot-update.js
│   │       ├── c2edfa2a9643994f.webpack.hot-update.json
│   │       ├── d54b4b144e637d61.webpack.hot-update.json
│   │       ├── d62ddd6022a4301d.webpack.hot-update.json
│   │       ├── webpack.37b503fd1a1f4e66.hot-update.js
│   │       ├── webpack.83b3383f7fcd96c1.hot-update.js
│   │       ├── webpack.c2edfa2a9643994f.hot-update.js
│   │       ├── webpack.d54b4b144e637d61.hot-update.js
│   │       └── webpack.d62ddd6022a4301d.hot-update.js
│   ├── trace
│   └── types
│       ├── app
│       │   ├── api
│       │   │   ├── auth
│       │   │   │   └── [...nextauth]
│       │   │   │       └── route.ts
│       │   │   ├── database
│       │   │   │   └── route.ts
│       │   │   └── notifications
│       │   │       └── route.ts
│       │   ├── layout.ts
│       │   ├── login
│       │   │   └── page.ts
│       │   └── super-admin
│       │       ├── database
│       │       │   └── page.ts
│       │       ├── layout.ts
│       │       ├── page.ts
│       │       ├── settings
│       │       │   └── page.ts
│       │       └── system
│       │           └── page.ts
│       └── package.json
├── README.md
├── app
│   ├── admin
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── api
│   │   ├── analytics
│   │   │   └── route.ts
│   │   ├── auth
│   │   │   └── [...nextauth]
│   │   │       └── route.ts
│   │   ├── database
│   │   │   └── route.ts
│   │   ├── debug-session
│   │   │   └── route.ts
│   │   ├── notifications
│   │   │   ├── [id]
│   │   │   │   └── route.ts
│   │   │   ├── read
│   │   │   │   └── route.ts
│   │   │   └── route.ts
│   │   ├── public
│   │   │   └── db-test
│   │   │       └── route.ts
│   │   └── users
│   │       └── route.ts
│   ├── globals.css
│   ├── layout.tsx
│   ├── login
│   │   └── page.tsx
│   ├── notifications
│   │   └── page.tsx
│   ├── page.tsx
│   ├── providers.tsx
│   ├── proxy.ts
│   ├── super-admin
│   │   ├── analytics
│   │   │   └── page.tsx
│   │   ├── billing
│   │   │   └── page.tsx
│   │   ├── database
│   │   │   └── page.tsx
│   │   ├── layout.tsx
│   │   ├── logs
│   │   ├── organizations
│   │   │   └── page.tsx
│   │   ├── page.tsx
│   │   ├── settings
│   │   │   └── page.tsx
│   │   ├── system
│   │   │   └── page.tsx
│   │   └── users
│   │       └── page.tsx
│   ├── unauthorized
│   │   └── page.tsx
│   └── user
│       ├── layout.tsx
│       └── page.tsx
├── components
│   ├── dashboard
│   │   ├── admin-header.tsx
│   │   ├── admin-sidebar.tsx
│   │   ├── billing-stats.tsx
│   │   ├── header.tsx
│   │   ├── layout-wrapper.tsx
│   │   ├── notification-bell.tsx
│   │   ├── sidebar.tsx
│   │   ├── super-admin-header.tsx
│   │   ├── super-admin-sidebar.tsx
│   │   ├── user-header.tsx
│   │   └── user-sidebar.tsx
│   ├── shared
│   └── ui
│       ├── notification-dropdown.tsx
│       └── tooltip.tsx
├── lib
│   ├── api
│   │   ├── billing.ts
│   │   └── database
│   │       └── route.ts
│   ├── auth-utils.ts
│   ├── auth.ts
│   ├── db
│   │   └── migrations
│   │       ├── 001_initial_schema.sql
│   │       └── 002_notifications.sql
│   ├── db.ts
│   ├── hooks
│   │   └── use-notification.ts
│   ├── middleware
│   │   └── database-permissions.ts
│   ├── models
│   │   ├── index.ts
│   │   ├── notification.model.ts
│   │   ├── organization.model.ts
│   │   └── user.model.ts
│   ├── pusher.ts
│   ├── repositories
│   │   ├── index.ts
│   │   └── user.repository.ts
│   ├── services
│   │   ├── database.service.ts
│   │   └── notification.service.ts
│   ├── types
│   │   └── notification.ts
│   └── utils
├── middleware.ts
├── next-env.d.ts
├── next.config.js
├── node_modules
├── package.json
├── postcss.config.js
├── public
├── scripts
│   ├── check-db.ts
│   ├── cleanup.ts
│   ├── create-db.ts
│   ├── debug-env.ts
│   ├── final-verification.ts
│   ├── fix-db.ts
│   ├── init-db.ts
│   ├── migrate-direct.ts
│   ├── migrate-notifications-complete.ts
│   ├── migrate.ts
│   ├── reset-db.ts
│   ├── seed.ts
│   ├── setup-db.ts
│   ├── test-auth.ts
│   ├── test-connection.ts
│   ├── test-db-final.ts
│   ├── test-db.ts
│   ├── test-notification-api.ts
│   ├── test-notification-system.ts
│   └── test-notifications.ts
├── tailwind.config.ts
├── tsconfig.json
└── types
    └── next-auth.d.ts