# VANYA | Haute Joaillerie & Royal Indian Craftsmanship

A full-stack, editorial luxury Indian jewellery e-commerce platform and executive management suite built with **React, Vite, Tailwind CSS, Framer Motion, Node.js, Express, MongoDB Atlas, and Cloudinary**.

---

## Brand Aesthetics & Visual Identity
- **Primary:** Deep Forest Green (`#0B2216` / `#0F2E1E`)
- **Secondary:** Dark Olive Velvet (`#173021` / `#1E3E2B`)
- **Accent:** Champagne Regal Gold (`#D4AF37` / `#DFBE82`)
- **Background:** Warm White / Ivory Silk (`#FAF8F5`)
- **Typography:** Serif editorial headings (*Playfair Display*, *Cormorant Garamond*) and crisp modern sans-serif body (*Montserrat*, *Plus Jakarta Sans*)

---

## Technology Stack

### Frontend (`/client`)
- **React.js 18** + **Vite**
- **Tailwind CSS** (Custom luxury color tokens, typography, and gold glow shadows)
- **Framer Motion** (Editorial scroll reveals, slow zooms, drawer slide-overs, and quick-view popups)
- **React Router DOM 6** (Catalogue routing, collections, protected patron accounts, and admin guard)
- **Axios** (API client with JWT bearer interceptor)
- **React Icons** (Feather Icons suite)

### Backend (`/server`)
- **Node.js & Express.js** (REST API architecture)
- **MongoDB & Mongoose** (Relational references, compound text search indexes, aggregation pipelines)
- **JWT (JSON Web Tokens)** + **bcryptjs** (Password hashing & role-based authentication)
- **Cloudinary SDK v2** + **Multer** (Remote media storage pipeline with local fallback)
- **Helmet & CORS** (Security headers)

---

## Project Architecture

```
jwelary/
├── client/                     # React + Vite Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/         # Button, Input, Select, Modal, ConfirmDialog, Badge, Loader, Pagination
│   │   │   ├── layout/         # Navbar, MobileMenu, Footer, AnnouncementBar
│   │   │   ├── customer/       # HeroSection, ProductCard, ProductGrid, ProductSlider, CategoryCard,
│   │   │   │                   # CollectionCard, BannerSection, ImageReveal, Newsletter, InstagramGallery,
│   │   │   │                   # SearchModal, CartDrawer, WishlistButton, QuantitySelector, QuickViewModal
│   │   │   └── admin/          # AdminSidebar, AdminNavbar, StatCard, DashboardChart, DataTable,
│   │   │                       # CloudinaryUploader, StatusBadge
│   │   ├── context/            # AuthContext, CartContext, WishlistContext, ToastContext
│   │   ├── pages/
│   │   │   ├── customer/       # HomePage, CataloguePage, ProductDetailPage, CollectionsPage,
│   │   │   │                   # CartPage, CheckoutPage, WishlistPage, AccountPage, OrderSuccessPage
│   │   │   ├── auth/           # LoginPage, RegisterPage
│   │   │   └── admin/          # DashboardPage, ProductsPage, ProductFormPage, CategoriesPage,
│   │   │                       # CollectionsPage, OrdersPage, HomepageCMSPage, BannersPage,
│   │   │                       # MediaLibraryPage, UsersPage, ReviewsPage, SubscribersPage, SettingsPage
│   │   ├── routes/             # AppRoutes, ProtectedRoute, AdminRoute
│   │   ├── services/           # api.js, authService, productService, orderService, cmsService, etc.
│   │   ├── utils/              # formatters.js, constants.js
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── tailwind.config.js
│   └── package.json
│
├── server/                     # Node.js + Express Backend
│   ├── config/                 # db.js (MongoDB), cloudinary.js (Cloudinary SDK)
│   ├── controllers/            # auth, product, category, collection, order, review, banner, homepage, media, etc.
│   ├── middleware/             # authMiddleware, adminMiddleware, uploadMiddleware, errorHandler
│   ├── models/                 # User, Product, Category, Collection, Order, Review, Wishlist, Homepage, Banner, Media, Settings
│   ├── routes/                 # REST endpoints
│   ├── utils/                  # seeder.js, sampleData.js, tokenHelper.js
│   ├── uploads/                # Temporary upload buffer
│   ├── server.js               # Entry point
│   ├── package.json
│   └── .env
│
├── .env.example
├── .gitignore
└── README.md
```

