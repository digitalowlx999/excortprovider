# Escort Provider

A premium full-stack classified ads platform for escorts.

## Getting Started

### 1. Clone & Install
```bash
npm install
```


### 3. Start Development Server
```bash
npm run dev
```
Open http://localhost:5173

### 4. Build for Production
```bash
npm run build
```

## Platform URLs

| URL | Description |
|-----|-------------|
| `/` | Homepage |
| `/cities` | City Directory |
| `/escorts/:city` | Ads by City |
| `/profile/:id` | Escort Profile |
| `/login` | Login |
| `/register` | Register |
| `/dashboard` | Escort Dashboard |
| `/dashboard/wallet` | Wallet & Deposits |
| `/dashboard/ads` | Manage Ads |
| `/admin` | Admin Panel |
| `/admin/deposits` | Deposit Approval |
| `/admin/settings` | Platform Settings |

## Tech Stack
- **Frontend**: React + Vite + TailwindCSS
- **Backend**: Supabase (Auth, DB, Storage)
- **Icons**: Lucide React
- **Routing**: React Router DOM

## Deploy to Vercel
Connect your GitHub repo to Vercel and set your `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` as environment variables.
