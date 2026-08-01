# Hotel Yash Grand Operations Suite

A premium, production-ready digital hospitality platform for **Hotel Yash Grand Varanasi**.

This suite consists of a public visual showcase, a digital restaurant menu catalog, a Pinterest-style event gallery, a Point-of-Sale (POS) terminal, and a Back-Office Manager Dashboard.

---

## 🚀 Getting Started

### 1. Installation
Install project dependencies:
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
Starting development automatically scans local asset directories, compiles metadata, and runs next-dev on `http://localhost:3000`.

---

## 📁 Project Structure Overview

```
├── public/
│   └── assets/              # Case-sensitive local assets grouped by categories
│       ├── banquet/         # Ballroom stage setups and floral decors
│       ├── food/            # Menu items photos (main-course, dal, rice-biryani, etc.)
│       ├── outside view/    # Building facade photos
│       └── rooms/           # Suite bed layouts and vanity setups
├── scripts/
│   ├── scan-rooms.js        # Compiles room files and metadata at build time
│   └── scan-gallery.js      # Indexes photo & video gallery assets at build time
├── src/
│   ├── app/                 # Next.js App Router folders
│   │   ├── (app)/           # Public landing and dining route layout
│   │   ├── (admin)/         # Staff Back-Office layout (/dashboard, /bookings)
│   │   └── (pos)/           # Cashier Terminal layout (/pos)
│   ├── components/          # Reusable UI component modules
│   │   ├── banquet/         # Banquet events showcase components
│   │   ├── contact/         # Booking forms and conversion CTAs
│   │   ├── dashboard/       # Operations statistics panels
│   │   └── gallery/         # Lightboxes and masonry grids
│   └── data/                # Local data models
│       ├── menu.ts          # Deduplicated food catalog database (236 unique dishes)
│       ├── rooms.ts         # Generated room list coordinates
│       └── gallery.ts       # Generated visual showcase coordinates
```

---

## 🛠 Admin & POS Usage Guide

### 1. Operations Dashboard (`/dashboard`)
For duty managers and captains to track daily indicators:
- **Today's Revenue:** Live metrics showing total check-ins and orders.
- **Room Occupancy:** Live bar tracker showing blocked suites.
- **Reservation Enquiries:** Real-time table and banquet visit queue.

### 2. POS Terminal (`/pos`)
For cashiers and restaurant captains:
- **Category Filter:** Sidebar navigation to filter dishes (Main Course, Soup, South Indian, etc.).
- **Live Ticket Math:** Calculates Subtotal, 5% GST, and custom discounts dynamically.
- **Print Receipt:** Completes orders and generates a clean, printable thermal invoice matching standard ESC/POS layout standards.

---

## 🔑 Environment Variable Guide
Create a `.env` file in the project root:
```env
# Public URL configuration (for SEO canonical URLs and XML Sitemaps)
NEXT_PUBLIC_SITE_URL=https://hotelyashgrand.com

# Analytics Trackers
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_CLARITY_ID=xxxxxxxxxx

# Future Database Hooks (Postgres/Supabase)
DATABASE_URL=postgresql://postgres:password@host:5432/yashgrand
```

---

## 🌐 Vercel Production Deployment
This repository is optimized for one-click deployment to Vercel:
1. Connect this repository to your Vercel Dashboard.
2. Define the production `NEXT_PUBLIC_SITE_URL` in Environment Variables.
3. Deploy! The compilation automatically runs the asset scanners and outputs static metadata pages.

---

## 🔮 Future Backend Integration Notes
- **API Endpoints:** Switch state hooks in `/pos` and booking forms to call Next.js REST endpoints (`/api/bookings`, `/api/orders`) to read and write records to a database.
- **Payment Pipelines:** Embed payment gateways (e.g. Razorpay, Stripe) on final booking steps.
- **Thermal Printer Integrations:** Connect the POS thermal bill button to raw Bluetooth/USB print streams using raw byte arrays.
