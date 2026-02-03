# Hybrid Retail POS Dashboard

A modern, responsive, and role-based Point of Sale (POS) and Dashboard application built with **Next.js 14**. This application is designed to manage hybrid retail operations, offering distinct interfaces for Super Admins, Store Admins, and Staff Users.

## 🚀 Features

### Role-Based Access Control (RBAC)
- **Super Admin**: Platform-wide oversight, organization management, system health monitoring, and audit logs.
- **Store Admin**: Store-specific analytics, staff management, inventory control, and settings.
- **User (Staff)**: Point of Sale (POS) terminal interface, quick sales, customer management, and personal sales tracking.

### Premium UI/UX
- **Modern Design**: Glassmorphism headers, gradient themes (Purple for Super Admin, Blue for Admin, Green for User).
- **Responsive**: Fully responsive layouts optimized for varying screen sizes.
- **Interactive**: Smooth transitions using Framer Motion, interactive sidebars, and dynamic charts.

### Robust Notification System
- **Real-Time Updates**: Notification bell with live unread counts.
- **Role-Specific Targeting**: Notifications can be targeted to specific roles (e.g., all Admins) or individual users.
- **Filtering**: Filter by type (Info, Success, Warning) or read status.
- **Persistence**: Database-backed notification storage with expiry management.

### Technical Highlights
- **Authentication**: Secure, session-based authentication using **NextAuth.js**.
- **Database**: Type-safe database access with **Prisma ORM** and **PostgreSQL**.
- **Performance**: Server Components and optimized assets for fast load times.

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Directory)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Authentication**: [NextAuth.js](https://next-auth.js.org/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Animation**: [Framer Motion](https://www.framer.com/motion/)

## 🏁 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL database

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory (or update existing) with the following variables:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/hybrid_retail_db"
   NEXTAUTH_SECRET="your-secret-key"
   NEXTAUTH_URL="http://localhost:3001"
   ```

4. **Database Setup**
   Run the following scripts to set up your database schema and seed initial data:
   ```bash
   # Create database (if needed)
   npm run db:create

   # Run migrations
   npm run migrate:all

   # Seed database
   npm run seed
   ```

### Running the Application

Start the development server:
```bash
npm run dev
```
Open [http://localhost:3001](http://localhost:3001) with your browser.

## 📜 Available Scripts

- `npm run dev`: Starts the development server on port 3001.
- `npm run build`: Builds the application for production.
- `npm run start`: Starts the production server.
- `npm run lint`: Runs ESLint checks.
- `npm run db:create`: Creates the PostgreSQL database.
- `npm run migrate:all`: Runs all Prisma migrations.
- `npm run seed`: Seeds the database with initial users and data.
- `npm run db:check`: Verifies database connection.

## 📁 Project Structure

- `/app`: App Router pages and API routes.
  - `/api`: Backend API endpoints.
  - `/admin`: Admin dashboard pages.
  - `/user`: Staff/POS dashboard pages.
  - `/super-admin`: Platform admin pages.
- `/components`: Reusable UI components.
  - `/dashboard`: Layout-specific components (Headers, Sidebars).
  - `/ui`: Generic UI elements (Buttons, Inputs, Modals).
- `/lib`: Utility functions, hooks, and database clients.
  - `/hooks`: Custom React hooks (e.g., `useNotification`).
  - `/services`: Business logic layer.
  - `/models`: Database query models.
- `/prisma`: Database schema and migrations.
- `/public`: Static assets.
- `/scripts`: Database maintenance and setup scripts.

## 🤝 Support

For support, please contact the development team or file an issue in the repository.