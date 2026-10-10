# 🎨 Salenova Client (Web Application)

The official web application and marketing portal for **Salenova**, built with Next.js 16, React 19, and Tailwind CSS v4.

---

## 🛠️ Tech Stack & Architecture

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **UI Library**: [React 19](https://react.dev/) with React Compiler optimizations enabled
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Visuals & Effects**: Canvas Confetti, CSS 3D perspective transforms, frosted-glass backdrop blur filters
- **Language**: TypeScript 5.x

---

## 📂 Directory Structure

```
client/src/
├── app/
│   ├── (auth)/
│   │   └── signup/            # Workspace owner onboarding & signup page
│   ├── (marketing)/           # Marketing route layout & pages
│   ├── globals.css            # Tailwind CSS v4 imports and theme definitions
│   ├── layout.tsx             # Root layout with fonts and metadata
│   └── page.tsx               # Entry home page route (renders MarketingLandingPage)
│
├── features/                  # Feature-Sliced domain modules
│   ├── auth/                  # Authentication & Onboarding
│   │   ├── components/        # AuthSideBanner, SignupForm
│   │   ├── hooks/             # Auth-specific client hooks
│   │   ├── schemas/           # Validation schemas
│   │   ├── services/          # API communication services
│   │   └── store/             # Client-side auth state
│   │
│   └── marketing/             # Marketing landing page
│       ├── components/        # Hero, FeaturesGrid, TryIt, Pricing, FAQ, Navbar, Footer
│       └── utils/             # Marketing formatting helpers
│
└── shared/                    # Cross-cutting reusable assets
    ├── components/ui/         # Atomic UI primitives (Button, Input, Checkbox)
    └── lib/                   # Utility helpers (cn, clsx, tailwind-merge)
```

---

## 🚀 Getting Started

### 1. Install Dependencies

From the `client/` directory:

```bash
pnpm install
```

### 2. Configure Environment

Copy the example environment file:

```bash
cp .env.example .env.local
```

Default variables:
```env
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Launch the Development Server

```bash
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the application.

---

## 📜 Available Scripts

| Script | Purpose |
| :--- | :--- |
| `pnpm dev` | Starts local Next.js development server with hot-reload |
| `pnpm build` | Compiles and optimizes production bundle |
| `pnpm start` | Runs the compiled production server |
| `pnpm lint` | Runs ESLint 9 against TypeScript and JSX files |

---

## 🎨 Key Features Implemented

1. **Interactive Form Playground (`TryIt` Component)**:
   - Users can test sample submissions live.
   - Switch between HTML, JavaScript fetch, and cURL snippets.
   - Live simulated lead feed with instant spam filter dispositions (`Accepted`, `Rate limit`, `Disposable email`, `Honeypot`).
2. **Interactive 3D Feature Cards (`FeaturesGrid` Component)**:
   - Dynamic 3D perspective transforms on hover.
3. **High-Converting Signup Page (`/signup`)**:
   - Split layout with value proposition side-banner and frosted-glass auth card.
