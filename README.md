# 🏋️ SHARERS GYM — Web Platform & Membership System

A modern, production-grade e-commerce and gym membership management platform built with **Next.js 16**, **Prisma ORM**, **Neon PostgreSQL**, **Clerk Authentication**, **KingsPay Payment Gateway**, and **Resend**.

---

## ⚡ Key Features

### 🛍️ Storefront & E-Commerce
* **Product Catalog:** Premium fitness apparel, gym accessories, and credit packs with instant filtering.
* **Shopping Cart & Checkout:** Persistent cart, promo code engine, and zone-based delivery fee calculation.
* **Dual Payment Processing:**
  * **KingsPay Gateway:** Automated online card & mobile payment verification.
  * **Manual Bank Transfer:** Automatic transfer instructions, unique payment reference codes, and admin 1-click approval.

### 🪪 Digital Membership & QR Access System
* **Dynamic Member Pass:** Automatic plan detection (VIP Membership, Day Passes, Hourly Sessions).
* **ID Card Download:** In-browser high-resolution Canvas renderer generates branded member ID cards (`.png`) for phone storage or printing.
* **Clean QR Export:** Dedicated QR image download for quick access.
* **Pass Email Delivery:** Members can email their scannable access QR code to their inbox with one click.
* **Staff QR Scanner (`/admin/scanner`):** In-browser camera scanner using Web Audio chime feedback for front-desk member check-in and session deduction.

### ✉️ Transactional Notifications & Resend Automations
* **Customer Receipts:** Instant dark-mode order confirmation and delivery summaries.
* **Bank Transfer Instructions:** Clear bank details, narration code, and amount.
* **Admin Alerts:** Instant new order notifications delivered directly to `sharersmall@gmail.com`.
* **Resend Automations:** Native event triggers (`order.paid`, `order.created`, `member.pass_purchased`, `order.delivered`) ready for onboarding drips and review sequences.

### 🛠️ Admin Management Suite (`/admin`)
* **Orders Management (`/admin/orders`):** Filter by status, verify bank transfers, dispatch packages, and auto-credit passes.
* **Members & Credits (`/admin/users`):** View member profiles, adjust credit balances, and inspect check-in histories.
* **Product Catalog (`/admin/products`):** Manage inventory, pricing, sizing, and images.
* **Visual CMS & Theme Customizer (`/admin/theme`):** Live preview and editor for banners, buttons, copy, and brand styling stored in PostgreSQL.

---

## 🏗️ Tech Stack

