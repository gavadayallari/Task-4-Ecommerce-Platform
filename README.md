# NovaCart — Modern Full Stack E-Commerce Platform

[![React](https://img.shields.io/badge/Frontend-React_18-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js_Express-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB_Mongoose-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind_CSS_v3-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![JWT](https://img.shields.io/badge/Security-JWT_%26_Bcrypt-black?logo=jsonwebtokens&logoColor=white)](https://jwt.io/)
[![Status](https://img.shields.io/badge/Status-Fully_Functional_%26_Tested-success)](#)

> **Task 4: Full Stack E-Commerce Web Application**  
> *Developed by Yallari Gavada for the Full Stack Development Internship at Auspify Technologies.*

---

## 📌 Executive Summary

**NovaCart** is an enterprise-grade, responsive, full-stack E-Commerce web application engineered with the **MERN (MongoDB, Express, React, Node.js)** architecture. It delivers a modern, high-converting digital storefront featuring granular inventory management, multi-criteria filtering, shopping cart state management, checkout with simulated payment processing, order status tracking, verified customer reviews, and an administrator management portal.

---

## 🚀 Key Features

### 🛒 1. Customer Shopping Experience
- **Interactive Home Page**: Engaging hero banner, curated category cards (*Electronics*, *Audio*, *Wearables*, *Gaming*, *Fashion*), and featured hardware showcase.
- **Product Catalog & Multi-Criteria Filtering**:
  - Live full-text keyword search across titles, brands, and descriptions.
  - Category selector with live inventory item counts.
  - Price range filtering (minimum and maximum).
  - Star ratings filter (4★ & above, 3★ & above).
  - In-stock availability toggle.
  - Sorting: Price (low to high / high to low), Highest Rated, and Newest Arrivals.
  - Pagination controls.
- **Detailed Product Specifications**: Multi-angle image thumbnails, brand tags, discount savings percentage, stock availability count, manufacturer warranty assurances, and verified customer reviews.
- **Customer Reviews & Ratings**: Authenticated customers can submit star ratings (1 to 5) and feedback comments with real-time recalculation of average ratings.

### 🛍️ 2. Cart & Order Management
- **Persistent Shopping Cart**: Maintained in `localStorage` with reactive badge counters.
- **Dynamic Pricing Engine**: Automated calculations for items subtotal, 5% estimated tax (GST), and standard shipping ($0 for orders ≥ $50 with live progress bar, otherwise $9.99).
- **Streamlined Checkout**:
  - Auto-fills saved profile shipping address.
  - Flexible payment methods: **Cash on Delivery (COD)** and **Online Card/UPI Simulator**.
  - Real-time stock verification: automatically decrements available inventory upon order confirmation.
- **Order Tracking & Details**: Visual progress pipeline (*Pending* ➔ *Processing* ➔ *Shipped* ➔ *Delivered*), payment timestamps, shipping details, item breakdown, and invoice summaries.

### 🛡️ 3. Administrative Operations (`/admin`)
- **Executive Analytics Dashboard**: Overview cards for Total Revenue, Total Orders, Active Catalog Items, and Registered Users, alongside low-stock warning banners (≤ 5 items remaining).
- **Product Inventory Management (CRUD)**: Create new products with modal dialogs, update prices and stock levels, or delete discontinued items.
- **Customer Orders Fulfillment**: Transition order statuses across the pipeline (*Pending*, *Processing*, *Shipped*, *Delivered*, *Cancelled*) and track payment confirmations.
- **User Directory**: View registered customer accounts, manage roles, and review account registration dates.

---

## 🛠️ Technology Stack

| Layer | Technologies Used | Description |
| :--- | :--- | :--- |
| **Frontend** | React 18, Vite | Component-driven single-page architecture |
| **Routing** | React Router DOM v6 | Protected customer and admin routes |
| **Styling** | Tailwind CSS v3 | Modern fintech aesthetics, glassmorphism, micro-animations |
| **Iconography** | Lucide React | Clean, lightweight SVG icons |
| **Backend** | Node.js, Express.js | High-throughput REST API with robust controllers |
| **Database** | MongoDB, Mongoose ODM | Schema modeling, compound text indexing, aggregation pipelines |
| **Security** | JSON Web Tokens (JWT), Bcrypt.js | Stateless authentication & salted password hashing |
| **Validation** | Express-Validator | Strict server-side input sanitation |

---

## 📁 Project Architecture

```
d:\interview\task\ecommerce-platform\
├── backend\
│   ├── src\
│   │   ├── config\
│   │   │   └── db.js                 # MongoDB connection logic
│   │   ├── controllers\
│   │   │   ├── authController.js     # User registration, login, profile
│   │   │   ├── productController.js  # Catalog browsing, reviews, admin CRUD
│   │   │   ├── orderController.js    # Checkout, customer orders, payment
│   │   │   └── adminController.js    # Metrics, analytics, order fulfillment
│   │   ├── middleware\
│   │   │   ├── auth.js               # JWT verification & role authorization
│   │   │   ├── validate.js           # express-validator handler
│   │   │   └── errorHandler.js       # Centralized error handler
│   │   ├── models\
│   │   │   ├── User.js               # User model with bcrypt pre-save hook
│   │   │   ├── Product.js            # Product & Review sub-schema
│   │   │   └── Order.js              # Order with tracking pipeline
│   │   ├── routes\
│   │   │   ├── authRoutes.js
│   │   │   ├── productRoutes.js
│   │   │   ├── orderRoutes.js
│   │   │   └── adminRoutes.js
│   │   ├── utils\
│   │   │   └── seeder.js             # Realistic sample data populator
│   │   └── server.js                 # Express application & CORS configuration
│   ├── .env                          # Local environment variables
│   ├── .env.example                  # Environment configuration template
│   └── package.json
├── frontend\
│   ├── src\
│   │   ├── components\
│   │   │   ├── common\               # Navbar, Footer, RatingStars, OrderStatusBadge, LoadingSpinner
│   │   │   ├── products\             # ProductCard, ProductFilters
│   │   │   ├── cart\                 # CartItem, CartSummary
│   │   │   └── admin\                # AdminSidebar, StatCard, ProductModal
│   │   ├── context\
│   │   │   ├── AuthContext.jsx       # User auth state & demo login
│   │   │   ├── CartContext.jsx       # Cart state & pricing computations
│   │   │   └── ToastContext.jsx      # Animated floating notifications
│   │   ├── pages\
│   │   │   ├── Home.jsx              # Landing page
│   │   │   ├── Products.jsx          # Catalog & search filters
│   │   │   ├── ProductDetail.jsx     # Product details & reviews
│   │   │   ├── Cart.jsx              # Cart review
│   │   │   ├── Checkout.jsx          # Shipping & payment
│   │   │   ├── OrderSuccess.jsx      # Confirmation screen
│   │   │   ├── OrderDetail.jsx       # Live tracking pipeline
│   │   │   ├── MyOrders.jsx          # Customer order history
│   │   │   ├── Profile.jsx           # Profile & address settings
│   │   │   ├── Login.jsx             # Sign in with Quick Fill Demo buttons
│   │   │   ├── Register.jsx          # Account creation
│   │   │   └── admin\
│   │   │       ├── AdminDashboard.jsx
│   │   │       ├── AdminProducts.jsx
│   │   │       ├── AdminOrders.jsx
│   │   │       └── AdminUsers.jsx
│   │   ├── services\
│   │   │   └── api.js                # Axios client with interceptors
│   │   ├── App.jsx                   # Route declarations & route guards
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
├── postman\
│   └── Ecommerce_Platform_API.postman_collection.json # Ready-to-import Postman suite
└── README.md
```

---

## ⚙️ Environment Configuration

The backend requires the following configuration in `backend/.env`. A template is provided in `backend/.env.example`:

| Variable | Description | Default Local Value |
| :--- | :--- | :--- |
| `PORT` | Backend server port | `5001` |
| `NODE_ENV` | Runtime environment | `development` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://127.0.0.1:27017/ecommerce_db` |
| `JWT_SECRET` | Secret key for signing authentication tokens | `auspify_ecommerce_production_secure_jwt_token_secret_key_2026` |
| `JWT_EXPIRE` | Token expiration duration | `30d` |
| `CLIENT_URL` | Frontend origin for CORS policy | `http://localhost:5174` |

---

## 🚀 Setup & Execution Guide

### 1. Prerequisites
- **Node.js** (v18 or higher recommended)
- **MongoDB** (Local MongoDB Community Server or MongoDB Atlas cluster)

### 2. Backend Setup
1. Open a terminal and navigate to the backend folder:
   ```bash
   cd d:\interview\task\ecommerce-platform\backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Populate database with realistic sample products, users, and orders:
   ```bash
   npm run seed
   ```
4. Start the backend development server:
   ```bash
   npm run dev
   ```
   *The REST API will launch at `http://localhost:5001`.*

### 3. Frontend Setup
1. In a separate terminal, navigate to the frontend directory:
   ```bash
   cd d:\interview\task\ecommerce-platform\frontend
   ```
2. Install frontend dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The client application will launch at `http://localhost:5175/` (or `http://localhost:5174/`).*

---

## 👥 Demo Credentials for Evaluation

For rapid demonstration during internship evaluations, the Login page includes **1-click Quick Fill Demo Buttons**:

| Role | Email | Password | Permissions |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@auspify.com` | `password123` | Full access to Admin Portal, Inventory CRUD, Orders Fulfillment, and User Directory |
| **Customer (Demo)** | `yallari@example.com` | `password123` | Store browsing, Cart, Checkout, Order Tracking, and Customer Reviews |
| **Customer (Sarah)** | `sarah@example.com` | `password123` | Verified customer profile with historical orders |

---

## 📬 Postman API Collection

A complete, pre-configured Postman collection is included in:  
`d:\interview\task\ecommerce-platform\postman\Ecommerce_Platform_API.postman_collection.json`

### How to Test with Postman:
1. Open **Postman**.
2. Click **Import** (top left) and select the `Ecommerce_Platform_API.postman_collection.json` file.
3. The collection is organized into 4 logical folders:
   - **1. Authentication**: Login (Customer & Admin), Register, Profile Inspection, Profile Update.
   - **2. Products Catalog**: Filtered search, Featured items, Categories breakdown, Product details, Review submission, Admin CRUD.
   - **3. Orders & Checkout**: Order placement, Personal history (`/my-orders`), Order inspection, Payment simulation.
   - **4. Admin Operations**: Analytics metrics, Orders pagination & status update, User directory.
4. Set the `baseUrl` variable to `http://localhost:5001/api`.

---

## 🏆 Internship Evaluation Checklist

- [x] Full MERN Stack integration (React 18 + Node.js + Express + MongoDB + Mongoose)
- [x] Responsive design optimized for desktop, tablet, and mobile screens
- [x] Product catalog with full-text search, category selection, price range, and star rating filters
- [x] Shopping cart with quantity stepper, stock validation, and automatic GST/shipping calculation
- [x] Checkout with address validation and multiple payment simulation modes
- [x] Order tracking pipeline (*Pending*, *Processing*, *Shipped*, *Delivered*)
- [x] Customer review and rating submission system
- [x] Protected Admin Portal for KPI statistics, product inventory CRUD, and order status transitions
- [x] JWT Authentication & bcrypt password hashing with Role-Based Access Control
- [x] Postman API collection with sample request bodies
- [x] Database seeder script with 12+ realistic items across 5 categories
- [x] Verified in browser with automated end-to-end testing
