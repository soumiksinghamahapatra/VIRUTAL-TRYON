# ✦ MAISON — Virtual Try-On E-Commerce Store & AI Atelier

An architectural, high-fashion e-commerce platform and AI atelier featuring photorealistic **Virtual Try-On** powered by Google's **Gemini Nano Banana (`gemini-3.1-flash-image`)** API.

Designed with an unapologetic minimalist aesthetic: **Pitch White (`#FFFFFF`)** canvas, **Pitch Black (`#000000`)** typography, and editorial serif headers (**Cormorant Garamond**).

---

## 🏛️ Architecture & Directory Structure

```
VIRTUAL TRYON/
├── client/                     # High-Performance Vite + React Frontend
│   ├── src/
│   │   ├── components/         # Navbar, Footer, Cards, ProtectedRoute
│   │   ├── context/            # AuthContext (JWT Authentication state)
│   │   ├── pages/
│   │   │   ├── Home.jsx        # Editorial landing page & feature showcase
│   │   │   ├── Shop.jsx        # Luxury e-commerce boutique collection
│   │   │   ├── VirtualTryOn.jsx# AI Virtual Fitting Room & Live Studio Canvas
│   │   │   ├── ColorAnalysis.jsx # 12-Season chromatic color analysis
│   │   │   ├── StyleConsultant.jsx # 24/7 conversational AI fashion stylist
│   │   │   ├── Wardrobe.jsx    # Digital closet catalog with category filters
│   │   │   ├── OutfitStudio.jsx# Interactive mix-and-match outfit canvas
│   │   │   ├── OutfitAnalyzer.jsx # Inspo match & street style breakdown
│   │   │   └── Pricing.jsx     # Atelier membership tiers
│   │   ├── services/           # Axios API service
│   │   ├── App.jsx             # React router configuration
│   │   └── index.css           # Tailwind CSS & luxury monochrome tokens
│   ├── public/                 # Static assets & MAISON SVG favicon
│   ├── index.html              # HTML entrypoint
│   ├── package.json            # Frontend dependencies
│   ├── tailwind.config.js      # Pitch white (#FFFFFF) & black (#000000) tokens
│   └── vite.config.js          # Vite config & API reverse proxy
├── server/                     # Production Node.js & Express Backend
│   ├── src/
│   │   ├── config/             # MongoDB connection with resilient timeout
│   │   ├── controllers/        # Auth, wardrobe, outfits, color analysis
│   │   ├── middleware/         # JWT auth, Multer memory storage, error handler
│   │   ├── models/             # Mongoose schemas (User, WardrobeItem, Outfit)
│   │   ├── routes/
│   │   │   ├── tryOnRoutes.js  # /api/try-on (Gemini Nano Banana) & /api/products
│   │   │   ├── authRoutes.js   # /api/auth (Login, register, profile)
│   │   │   ├── wardrobeRoutes.js # /api/wardrobe (Closet management)
│   │   │   ├── colorRoutes.js  # /api/color-analysis
│   │   │   ├── consultationRoutes.js # /api/consultation (Stylist chat)
│   │   │   └── outfitRoutes.js # /api/outfits
│   │   └── services/           # Gemini & AI stylist heuristic engines
│   ├── uploads/                # Temporary image upload buffer
│   ├── index.js                # Express production server & static SPA host
│   ├── package.json            # Backend dependencies
│   └── .env.example            # Backend environment variables
├── .env.example                # Root environment variables guide
├── .gitignore                  # Production git ignore rules
├── package.json                # Root orchestration & deployment scripts
├── render.yaml                 # 1-Click Render deployment configuration
└── README.md                   # This documentation
```

---

## ⚡ Quick Start (Local Development)

### 1. Prerequisites
- **Node.js** v18+ installed
- **npm** v9+ installed
- A **Google Gemini API Key** (from [Google AI Studio](https://aistudio.google.com/apikey))

### 2. Install Dependencies
In the root directory, run:
```bash
npm run install:all
```
*(This automatically installs dependencies in both `server/` and `client/`).*

### 3. Configure Environment Variables
Copy `.env.example` to `server/.env`:
```bash
cp server/.env.example server/.env
```
Ensure your `GEMINI_API_KEY` is set inside `server/.env`.

### 4. Run Locally
To run both the backend server and Vite client with live reload:
```bash
# Terminal 1: Start Backend API (Port 5000)
npm run dev:server

# Terminal 2: Start Frontend Client (Port 5173)
npm run dev:client
```
Visit **[http://localhost:5173](http://localhost:5173)** in your browser.

---

## 🚀 Production Deployment

This project is structured for single-command production deployment on **Render**, **Railway**, **Vercel**, **Heroku**, or **Docker**.

### Deployment Architecture
In production:
1. Running `npm run build` compiles the React frontend to `client/dist`.
2. Running `npm start` launches `server/index.js`.
3. The Express server provides all API endpoints (`/api/*`) AND serves the optimized static bundle from `client/dist` for all web pages with SPA routing fallback.

### Deploying to Render
1. Push your repository to GitHub.
2. In Render, select **New Web Service** and connect your repository.
3. Configure:
   - **Build Command**: `npm run postinstall && npm run build`
   - **Start Command**: `npm start`
4. Add your Environment Variables:
   - `GEMINI_API_KEY`: Your Gemini API key
   - `MONGODB_URI`: Your MongoDB connection string
   - `NODE_ENV`: `production`
5. Click **Deploy**.

---

## 🧠 Gemini Virtual Try-On API Details

The virtual try-on feature sends both the clothing image and the person image to Google's Nano Banana API (`gemini-3.1-flash-image`) via the `@google/genai` interactions SDK:

```javascript
const interaction = await ai.interactions.create({
  model: 'gemini-3.1-flash-image',
  input: [
    { type: 'image', mime_type: clothingFile.mimetype, data: base64Clothing },
    { type: 'image', mime_type: personFile.mimetype, data: base64Person },
    { type: 'text', text: 'Create a professional e-commerce fashion photo. Take the clothing item from the first image and dress the person from the second image in it...' }
  ]
});
```

> **Important Note regarding Google AI Studio Quotas:**  
> Google sets the daily quota for Nano Banana image generation models to **0 requests per day on Free Tier API keys**. To generate images via the API, link a **Pay-As-You-Go billing account** to your project in [Google AI Studio](https://aistudio.google.com).
