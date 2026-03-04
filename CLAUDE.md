# Quibly

Plataforma educacional que usa IA para transformar PDFs e tópicos em flashcards e quizzes interativos. Design dark gaming-inspired com gamificação.

**URL de produção**: https://tryquibly.com

## Tech Stack

- **Framework**: Next.js 15.5.9 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS 4, Framer Motion, tw-animate-css
- **State**: React Query (TanStack) 5.90
- **Auth**: Firebase Authentication (Email/Password, Google OAuth)
- **Database**: PostgreSQL via Prisma ORM 6.16
- **AI**: Google Generative AI (Gemini 2.5 Flash)
- **Payments**: Stripe (embedded checkout)
- **Storage**: Tigris (S3-compatible) via AWS SDK
- **i18n**: next-intl (pt, en)
- **Analytics**: DataFast, Firebase Analytics
- **UI**: Radix UI primitives, lucide-react, react-icons, Sonner (toasts), Canvas Confetti

## Commands

```bash
npm run dev        # Dev server
npm run build      # prisma generate && next build
npm run start      # Production server
npm run lint       # ESLint
```

## Project Structure

```
src/
├── app/
│   ├── layout.tsx                    # Root layout (fonts, providers, DataFast, Toaster)
│   ├── page.tsx                      # Root "/" → redirects to /home
│   ├── globals.css                   # Tailwind + OKLCH theme variables
│   ├── providers/
│   │   └── ReactQueryProvider.tsx
│   ├── messages/
│   │   ├── en.json                   # English translations
│   │   └── pt.json                   # Portuguese translations
│   │
│   ├── (marketing)/                  # Public marketing pages (no locale prefix)
│   │   ├── layout.tsx                # Header + Footer wrapper
│   │   ├── home/                     # Landing page
│   │   ├── pricing/                  # Pricing page
│   │   ├── manifesto/
│   │   ├── privacy/
│   │   └── terms/
│   │
│   ├── [locale]/                     # Locale-prefixed routes (en/pt)
│   │   ├── layout.tsx
│   │   ├── (auth)/                   # Auth pages (centered dark modal)
│   │   │   ├── login/
│   │   │   └── register/
│   │   └── dashboard/                # Protected dashboard
│   │       ├── layout.tsx            # Sticky header + bottom nav + main content
│   │       ├── home/                 # Dashboard home
│   │       ├── upload/               # PDF upload
│   │       ├── flashcards/           # Flashcard list + [id] player
│   │       ├── quizzes/              # Quiz list + [id] player
│   │       ├── pricing/              # Stripe embedded checkout
│   │       └── subscribe/            # success + cancel pages
│   │
│   ├── admin/                        # Admin panel (role-protected, no locale)
│   │   ├── page.tsx
│   │   └── users/
│   │
│   ├── study/                        # Direct study routes (no locale)
│   │   └── flashcards/[id]/
│   │
│   └── api/                          # API routes (see API section below)
│
├── components/
│   ├── ui/                           # Radix-based: button, card, dialog, accordion, badge, table, skeleton
│   ├── dashboard/                    # CompactUploadZone, XPProgressBar, StreakBadge, LevelBadge, GamificationStats, StudyCard
│   ├── Header.tsx                    # Marketing header
│   ├── Footer.tsx                    # Marketing footer
│   ├── DataFastAnalytics.tsx         # Analytics init component
│   ├── HeroSection.tsx, FeaturePreview.tsx, PricingSection.tsx, FaqSection.tsx, etc.
│
├── hooks/
│   ├── useAuth.ts                    # Firebase auth state monitor → { user, loading }
│   ├── useAppUser.ts                 # Fetches /users/me → { appUser, firebaseUser, loading, refetch }
│   ├── useGamification.ts           # POST /gamification/xp → awards XP
│   ├── useUsage.ts                   # GET /usage → daily generation limits
│   └── useAnalytics.ts              # Firebase analytics (unused)
│
├── lib/
│   ├── api.ts                        # Axios instance, baseURL="/api", auto-attaches Firebase ID token
│   ├── firebase.ts                   # Firebase client config + analytics helpers
│   ├── firebaseAdmin.ts             # Firebase Admin SDK (server-side token verification)
│   ├── prisma.ts                     # Prisma client singleton
│   ├── gemini.ts                     # Google Generative AI client
│   ├── gamification.ts              # calculateLevel(), awardXP() server logic
│   ├── usage.ts                      # checkUsageLimit(), incrementUsage()
│   ├── tigris.ts                     # S3 client for file storage
│   ├── datafast.ts                   # DataFast analytics singleton
│   ├── auth.ts                       # Auth helpers
│   ├── adminAuth.guard.ts           # Admin role verification
│   └── utils.ts                      # cn() utility (clsx + tailwind-merge)
│
└── middleware.ts                     # next-intl routing, bypasses /admin, /home, /pricing, /study, etc.

prisma/
└── schema.prisma                     # Database schema
```

## Database Schema (Prisma)

```
User         → id, firebaseUid, email, name, photoUrl, language, plan(FREE|PRO), role(USER|ADMIN)
               xp, streak, level, lastStudyDate
               stripeCustomerId, stripeSubscriptionId, stripePriceId, subscriptionStatus, currentPeriodEnd
               → documents[], flashcardSets[], quizzes[], dailyUsages[]

Document     → id, userId, title, subject, content, fileUrl
               → quizzes[], flashcardSets[]

FlashcardSet → id, userId, documentId?, topic, language
               → cards[] (Flashcard)

Flashcard    → id, flashcardSetId, front, back, explain?, imageUrl?, imageQuery?
               (cascade delete with FlashcardSet)

Quiz         → id, userId, documentId?, topic, language
               → questions[] (Question)

Question     → id, quizId, question, options[], correctIndex, imageUrl?, imageQuery?
               (cascade delete with Quiz)

DailyUsage   → id, userId, date, flashcardsGenerated, quizzesGenerated
               @@unique([userId, date])
```

