# Velmora Clothing

## Current State
New project. No existing code.

## Requested Changes (Diff)

### Add
- Full e-commerce website for Indian men's clothing brand "Velmora"
- Navigation bar with logo, category links (Shirts, T-Shirts, Hoodies), and cart icon with item count badge
- Hero section with bold brand banner, Hindi accent text ("नया संग्रह" - New Collection), CTA button
- Product catalog with three sections: Shirts, T-Shirts, Hoodies
- Product card component showing image, name, price in INR (₹), color, and "Add to Cart" button
- Product detail modal/page with image, description, size selector (S/M/L/XL/XXL), color, price, and "Add to Cart"
- Cart sidebar/drawer showing selected items, quantities, subtotal in INR, and checkout CTA
- Admin/management panel (protected route) to:
  - View all products in a table
  - Add new product (name, description, price in INR, sizes, color, image URL, category)
  - Edit existing product
  - Delete product
- Footer with brand info, contact details, social links (Instagram, Twitter, Facebook)
- Sample products pre-loaded: ~3 per category (9 total) with realistic Indian prices (₹699–₹2499)

### Modify
- Nothing (new project)

### Remove
- Nothing (new project)

## Implementation Plan

### Backend (Motoko)
- `Product` type: id, name, description, price (Nat), category (shirt/tshirt/hoodie), sizes ([Text]), color, imageUrl, inStock
- CRUD operations: addProduct, updateProduct, deleteProduct, getProducts, getProductsByCategory, getProduct
- `CartItem` (frontend-only, stored in local state)
- Admin auth: simple admin principal check or admin password stored in backend
- Seed data: 9 sample products across three categories with INR prices

### Frontend (React + TypeScript)
- App shell with navbar, main content, cart drawer overlay
- Pages/Views: Home (hero + catalog), ProductDetail (modal), Admin Panel
- State management: React context for cart and product data
- Cart stored in local state (React context), persists via localStorage
- Admin panel accessible via `/admin` route, secured with a simple admin login
- All prices displayed as ₹X,XXX format
- Hindi text accents in hero, section headings
