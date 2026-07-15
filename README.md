# Ghar360 — MERN Real Estate Marketplace

A realistic, full-stack real estate portal (in the spirit of MagicBricks / 99acres) built with **MongoDB, Express, React, Node.js**. Clean, LinkedIn/Chrome-style interface: simple, fast, and information-dense without feeling cluttered.

## Features

- Search & filter properties by city, locality, keyword, budget, property type, bedrooms, furnishing, area
- Property detail pages with image gallery, specs, amenities, similar listings
- Buy / Rent toggle, sort by price/area/newest, pagination
- Auth (JWT) — register/login as Buyer, Owner, or Agent
- Post a property (3-step guided form)
- Owner/agent dashboard — manage listings, view inquiry leads
- Save/favorite properties
- Contact-owner inquiry form
- Verified & Featured badges, view counters
- Realistic seed data: 100+ listings across Mumbai, Pune, Bengaluru, Delhi, Hyderabad

## Tech stack

**Backend:** Node.js, Express, MongoDB + Mongoose, JWT auth, bcrypt, express-rate-limit
**Frontend:** React 18 (Vite), React Router, Tailwind CSS, lucide-react icons, axios

## Project structure

```
realestate-mern/
├── backend/
│   ├── config/db.js
│   ├── models/          User, Property, Favorite, Inquiry
│   ├── controllers/      auth, property, favorite, inquiry
│   ├── routes/
│   ├── middleware/       auth, error handling
│   ├── seed/              realistic sample data generator
│   └── server.js
└── frontend/
    └── src/
        ├── api/axios.js
        ├── context/AuthContext.jsx
        ├── components/    Navbar, PropertyCard, FilterSidebar, SearchBar, ImageGallery...
        └── pages/         Home, Listings, PropertyDetail, Login, Register, PostProperty, Dashboard, Favorites
```

## Setup

### 1. Prerequisites
- Node.js 18+
- A MongoDB database — either local (`mongod`) or a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster

### 2. Backend

```bash
cd backend
npm install
cp .env.example .env
# edit .env and set MONGO_URI + JWT_SECRET
npm run seed      # populates realistic sample listings + demo users
npm run dev        # starts API on http://localhost:5000
```

Demo accounts created by the seed script (password for all: `password123`):
- `buyer@example.com` — buyer account
- `rohan.owner@example.com` — owner account
- `priya.agent@example.com` — agent account

### 3. Frontend

```bash
cd frontend
npm install
npm run dev        # starts app on http://localhost:5173
```

The Vite dev server proxies `/api/*` requests to `http://localhost:5000`, so no CORS config is needed locally.

### 4. Build for production

```bash
cd frontend && npm run build   # outputs static files to frontend/dist
cd backend && npm start
```
Serve `frontend/dist` via any static host (Vercel, Netlify) and deploy the backend separately (Render, Railway, EC2), pointing `MONGO_URI` at Atlas and updating `CLIENT_URL` / the frontend's API base URL accordingly.

## Notes on realism

- Prices are generated in realistic INR ranges (₹ Lakh/Cr formatting) with distinct logic for rent vs. sale and for plots vs. built-up property.
- Listings are distributed across real localities in five major Indian cities.
- Images use royalty-free Unsplash photography as stand-ins for real listing photos — swap in your own uploads (e.g. via S3/Cloudinary) for production.
- Auth, ownership checks, and rate limiting are implemented server-side, not just hidden in the UI.

## Next steps for a production version

- Real image upload (multer + S3/Cloudinary) instead of stock photos
- Map view (Google Maps / Mapbox) using the existing `location.lat/lng` fields
- Email/SMS notifications for new inquiries
- Admin moderation queue for verifying listings
- EMI calculator, saved searches with alerts
