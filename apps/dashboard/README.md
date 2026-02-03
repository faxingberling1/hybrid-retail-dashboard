dashboard
├── .env.local
├── .env.production
├── .next
│   ├── app-build-manifest.json
│   ├── build-manifest.json
│   ├── cache
│   ├── package.json
│   ├── react-loadable-manifest.json
│   ├── server
│   │   ├── _ssr_lib_server-auth-utils_ts.js
│   │   ├── _ssr_lib_server-db_ts.js
│   │   ├── app
│   │   │   ├── admin
│   │   │   │   ├── page.js
│   │   │   │   └── page_client-reference-manifest.js
│   │   │   ├── api
│   │   │   │   ├── auth
│   │   │   │   │   └── [...nextauth]
│   │   │   │   │       └── route.js
│   │   │   │   └── notifications
│   │   │   │       └── route.js
│   │   │   ├── auth
│   │   │   │   └── signup
│   │   │   │       ├── page.js
│   │   │   │       └── page_client-reference-manifest.js
│   │   │   ├── login
│   │   │   │   ├── page.js
│   │   │   │   └── page_client-reference-manifest.js
│   │   │   ├── page.js
│   │   │   ├── page_client-reference-manifest.js
│   │   │   ├── super-admin
│   │   │   │   ├── page.js
│   │   │   │   └── page_client-reference-manifest.js
│   │   │   ├── unauthorized
│   │   │   │   ├── page.js
│   │   │   │   └── page_client-reference-manifest.js
│   │   │   └── user
│   │   │       ├── page.js
│   │   │       └── page_client-reference-manifest.js
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
│   │   │   ├── bcryptjs.js
│   │   │   ├── clsx.js
│   │   │   ├── cookie.js
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
│   │   │   ├── pg-cloudflare.js
│   │   │   ├── pg-connection-string.js
│   │   │   ├── pg-int8.js
│   │   │   ├── pg-pool.js
│   │   │   ├── pg-protocol.js
│   │   │   ├── pg-types.js
│   │   │   ├── pg.js
│   │   │   ├── pgpass.js
│   │   │   ├── postgres-array.js
│   │   │   ├── postgres-bytea.js
│   │   │   ├── postgres-date.js
│   │   │   ├── postgres-interval.js
│   │   │   ├── preact-render-to-string.js
│   │   │   ├── preact.js
│   │   │   ├── react-is.js
│   │   │   ├── react-redux.js
│   │   │   ├── recharts.js
│   │   │   ├── redux-thunk.js
│   │   │   ├── redux.js
│   │   │   ├── reselect.js
│   │   │   ├── sonner.js
│   │   │   ├── split2.js
│   │   │   ├── styled-jsx.js
│   │   │   ├── use-sync-external-store.js
│   │   │   ├── uuid.js
│   │   │   ├── victory-vendor.js
│   │   │   └── xtend.js
│   │   └── webpack-runtime.js
│   ├── static
│   │   ├── chunks
│   │   │   ├── _app-pages-browser_lib_server-auth-utils_ts.js
│   │   │   ├── _app-pages-browser_lib_server-db_ts.js
│   │   │   ├── _app-pages-browser_node_modules_next-auth_react_index_js.js
│   │   │   ├── app
│   │   │   │   ├── admin
│   │   │   │   │   ├── layout.js
│   │   │   │   │   └── page.js
│   │   │   │   ├── auth
│   │   │   │   │   └── signup
│   │   │   │   │       ├── layout.js
│   │   │   │   │       └── page.js
│   │   │   │   ├── layout.js
│   │   │   │   ├── login
│   │   │   │   │   └── page.js
│   │   │   │   ├── page.js
│   │   │   │   ├── super-admin
│   │   │   │   │   ├── layout.js
│   │   │   │   │   └── page.js
│   │   │   │   ├── unauthorized
│   │   │   │   │   └── page.js
│   │   │   │   └── user
│   │   │   │       ├── layout.js
│   │   │   │       └── page.js
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
│   │       ├── 0f9cd33a438bff76.webpack.hot-update.json
│   │       ├── 162e9dd98721fddf.webpack.hot-update.json
│   │       ├── 1f5b9bb4f2015f7a.webpack.hot-update.json
│   │       ├── 34765b884eac7381.webpack.hot-update.json
│   │       ├── 367d035076ae48cf.webpack.hot-update.json
│   │       ├── 3b841803a6b5043f.webpack.hot-update.json
│   │       ├── 4ae8c357eac43743.webpack.hot-update.json
│   │       ├── 5b66cb281941383f.webpack.hot-update.json
│   │       ├── 633457081244afec._.hot-update.json
│   │       ├── 748df3351679844c.webpack.hot-update.json
│   │       ├── 7991bd94b1fa3140.webpack.hot-update.json
│   │       ├── 9232514e36067364.webpack.hot-update.json
│   │       ├── app
│   │       │   ├── auth
│   │       │   │   └── signup
│   │       │   │       └── page.f9dc397c294431da.hot-update.js
│   │       │   ├── layout.0f9cd33a438bff76.hot-update.js
│   │       │   ├── layout.162e9dd98721fddf.hot-update.js
│   │       │   ├── layout.1f5b9bb4f2015f7a.hot-update.js
│   │       │   ├── layout.34765b884eac7381.hot-update.js
│   │       │   ├── layout.367d035076ae48cf.hot-update.js
│   │       │   ├── layout.3b841803a6b5043f.hot-update.js
│   │       │   ├── layout.4ae8c357eac43743.hot-update.js
│   │       │   ├── layout.748df3351679844c.hot-update.js
│   │       │   ├── layout.7991bd94b1fa3140.hot-update.js
│   │       │   ├── layout.9232514e36067364.hot-update.js
│   │       │   ├── layout.d6bb8e59f1f0aa0d.hot-update.js
│   │       │   ├── layout.e74c51220d38ad11.hot-update.js
│   │       │   ├── layout.ec1b5896581d0565.hot-update.js
│   │       │   ├── layout.f964d311904672f2.hot-update.js
│   │       │   ├── layout.f9dc397c294431da.hot-update.js
│   │       │   └── login
│   │       │       └── page.3b841803a6b5043f.hot-update.js
│   │       ├── d6bb8e59f1f0aa0d.webpack.hot-update.json
│   │       ├── e74c51220d38ad11.webpack.hot-update.json
│   │       ├── ec1b5896581d0565.webpack.hot-update.json
│   │       ├── f964d311904672f2.webpack.hot-update.json
│   │       ├── f9dc397c294431da.webpack.hot-update.json
│   │       ├── webpack.0f9cd33a438bff76.hot-update.js
│   │       ├── webpack.162e9dd98721fddf.hot-update.js
│   │       ├── webpack.1f5b9bb4f2015f7a.hot-update.js
│   │       ├── webpack.34765b884eac7381.hot-update.js
│   │       ├── webpack.367d035076ae48cf.hot-update.js
│   │       ├── webpack.3b841803a6b5043f.hot-update.js
│   │       ├── webpack.4ae8c357eac43743.hot-update.js
│   │       ├── webpack.5b66cb281941383f.hot-update.js
│   │       ├── webpack.748df3351679844c.hot-update.js
│   │       ├── webpack.7991bd94b1fa3140.hot-update.js
│   │       ├── webpack.9232514e36067364.hot-update.js
│   │       ├── webpack.d6bb8e59f1f0aa0d.hot-update.js
│   │       ├── webpack.e74c51220d38ad11.hot-update.js
│   │       ├── webpack.ec1b5896581d0565.hot-update.js
│   │       ├── webpack.f964d311904672f2.hot-update.js
│   │       └── webpack.f9dc397c294431da.hot-update.js
│   ├── trace
│   └── types
│       ├── app
│       │   ├── admin
│       │   │   ├── layout.ts
│       │   │   └── page.ts
│       │   ├── api
│       │   │   ├── auth
│       │   │   │   └── [...nextauth]
│       │   │   │       └── route.ts
│       │   │   └── notifications
│       │   │       └── route.ts
│       │   ├── auth
│       │   │   └── signup
│       │   │       ├── layout.ts
│       │   │       └── page.ts
│       │   ├── layout.ts
│       │   ├── login
│       │   │   └── page.ts
│       │   ├── page.ts
│       │   ├── super-admin
│       │   │   ├── layout.ts
│       │   │   └── page.ts
│       │   ├── unauthorized
│       │   │   └── page.ts
│       │   └── user
│       │       ├── layout.ts
│       │       └── page.ts
│       ├── link.d.ts
│       └── package.json
├── .npmrc
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
│   │   ├── settings
│   │   │   ├── [section]
│   │   │   │   └── route.ts
│   │   │   ├── avatar
│   │   │   │   └── route.ts
│   │   │   ├── route.ts
│   │   │   ├── user
│   │   │   │   └── [userId]
│   │   │   │       └── route.ts
│   │   │   └── validate
│   │   │       └── email
│   │   │           └── route.ts
│   │   ├── signup
│   │   │   └── route.ts
│   │   └── users
│   │       └── route.ts
│   ├── auth
│   │   ├── signup
│   │   │   ├── components
│   │   │   │   └── signup-journey.tsx
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   └── steps
│   │   │       ├── admin-setup.tsx
│   │   │       ├── business-details.tsx
│   │   │       ├── confirmation.tsx
│   │   │       ├── industry-selection.tsx
│   │   │       └── user-invitation.tsx
│   │   └── verify
│   │       └── page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   ├── login
│   │   └── page.tsx
│   ├── notifications
│   │   └── page.tsx
│   ├── onboarding
│   │   ├── [organizationId]
│   │   │   ├── industry-setup
│   │   │   │   ├── education
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── fashion
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── healthcare
│   │   │   │   │   └── page.tsx
│   │   │   │   └── pharmacy
│   │   │   │       └── page.tsx
│   │   │   ├── invite-users
│   │   │   │   └── page.tsx
│   │   │   └── page.tsx
│   │   └── complete
│   │       └── page.tsx
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
│   │   └── theme-toggle.tsx
│   └── ui
│       ├── account-creation.tsx
│       ├── advanced-settings
│       │   ├── advanced-section.tsx
│       │   ├── api-access-section.tsx
│       │   ├── danger-zone-section.tsx
│       │   ├── data-management-section.tsx
│       │   ├── debug-tools-section.tsx
│       │   ├── index.ts
│       │   ├── logs-section.tsx
│       │   └── system-information-section.tsx
│       ├── billing-settings
│       │   ├── billing-actions-section.tsx
│       │   ├── billing-history-section.tsx
│       │   ├── current-plan-section.tsx
│       │   ├── index.tsx
│       │   ├── payment-method-section.tsx
│       │   ├── plan-comparison-section.tsx
│       │   └── usage-metrics-section.tsx
│       ├── general-settings
│       │   ├── profile-section.tsx
│       │   ├── regional-section.tsx
│       │   ├── security-section.tsx
│       │   └── theme-section.tsx
│       ├── index.ts
│       ├── integrations-settings
│       │   ├── api-key-field.tsx
│       │   ├── available-integrations-grid.tsx
│       │   ├── index.ts
│       │   ├── integration-actions.tsx
│       │   ├── integration-card.tsx
│       │   ├── integration-details-panel.tsx
│       │   ├── integration-status-badge.tsx
│       │   └── integrations-section.tsx
│       ├── notification-dropdown.tsx
│       ├── notifications-settings
│       │   ├── email-notifications-section.tsx
│       │   ├── index.tsx
│       │   ├── notification-channels-section.tsx
│       │   ├── notification-preferences-section.tsx
│       │   ├── notification-test-section.tsx
│       │   ├── push-notifications-section.tsx
│       │   └── sms-notifications-section.tsx
│       ├── security-settings
│       │   ├── index.tsx
│       │   ├── ip-whitelist-section.tsx
│       │   ├── login-security-section.tsx
│       │   ├── password-management-section.tsx
│       │   ├── security-audit-section.tsx
│       │   ├── session-section.tsx
│       │   └── two-factor-section.tsx
│       ├── settings
│       │   ├── color-selector.tsx
│       │   ├── input-field.tsx
│       │   ├── section-header.tsx
│       │   ├── select-field.tsx
│       │   ├── text-area-field.tsx
│       │   ├── theme-mode-selector.tsx
│       │   └── toggle-switch.tsx
│       └── tooltip.tsx
├── lib
│   ├── api
│   │   ├── billing.ts
│   │   └── database
│   │       └── route.ts
│   ├── auth
│   │   ├── client.ts
│   │   └── server.ts
│   ├── auth-utils.ts
│   ├── auth.ts
│   ├── client-auth-utils.ts
│   ├── db.ts
│   ├── email.ts
│   ├── hooks
│   │   └── use-notification.ts
│   ├── industries.ts
│   ├── middleware
│   │   ├── database-permissions.ts
│   │   └── onboarding.ts
│   ├── models
│   │   ├── activity.model.ts
│   │   ├── index.ts
│   │   ├── notification.model.ts
│   │   ├── organization.model.ts
│   │   ├── subscription.model.ts
│   │   ├── transaction.model.ts
│   │   └── user.model.ts
│   ├── pusher.ts
│   ├── repositories
│   │   ├── analytics.repository.ts
│   │   ├── index.ts
│   │   ├── organization.repository.ts
│   │   └── user.repository.ts
│   ├── server-auth-exports.ts
│   ├── server-auth-utils.ts
│   ├── server-db.ts
│   ├── services
│   │   ├── database.service.ts
│   │   ├── notification.service.ts
│   │   └── settings.service.ts
│   ├── store
│   │   └── settings-store.ts
│   ├── types
│   │   ├── notification.ts
│   │   ├── onboarding.ts
│   │   ├── password.ts
│   │   └── user.ts
│   └── utils
│       ├── theme-utils.ts
│       └── validation.ts
├── middleware.ts
├── next-env.d.ts
├── next.config.js
├── node_modules
├── package.json
├── postcss.config.js
├── prepare-import.html
├── public
├── scripts
│   ├── check-db.ts
│   ├── cleanup.ts
│   ├── create-db.ts
│   ├── debug-env.ts
│   ├── deploy-vercel.js
│   ├── final-verification.ts
│   ├── fix-db.ts
│   ├── init-db.ts
│   ├── migrate-direct.ts
│   ├── migrate-notifications-complete.ts
│   ├── migrate-supabase-final.js
│   ├── migrate.ts
│   ├── reset-db.ts
│   ├── seed.ts
│   ├── setup-db.ts
│   ├── setup-supabase-complete.ts
│   ├── supabase-info.ts
│   ├── supabase-quick-setup.ts
│   ├── test-auth-api.ts
│   ├── test-db-connection.ts
│   ├── test-notification-api.ts
│   ├── test-notification-system.ts
│   ├── test-simple.js
│   ├── test-supabase-connection-fix.ts
│   ├── test-supabase-now.ts
│   └── verify-supabase.ts
├── supabase-export.json
├── supabase-import.sql
├── tailwind.config.ts
├── tsconfig.json
├── types
│   └── next-auth.d.ts
└── vercel.json