## API Routes

```
POST /api/auth/sync                   # Sync Firebase user to DB (creates if not exists)
GET  /api/users/me                    # Current user data (requires auth)
GET  /api/users/[id]                  # Get user by ID
GET  /api/documents                   # List user's documents
POST /api/documents/upload            # Upload PDF to Tigris
POST /api/documents/extract           # Extract text from uploaded PDF
GET  /api/documents/[id]              # Get document
DELETE /api/documents/[id]            # Delete document
GET  /api/flashcard-sets/[id]         # Get flashcard set with cards
GET  /api/quizzes/[id]                # Get quiz with questions
POST /api/generate/flashcards         # Generate flashcards from document (AI)
POST /api/generate/quiz               # Generate quiz from document (AI)
POST /api/generate/topic              # Generate from free-form topic (no document)
POST /api/gamification/xp             # Award XP { action: "flashcard_review"|"quiz_correct"|"quiz_wrong" }
GET  /api/usage                       # Get daily generation limits
POST /api/stripe/checkout             # Create embedded checkout session
POST /api/stripe/cancel               # Cancel subscription
POST /api/stripe/webhook              # Stripe webhook handler
GET  /api/admin/users                 # List all users (admin only)
GET  /api/admin/users/[id]            # User details (admin only)
GET  /api/admin/stats                 # Platform stats (admin only)
```

All authenticated endpoints expect `Authorization: Bearer <firebase-id-token>`.

## Design System

**Dark theme (dashboard)**
- Background: `#0B0D12` | Surface: `#11141A` | Border: `#1E212A`
- Text: white (primary), gray-400/500 (secondary)

**Accent colors**
- Blue `#3B82F6` (primary actions, flashcards)
- Green `#22C55E` (success, quizzes, correct answers)
- Red (errors, wrong answers, cancel)
- Orange `#F97316` (warnings)
- Yellow `#FACC15` (XP, gamification)

**Light theme** (marketing pages only): white bg, dark text

**Fonts**: Geist Sans + Geist Mono (Google Fonts)
**Border-radius**: 10px default
**Toasts**: Sonner, top-right, dark styled (`#11141A` bg, `#1E212A` border)

## Gamification

| Level      | Min XP | Icon           | Color  |
|------------|--------|----------------|--------|
| Iniciante  | 0      | BookOpen       | Gray   |
| Estudante  | 100    | GraduationCap  | Blue   |
| Mestre     | 500    | Award          | Purple |
| Genio      | 2000   | Crown          | Yellow |

- Flashcard "I know": +10 XP
- Quiz correct: +20 XP
- Quiz wrong: +5 XP
- Streak: +1/day, resets if skipped, based on lastStudyDate
- Confetti on quiz >70% or flashcard completion

## Stripe Plans

- **Free**: $0/month — 1 upload, limited daily generations
- **Pro Monthly**: R$29.90 (BRL) / $9.99 (USD)
- **Pro Yearly**: R$199.99 (BRL) / $99.99 (USD)
- Embedded checkout via `@stripe/react-stripe-js`

## i18n

- Languages: `en`, `pt` (default locale: `en`)
- Translation files: `src/app/messages/{en,pt}.json`
- Namespaces: Auth, Navbar, Home, Flashcards, Quiz, Upload, Toasts, Gamification, Pricing, Landing.*
- Usage: `useTranslations("Namespace")` hook
- Middleware bypasses locale for: /admin, /home, /pricing, /privacy, /terms, /manifesto, /join, /study

## Key Patterns

- **Auth flow**: Firebase Auth → `useAuth` hook → `useAppUser` fetches `/users/me` → conditional rendering
- **API client**: Axios at `/api` with interceptor auto-attaching Firebase ID token
- **Animations**: Framer Motion for page transitions, card stagger, 3D flashcard flip, badge animations
- **File upload**: react-dropzone → POST /documents/upload (Tigris S3) → POST /documents/extract → optional auto-generate
- **AI generation**: Gemini 2.5 Flash, temperature 0.3, outputs JSON for flashcards (10-15) or quizzes (7-20)
- **Mobile layout**: Bottom tab navigation (Home, Flashcards, Quizzes, Pricing), single-column, touch-optimized

## Environment Variables

```
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID

# Database
DATABASE_URL                          # PostgreSQL connection string

# AI
GEMINI_API_KEY

# Stripe
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
STRIPE_PRICE_ID_PRO_BRL
STRIPE_PRICE_ID_PRO_USD
STRIPE_PRICE_ID_PRO_BRL_YEARLY
STRIPE_PRICE_ID_PRO_USD_YEARLY
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY

# Storage (Tigris/S3)
TIGRIS_ACCESS_KEY_ID
TIGRIS_SECRET_ACCESS_KEY
TIGRIS_ENDPOINT_URL
TIGRIS_BUCKET_NAME

# App
NEXT_PUBLIC_APP_URL                   # https://tryquibly.com

# Firebase Admin
FIREBASE_PROJECT_ID
FIREBASE_CLIENT_EMAIL
FIREBASE_PRIVATE_KEY
```