---

## Quick Start Guide

### 1. Backend Setup (`/server`)

```bash
cd server
npm install
```

#### Configure `.env` in `server/`:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/vanya_jewels
JWT_SECRET=vanya_luxury_jewellery_super_secret_jwt_key_2026
CLIENT_URL=http://localhost:5173

# Cloudinary Setup (Optional: built-in smart mock fallback allows immediate uploads even if blank)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

#### Seed the Database with Indian Royal Jewellery:
```bash
npm run seed
```
This populates:
- **Admin Account**: `admin@vanya.com` / `Admin@123456`
- **Customer Account**: `customer@vanya.com` / `Customer@123456`
- 6 Categories (*Rings, Necklaces, Earrings, Bangles, Pendants, Royal Bridal*)
- 4 Curated Collections (*Royal Bridal Heritage, Celeste Diamond Soliloquy, The Temple Gold Era, Everyday Modern Minimalist*)
- 8+ Detailed Indian Haute Joaillerie creations with high-res photography and specifications
- Dynamic Homepage CMS configuration, editorial banners, and patron reviews.

#### Start Backend Server:
```bash
npm run dev
# or
node server.js
```
*Backend runs on `http://localhost:5000`*

---

### 2. Frontend Setup (`/client`)

```bash
cd ../client
npm install
npm run dev
```
*Frontend runs on `http://localhost:5173`*

---

## Admin Management Credentials
- **URL:** `http://localhost:5173/login` or direct to `http://localhost:5173/admin`
- **Email:** `admin@vanya.com`
- **Password:** `Admin@123456`
*(Fast 1-click demo login buttons are also provided on the sign-in screen)*

---

## Key Features & User Workflows

### 1. Dynamic Homepage CMS (`/admin/homepage`)
- Change the Hero Heading, Subtitle, CTA text, CTA Link, and background image directly from the admin dashboard without altering React code.
- Update the artisanal Brand Story narrative, metrics, and photography in real-time.

### 2. Cloudinary Media Pipeline (`/admin/media`)
- Upload single or multiple images directly to Cloudinary.
- Delete images remotely from Cloudinary using `public_id`.
- Copy secure CDN URLs to your clipboard with one click.

### 3. Complete Catalogue & Filtering (`/jewellery`)
- Search by product title, SKU (e.g. `VY-NK-001`), precious metal (e.g. `22K Hallmarked Gold`, `Platinum 950`), or category.
- Multi-faceted price, collection, material, and in-stock filtering.
- Fast Quick-View modal with full specs and instant add to vault.

### 4. Vault Reservation & Checkout (`/checkout`)
- Itemized breakdown with complimentary insured white-glove courier shipping.
- Cash on Delivery (COD) or Online Payment simulation.
- Creates verified Order document in MongoDB and returns unique order identifier (e.g. `VY-2026-XXXX`).

### 5. Order Tracking & Patron Account (`/account`)
- Real-time status progression (*Pending* → *Confirmed* → *Processing* → *Shipped* → *Delivered*).
- Interactive courier timeline notes updated by the administrator.

---

## Production Deployment

### Frontend (Vercel / Netlify)
1. Build the production bundle:
   ```bash
   cd client && npm run build
   ```
2. Deploy the `client/dist` directory.
3. Configure `VITE_API_URL` pointing to your deployed backend.

### Backend (Render / Railway / Heroku)
1. Set environment variables: `MONGO_URI`, `JWT_SECRET`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `CLIENT_URL`.
2. Start command: `node server.js`.
