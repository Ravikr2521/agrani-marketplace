# FarmFresh Marketplace

A production-oriented responsive agricultural marketplace built with React + Vite + JavaScript, Tailwind CSS v4, shadcn/ui-style components, React Router and React Context.

## Highlights

- No authentication or payment gateway.
- Real marketplace API integration.
- Variant-first purchasing model.
- Responsive desktop/tablet/mobile UI.
- Mobile checkout is a full-width flow rather than a cramped desktop drawer.
- Product image carousel with controls and fallback handling.
- Debounced API search and pagination.
- Client-side category/availability filters.
- Cart persisted in `localStorage` using `productId + variantId` identity.
- Inventory limits enforced in cart and checkout.
- Three-step checkout with Indian phone and pincode validation.
- Orders retrieved using the saved buyer phone number.
- Loading, error, retry and empty states.

## Tech stack

- React 19
- Vite
- JavaScript only
- Tailwind CSS v4 with the official Vite plugin
- shadcn/ui component architecture
- Radix UI primitives
- React Router
- React Context API
- Sonner
- Lucide icons

## Installation

```bash
npm install
cp .env.example .env
npm run dev
```

Windows PowerShell:

```powershell
npm install
Copy-Item .env.example .env
npm run dev
```

## Environment variables

```env
VITE_API_BASE_URL=https://vaaradhi-dev.agrani.tech/marketplace/api
```

## APIs

Products:

`GET /products/marketplace?qc_status=approved&per_page=20&page=1`

Search uses `q` and is debounced in the UI.

Create order:

`POST /order`

Orders by buyer phone:

`GET /order?buyer_phone=<phone>`

The order payload uses variant IDs and cart quantities exactly as required by the marketplace API.

## Cart behavior

Cart storage key: `farmers_marketplace_cart`

A cart line is identified by:

`productId + variantId`

Adding the same variant increases its quantity. Different variants remain separate lines. Quantity cannot exceed `variant.no_of_units`.

## Buyer phone

After a successful order, the phone is saved under:

`farmers_marketplace_buyer_phone`

This is used to retrieve order history without authentication.

## Checkout flow

1. Review order
2. Enter buyer/delivery details
3. Order confirmation

Required fields are buyer name, Indian mobile number, delivery address and Indian pincode. No payment UI is included.

## Development commands

```bash
npm run dev
npm run build
npm run preview
```

## Project structure

```text
src/
├── api/
├── components/
│   ├── common/
│   ├── layout/
│   ├── products/
│   ├── cart/
│   ├── checkout/
│   ├── orders/
│   └── ui/
├── context/
├── hooks/
├── lib/
├── pages/
├── App.jsx
├── main.jsx
└── index.css
```

## Responsive design

Desktop uses multi-column product grids, sidebar filters, sticky summaries and spacious checkout panels. Tablet layouts reduce column counts and use sheets for filters. Mobile uses one/two-column product grids, full-width checkout content, touch-friendly controls and sticky-friendly action areas.

## Production build

Run `npm run build`. The generated `dist/` directory can be deployed to any static hosting provider capable of SPA fallback routing.
