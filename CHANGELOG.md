# Changelog

## [0.1.1.0] - 2026-04-07

### Added
- **ProBallFootball design theme** — navy + electric blue color palette replacing emerald/green; matches client branding exactly (`#1A529F` primary, `#3291F4` accent, `#080E1D` deep navy)
- **Dark hero section** — homepage hero now uses deep navy background with white headline and bright blue accent span
- **Onest typeface** — replaced Inter + DM Serif Display with single Onest font family (weights 300/400/500/700)
- **Vitest + Testing Library** — bootstrapped test framework; 4 initial tests for `cn()` utility

### Changed
- **Border radius** — reduced from 12px to 8px throughout (matches proball's 8-9px style)
- **CSS variable namespace** — `--color-emerald-*` renamed to `--color-blue-*`; all component references updated
- **Heading style** — `.heading-display` now uses bold weight Onest instead of serif font

## [0.1.0.0] - 2026-03-30

### Added
- **User authentication** — Google OAuth and email/password login via NextAuth v5 (JWT sessions)
- **Registration** — `/register` page with name, email, phone, password; guest customers can upgrade to full accounts
- **Login page** — `/login` with Google sign-in and credentials form
- **Account page** — `/account` with profile editing, saved addresses (add/delete), and order history
- **Auth middleware** — `/account/*` routes protected; redirect to `/login?callbackUrl=...` when unauthenticated
- **Checkout autofill** — logged-in users have name, email, phone, and saved address pre-filled at checkout
- **Guest checkout** — unchanged; "Create account with this order" checkbox lets guests register after purchase
- **Session-aware header** — shows user avatar + dropdown (Account, Log Out) when signed in; "Log In" link when not
- **Custom Prisma adapter** — maps NextAuth's User model to the existing `Customer` model
- **Account & Address APIs** — `/api/account/profile` (GET/PUT) and `/api/account/addresses` (GET/POST/DELETE)

### Changed
- **Brand rename** — "Panen Baik" → "Berkala" across all UI, emails, translations, and package name
- **Header cleanup** — Admin link removed from public header; accessible only via `/admin` directly
- **Prisma schema** — `Customer` extended with `passwordHash`, `emailVerified`, `image`, `accounts`; new `Account` and `VerificationToken` models added
- **Address DELETE** — atomic `deleteMany` with ownership check replaces two-step findUnique + delete