* **Framework:** [Next.js 16](https://nextjs.org/) (App Router, Server Components & Route Handlers)
* **Language:** TypeScript
* **Styling:** Tailwind CSS (v4) with custom theme tokens
* **Database & ORM:** PostgreSQL ([Neon Serverless](https://neon.tech/)) with [Prisma ORM](https://www.prisma.io/)
* **Authentication:** [Clerk](https://clerk.com/) (Clerk Middleware + PostgreSQL database role linking)
* **Payments:** KingsPay API (Goods & Services) + Manual Bank Transfer Engine
* **Transactional Email:** [Resend](https://resend.com/) + Resend Automations
* **Media & Storage:** [Cloudinary](https://cloudinary.com/)

---

## 📁 Project Structure

```
├── prisma/
│   └── schema.prisma           # Relational schema (User, Order, Product, StoreSetting, etc.)
├── src/
│   ├── app/
│   │   ├── admin/              # Admin dashboard (orders, users, products, theme, scanner)
│   │   ├── api/
│   │   │   ├── admin/          # Protected admin API endpoints
│   │   │   ├── checkout/       # KingsPay initialize & callback handlers
│   │   │   ├── membership/     # Pass delivery & credit sync
│   │   │   └── products/       # Catalog API
│   │   ├── checkout/           # Checkout page (delivery zones & payments)
│   │   ├── dashboard/          # Customer dashboard & Member Pass view
│   │   ├── layout.tsx          # Root layout & global providers
│   │   └── page.tsx            # Storefront homepage
│   ├── components/
│   │   ├── MemberPass.tsx      # Pass component with Canvas ID download & QR export
│   │   ├── Header.tsx          # Store header with profile menu & cart trigger
│   │   ├── CartDrawer.tsx      # Slide-out shopping cart
│   │   └── Layout.tsx          # Global shell wrapper
│   └── lib/
│       ├── prisma.ts           # Centralized Prisma client instance
│       ├── services/
│       │   ├── email.ts        # Resend email templates & automation event triggers
│       │   └── user.ts         # Clerk-to-database user synchronization
│       ├── cart-context.tsx    # Cart state & localStorage persistence
│       └── membership-context.tsx # Member pass calculation & credit balance
```

---

## 🚀 Getting Started

### 1. Prerequisites
* Node.js 18+ or 20+
* PostgreSQL database (e.g. Neon serverless)
* Clerk account
* Resend account
* KingsPay account

### 2. Environment Variables Setup
Create a `.env` file in the root directory:

```bash
# App Base URL
APP_URL="https://sharersgym.com"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
NEXT_PUBLIC_CLERK_SIGN_UP_URL="/sign-up"

# Neon PostgreSQL Database
DATABASE_URL="postgresql://user:password@endpoint-pooler.neon.tech/neondb?sslmode=require&pgbouncer=true"
DIRECT_URL="postgresql://user:password@endpoint.neon.tech/neondb?sslmode=require"

# Resend Email Service
RESEND_API_KEY="re_..."
EMAIL_FROM="SHARERS GYM <support@sharersgym.com>"
CONTACT_EMAIL="sharersmall@gmail.com"

# KingsPay Payment Gateway
KINGSPAY_CLIENT_ID="..."
KINGSPAY_SECRET_KEY="..."
KINGSPAY_ENVIRONMENT="production"

# Cloudinary Media
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="..."
CLOUDINARY_API_KEY="..."
CLOUDINARY_API_SECRET="..."
```

### 3. Install & Generate Database
```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Synchronize database schema (if setting up a fresh database)
npx prisma db push
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Architecture Details for New Developers

### 1. How User Roles Work
* **Authentication:** Handled entirely by Clerk (`useUser`, `auth()`).
* **Role & Business Data:** Stored in the PostgreSQL `User` table (`role: 'ADMIN' | 'CUSTOMER'`).
* **Admin Verification:** The header and `/admin` routes verify whether `User.role === 'ADMIN'` directly against PostgreSQL.
* **Granting Admin:**
  ```sql
  UPDATE "User" SET role = 'ADMIN' WHERE email = 'admin-email@domain.com';
  ```

### 2. Order Processing Flow
1. **Initialization:** Customer submits `/api/checkout/initialize`.
2. **KingsPay Payment:** User is redirected to KingsPay. Upon success, KingsPay returns to `/api/checkout/callback`.
3. **Fulfillment:** `fulfillPayment()` updates order status to `PAID`, increments member credits/tier in the database, sends the customer confirmation email, and alerts `sharersmall@gmail.com`.
4. **Manual Transfer:** Creates an order marked `PENDING_VERIFICATION` and emails bank details to the user. When verified in `/admin/orders`, it auto-credits the account.

### 3. Dynamic CMS Customizer
* Text, colors, and button labels can be updated in `/admin/theme`.
* All values are saved to the `StoreSetting` database table and accessed on the frontend via `useCustomization()`.

---

## 🚢 Production Deployment Checklist

1. **Clerk Keys:** Switch from development (`pk_test_...`) to production keys (`pk_live_...`).
2. **Domain Verification:** Ensure `sharersgym.com` has DNS records (SPF, DKIM) configured in Resend.
3. **KingsPay Webhook:** Set KingsPay callback URL to `https://sharersgym.com/api/checkout/callback`.
4. **Database Connection:** Neon pooled connection string is configured in `DATABASE_URL`.

---

## 📄 License
Private & Proprietary — Sharers Gym. All rights reserved.