# Skills Required — Instagram Web App Clone

Comprehensive breakdown of every skill needed to build, test, and deploy this full-stack Instagram clone. Each skill is researched, categorized, and mapped to its role in the project.

---

## Table of Contents

1. [Frontend Skills](#1-frontend-skills)
2. [Backend Skills](#2-backend-skills)
3. [Database & Data Skills](#3-database--data-skills)
4. [DevOps & Deployment Skills](#4-devops--deployment-skills)
5. [Testing & QA Skills](#5-testing--qa-skills)
6. [UI/UX & Design Skills](#6-uiux--design-skills)
7. [Soft Skills & Engineering Practices](#7-soft-skills--engineering-practices)
8. [Skill Proficiency Levels](#8-skill-proficiency-levels)

---

## 1. Frontend Skills

### 1.1 TypeScript (Core Language)

| Aspect                   | What You Need to Know                                                                 |
| ------------------------ | ------------------------------------------------------------------------------------- | --------------------- |
| **Types & Interfaces**   | Custom types for User, Post, Comment, etc.; generics for hooks and API responses      |
| **Utility Types**        | `Partial<T>`, `Pick<T>`, `Omit<T>`, `Record<K,V>` for state management                |
| **Strict Mode**          | `strict: true` in tsconfig — catches null/undefined at compile time                   |
| **Discriminated Unions** | For notification types (`{ type: 'like' }                                             | { type: 'comment' }`) |
| **Type Narrowing**       | `typeof`, `instanceof`, custom type guards                                            |
| **Module System**        | ES modules, barrel exports, path aliases (`@/components/*`)                           |
| **Async/Await**          | Proper typing of async functions, Promise return types                                |
| **Why needed**           | Every file in the project is `.ts` or `.tsx` — from Prisma schema to React components |

### 1.2 React 19

| Skill                           | Application in Project                                                 |
| ------------------------------- | ---------------------------------------------------------------------- |
| **Components**                  | Every UI element is a React component (PostCard, CommentSection, etc.) |
| **Props**                       | Typed props for all components, children prop patterns                 |
| **State (useState)**            | Local UI state (modals open/close, form inputs)                        |
| **Effects (useEffect)**         | Socket connection, scroll listeners, API cleanup                       |
| **Context**                     | Theme context, socket context (if avoiding Zustand for some cases)     |
| **Refs (useRef)**               | File input refs, video player refs, IntersectionObserver refs          |
| **Memo (useMemo, useCallback)** | Performance optimization for feed items, comment lists                 |
| **Portals (createPortal)**      | Modals, tooltips rendered outside DOM hierarchy                        |
| **Suspense**                    | Streaming SSR, fallback loading states                                 |
| **Server Components (RSC)**     | Fetch data on server, reduce client JS bundle                          |
| **Server Actions**              | Form submissions, post creation, mutations without API routes          |
| **useOptimistic**               | Instant UI updates for likes, follows, comments                        |
| **useFormStatus**               | Pending state for form submissions                                     |
| **React 19 New**                | `use()` hook for reading resources in render                           |

### 1.3 Next.js 15 (App Router)

| Skill                                     | Application                                                       |
| ----------------------------------------- | ----------------------------------------------------------------- |
| **File-based Routing**                    | All pages: `/feed`, `/profile/[username]`, `/settings/*`          |
| **Layouts**                               | Nested layouts: `(auth)` for login, `(main)` for app with sidebar |
| **Loading UI**                            | `loading.tsx` per route segment                                   |
| **Error Boundaries**                      | `error.tsx` for graceful error recovery                           |
| **Route Groups**                          | `(auth)` and `(main)` for different layout structures             |
| **Dynamic Routes**                        | `[username]`, `[postId]`, `[conversationId]`                      |
| **Parallel Routes**                       | Feed + suggestions panel rendered in parallel                     |
| **Intercepting Routes**                   | Post modal opening from feed while preserving scroll position     |
| **Server Components**                     | Fetch feed data, user profiles — zero client JS for reads         |
| **Client Components**                     | Interactive elements: like button, comment form, share menu       |
| **Route Handlers**                        | API endpoints under `app/api/`                                    |
| **Middleware**                            | Auth redirects, route protection, i18n detection                  |
| **Image Optimization**                    | `next/image` for all media — WebP, lazy loading, responsive sizes |
| **Link Component**                        | Client-side transitions, prefetching                              |
| **Script Loading**                        | Third-party scripts (analytics) with `next/script`                |
| **Metadata API**                          | Dynamic `<title>`, `<meta>`, Open Graph for profiles and posts    |
| **ISR (Incremental Static Regeneration)** | Profile pages, hashtag pages — revalidate on content change       |
| **Turbopack**                             | Dev server bundler (10x faster than webpack)                      |

### 1.4 Tailwind CSS v4

| Skill                   | Application                                                          |
| ----------------------- | -------------------------------------------------------------------- |
| **Utility Classes**     | Every style is a utility — no custom CSS files for layout            |
| **Responsive Prefixes** | `sm:`, `md:`, `lg:`, `xl:`, `2xl:` for all device sizes              |
| **Mobile-First**        | Base styles for mobile, overrides for larger screens                 |
| **Dark Mode**           | `dark:` prefix, class strategy toggle, localStorage persistence      |
| **Flexbox & Grid**      | Sidebar layout (flex), profile grid (grid-cols-3), feed (flex-col)   |
| **Spacing Scale**       | Consistent margins/padding using Tailwind's scale (p-4, gap-3, etc.) |
| **Typography**          | Text sizes, leading, tracking for headings and body                  |
| **Colors**              | Custom Instagram palette in `tailwind.config.ts`                     |
| **Animations**          | `animate-bounce` for likes, custom keyframes for heart pop           |
| **Transitions**         | `transition-all`, `hover:scale-105`, `focus:ring-2`                  |
| **Arbitrary Values**    | `w-[calc(100%-244px)]` for sidebar offset                            |
| **Container Queries**   | `@container`, `@sm:`, `@md:` for reusable card components            |
| **CSS Variables**       | `--ig-primary`, `--ig-bg` for theme customization                    |
| **`@apply`**            | Only for repeated patterns (only if needed)                          |
| **`cn()` Utility**      | Conditional class merging with Tailwind Merge                        |
| **Plugins**             | `tailwindcss-animate` for animations, forms plugin                   |
| **Why needed**          | Zero custom CSS files. The entire UI is built with utility classes   |

### 1.5 Tailwind CSS V4 Key Skills (specific to v4)

| Skill                        | What Changed                                                       |
| ---------------------------- | ------------------------------------------------------------------ |
| **CSS-first Config**         | No `tailwind.config.js` — configure in `globals.css` with `@theme` |
| **Oxide Engine**             | Rust-based, 10x faster builds, automatic content detection         |
| **Native Container Queries** | `@container` syntax without plugins                                |
| **3D Transforms**            | `rotate-x-*`, `rotate-y-*`, `perspective-*` for UI effects         |
| **Logical Properties**       | `ms-*`, `me-*` for RTL/i18n support                                |
| **`@starting-style`**        | Entry animations without JavaScript                                |
| **Cascade Layers**           | `@layer base`, `@layer components` for proper specificity          |

### 1.6 State Management (Zustand + React Query)

| Skill                            | Application                                                            |
| -------------------------------- | ---------------------------------------------------------------------- |
| **Zustand Store**                | Auth state (user, token), UI state (sidebar open, modal type), theme   |
| **Actions**                      | Login/logout actions, toggle sidebar, set theme                        |
| **Persistence (middleware)**     | Theme preference in localStorage                                       |
| **React Query (TanStack Query)** | All server state — posts, comments, notifications                      |
| **useInfiniteQuery**             | Feed pagination, comment loading, notification list                    |
| **useMutation**                  | Like, follow, comment, create post — optimistic updates                |
| **Query Invalidation**           | `invalidateQueries` after mutations (e.g., refetch feed after posting) |
| **Optimistic Updates**           | Instant UI for like/follow, rollback on error                          |
| **Query Keys**                   | Structured key factory: `['posts', 'feed', 'following']`               |
| **Why both**                     | Zustand for client-only state, React Query for server-synced state     |

### 1.7 Forms & Validation (React Hook Form + Zod)

| Skill                     | Application                                                                    |
| ------------------------- | ------------------------------------------------------------------------------ |
| **React Hook Form**       | Login form, signup form, create post form, settings forms                      |
| **register/handleSubmit** | Standard form pattern with validation                                          |
| **Form Errors**           | Display Zod validation errors inline                                           |
| **Zod Schemas**           | `loginSchema`, `signupSchema`, `postSchema` — shared between client and server |
| **Zod Refine**            | Custom validators (username uniqueness, password strength)                     |
| **Zod Type Inference**    | `z.infer<typeof schema>` for TypeScript types                                  |
| **File Validation**       | Zod for file size, type, dimensions                                            |

### 1.8 Accessibility (a11y)

| Skill                   | Application                                                                   |
| ----------------------- | ----------------------------------------------------------------------------- |
| **ARIA Attributes**     | `aria-label` on icon buttons, `aria-current` on nav, `aria-expanded` on menus |
| **Keyboard Navigation** | Tab order, Enter/Space for buttons, Escape for modals                         |
| **Focus Management**    | Focus trap in modals, `focus-visible` for keyboard-only outlines              |
| **Screen Readers**      | `sr-only` classes for icon-only buttons, live regions for notifications       |
| **Color Contrast**      | WCAG AA compliance (4.5:1 text, 3:1 large text)                               |
| **Reduced Motion**      | `prefers-reduced-motion` media query, disable animations                      |
| **Semantic HTML**       | `<nav>`, `<main>`, `<article>`, `<aside>` instead of div soup                 |

### 1.9 Performance Optimization

| Skill                  | Application                                                     |
| ---------------------- | --------------------------------------------------------------- |
| **Code Splitting**     | `next/dynamic` for heavy components (editor, video player)      |
| **Lazy Loading**       | `loading="lazy"` on images, IntersectionObserver for feed items |
| **Bundle Analysis**    | `@next/bundle-analyzer` to identify large dependencies          |
| **Image Optimization** | `next/image` with `sizes`, WebP format, responsive srcSet       |
| **Memoization**        | `React.memo` for post cards, `useMemo` for sorted lists         |
| **Virtualization**     | `@tanstack/react-virtual` for long message lists                |
| **Debouncing**         | Search input, scroll handlers, resize handlers                  |
| **CSS Containment**    | `content-visibility: auto` for off-screen posts                 |

---

## 2. Backend Skills

### 2.1 Node.js & TypeScript (Runtime)

| Skill                     | Application                                                         |
| ------------------------- | ------------------------------------------------------------------- |
| **Event Loop**            | Understanding non-blocking I/O for file uploads and DB queries      |
| **Streams**               | For large file uploads and video processing                         |
| **Async/Await Patterns**  | All API handlers, Prisma queries, Socket.io events                  |
| **Error Handling**        | Try/catch in every route handler, global error boundary             |
| **Environment Variables** | `process.env` for secrets, typed with envalid or Zod                |
| **Process Management**    | Dev (nodemon/turbopack), production (Node.js cluster or serverless) |
| **NPM/Yarn**              | Dependency management, scripts, workspace setup                     |

### 2.2 API Design (REST)

| Skill                         | Application                                                         |
| ----------------------------- | ------------------------------------------------------------------- |
| **RESTful Conventions**       | Resources: `/users`, `/posts`, `/comments`, `/likes`                |
| **HTTP Methods**              | GET (read), POST (create), PUT (update), DELETE (delete)            |
| **Status Codes**              | 200, 201, 204, 400, 401, 403, 404, 409, 422, 500                    |
| **JSON Responses**            | Consistent response shape: `{ data, error, meta }`                  |
| **CORS**                      | Configure for development (localhost:3000 & :4000)                  |
| **Rate Limiting**             | Per-endpoint limits using Upstash Redis                             |
| **Pagination**                | Cursor-based: `cursor`, `limit`, `nextCursor` in responses          |
| **Error Handling Middleware** | Centralized error handler returning structured JSON                 |
| **Why Route Handlers**        | Next.js App Router handles both frontend and backend in one project |

### 2.3 Authentication & Authorization (NextAuth.js v5)

| Skill                    | Application                                                  |
| ------------------------ | ------------------------------------------------------------ |
| **OAuth 2.0**            | Google and GitHub OAuth provider integration                 |
| **JWT**                  | JSON Web Tokens for session management (stateless)           |
| **Credentials Provider** | Email + password sign-in with bcrypt                         |
| **Database Adapter**     | Prisma adapter for storing sessions/accounts in PostgreSQL   |
| **Callbacks**            | `jwt()`, `session()` callbacks for custom token/session data |
| **Middleware**           | `getToken()` in middleware for route protection              |
| **Session Strategy**     | JWT strategy (no database read on every request)             |
| **2FA (TOTP)**           | speakeasy + qrcode library for two-factor auth               |
| **Password Hashing**     | bcrypt with 12 salt rounds                                   |
| **Email Verification**   | Send verification token, verify on callback                  |

### 2.4 Prisma ORM

| Skill               | Application                                                           |
| ------------------- | --------------------------------------------------------------------- |
| **Schema Design**   | 14 models with relations, enums, indexes, unique constraints          |
| **Migrations**      | `prisma migrate dev`, `prisma migrate deploy`                         |
| **Prisma Client**   | Type-safe queries: `prisma.user.findUnique()`, `prisma.post.create()` |
| **Relations**       | Include, nested writes, `select` for specific fields                  |
| **Pagination**      | `skip`/`take` for simple, `cursor`-based for infinite scroll          |
| **Transactions**    | `prisma.$transaction()` for follow + notification creation            |
| **Aggregations**    | Count, sum for follower counts, like counts                           |
| **Raw Queries**     | `prisma.$queryRaw` for complex feed generation SQL                    |
| **Middleware**      | Prisma middleware for logging, soft deletes                           |
| **Connection Pool** | Singleton pattern for serverless (global caching)                     |
| **Seeding**         | `prisma/seed.ts` with realistic fake data (10 users, 30 posts)        |

### 2.5 Socket.io (Real-Time)

| Skill                | Application                                                     |
| -------------------- | --------------------------------------------------------------- |
| **Server Setup**     | Socket.io server alongside Next.js (custom server or Railway)   |
| **Client Setup**     | `socket.io-client` in React with SocketProvider                 |
| **Events**           | `chat:send`, `chat:message`, `notification:new`, `typing:start` |
| **Rooms**            | Per-user rooms (`user:${userId}`), per-conversation rooms       |
| **Acknowledgements** | Callback confirmation for message delivery                      |
| **Connection State** | Reconnection logic, disconnect handling                         |
| **Authentication**   | JWT token verification on socket connection                     |
| **Scaling**          | Redis adapter for Socket.io across multiple instances           |

### 2.6 File Upload & Media Processing

| Skill                     | Application                                                      |
| ------------------------- | ---------------------------------------------------------------- |
| **Cloudinary API**        | Upload widget, pre-signed URLs, server-side upload               |
| **Image Transformations** | Resize (feed thumbnails), crop (profile avatars), format (WebP)  |
| **Video Processing**      | Transcoding, thumbnail generation for reels                      |
| **Upload Validation**     | File type (image/jpeg, video/mp4), size limit (10MB), dimensions |
| **Optimization**          | Responsive images via Cloudinary `w_` and `q_` params            |
| **CDN Delivery**          | Cloudinary CDN for global low-latency media access               |

### 2.7 Caching (Redis via Upstash)

| Skill                 | Application                                                  |
| --------------------- | ------------------------------------------------------------ |
| **Key-Value Storage** | Sessions, rate limit counters, feed caches                   |
| **Sorted Sets**       | Feed ordering by timestamp (`ZADD`, `ZRANGE`)                |
| **Pub/Sub**           | Socket.io Redis adapter for multi-instance real-time         |
| **TTL**               | Auto-expire keys: 10 min for feed cache, 24h for rate limits |
| **Atomic Operations** | `INCR` for like counts, `SADD`/`SREM` for follow sets        |
| **Connection**        | HTTP-based Redis (Upstash) — no TCP needed, edge-friendly    |

### 2.8 Security

| Skill                  | Application                                                     |
| ---------------------- | --------------------------------------------------------------- |
| **HTTPS**              | Enforce in production, HSTS headers                             |
| **CSRF**               | NextAuth.js built-in CSRF protection                            |
| **XSS Prevention**     | React's automatic escaping, CSP headers, sanitize user input    |
| **SQL Injection**      | Prevented by Prisma's parameterized queries                     |
| **Password Policy**    | Min 8 chars, mix of cases/numbers, bcrypt hashing               |
| **Rate Limiting**      | Redis-based: 100 requests/min per user, 10 login attempts/min   |
| **File Upload Safety** | Validate MIME type, scan with ClamAV (optional), strip EXIF     |
| **Helmet.js**          | Security headers: X-Frame-Options, X-Content-Type-Options, etc. |
| **CORS**               | Whitelist allowed origins, restrict methods                     |
| **Audit Logging**      | Login attempts, password changes, account deletions             |

---

## 3. Database & Data Skills

### 3.1 PostgreSQL

| Skill                  | Application                                                   |
| ---------------------- | ------------------------------------------------------------- |
| **Schema Design**      | Tables, columns, data types, constraints                      |
| **Relations**          | One-to-many (user→posts), many-to-many (follows via junction) |
| **Indexes**            | B-tree on foreign keys, createdAt for sorting                 |
| **Unique Constraints** | Email, username, (postId, userId) for likes                   |
| **Full-Text Search**   | `tsvector`/`tsquery` for user and hashtag search              |
| **JSONB**              | Flexible metadata fields for posts                            |
| **Connection Pooling** | PgBouncer or Neon's built-in pooling for serverless           |
| **Migrations**         | Prisma handles this, but understanding SQL migrations helps   |
| **Explain Analyze**    | Query performance debugging for slow feed queries             |

### 3.2 Data Modeling

| Skill                     | Application                                                        |
| ------------------------- | ------------------------------------------------------------------ |
| **Entity Identification** | Users, Posts, Comments, Likes, Follows, Messages, Notifications    |
| **Relationship Mapping**  | Cardinality, direction, optionality                                |
| **Normalization**         | 3NF for structured data (users, posts), denormalization for counts |
| **Denormalization**       | Cached counts (likeCount on Post) for performance                  |
| **Soft Delete**           | `isDeleted` flag on posts, messages (30-day recovery)              |
| **Audit Fields**          | `createdAt`, `updatedAt` on all models                             |

### 3.3 Query Optimization

| Skill                | Application                                                   |
| -------------------- | ------------------------------------------------------------- |
| **Index Strategies** | Composite indexes: `(userId, createdAt)` for timeline queries |
| **Query Planning**   | `EXPLAIN` to identify full table scans                        |
| **N+1 Problem**      | Prisma `include` and `select` to batch related queries        |
| **Pagination**       | Cursor-based (UUID/createdAt) over offset for stable results  |
| **Batch Operations** | `createMany` for seed data, `updateMany` for bulk actions     |
| **Subqueries**       | Feed generation: "posts from users I follow"                  |

---

## 4. DevOps & Deployment Skills

### 4.1 Git & Version Control

| Skill               | Application                                                    |
| ------------------- | -------------------------------------------------------------- |
| **Git Basics**      | `add`, `commit`, `push`, `pull`, `branch`, `merge`             |
| **Branch Strategy** | `main` (production), `develop`, `feat/*`, `fix/*`, `release/*` |
| **Pull Requests**   | Code review process, squash merging                            |
| **.gitignore**      | Node modules, .env, build output, Prisma generated files       |
| **Commit Messages** | Conventional commits: `feat:`, `fix:`, `chore:`, `docs:`       |

### 4.2 Vercel Deployment

| Skill                     | Application                                       |
| ------------------------- | ------------------------------------------------- |
| **Project Setup**         | Import from GitHub, configure build settings      |
| **Environment Variables** | Add all secrets in Vercel dashboard               |
| **Preview Deployments**   | Auto-deploy on PR, unique URL per branch          |
| **Custom Domain**         | Configure DNS, SSL certs (auto-provisioned)       |
| **Monorepo Support**      | If using Turborepo for separated frontend/backend |
| **Serverless Functions**  | Next.js API routes as serverless functions        |
| **Edge Functions**        | Middleware at edge for auth, redirects            |

### 4.3 Railway Deployment (Backend)

| Skill                  | Application                                             |
| ---------------------- | ------------------------------------------------------- |
| **Service Setup**      | PostgreSQL service, Redis service                       |
| **Environment Config** | Secrets management, port mapping                        |
| **Scaling**            | Vertical/horizontal scaling, auto-pause for cost saving |
| **Logging**            | Railway dashboard logs, structured logging              |
| **Backups**            | Automatic daily PostgreSQL backups                      |

### 4.4 CI/CD

| Skill                | Application                                  |
| -------------------- | -------------------------------------------- |
| **GitHub Actions**   | Lint → Test → Build → Deploy pipeline        |
| **PR Checks**        | Auto-run TypeScript check, lint, tests on PR |
| **Auto Deploy**      | Deploy to Vercel on merge to main            |
| **Migration Safety** | Run Prisma migrations before deploy in CI    |

### 4.5 Monitoring & Observability

| Skill                      | Application                                     |
| -------------------------- | ----------------------------------------------- |
| **Error Tracking**         | Sentry for both frontend and backend errors     |
| **Performance Monitoring** | Vercel Analytics for Web Vitals (LCP, CLS, INP) |
| **Uptime Monitoring**      | Better Stack or Uptime Robot                    |
| **Logging**                | Console.log → structured JSON → log aggregation |
| **Alerts**                 | Email/Slack on error spike or downtime          |

---

## 5. Testing & QA Skills

### 5.1 Unit Testing (Vitest)

| Skill             | Application                                                       |
| ----------------- | ----------------------------------------------------------------- |
| **Test Setup**    | Describe/it blocks, expect matchers, setup/teardown               |
| **Mocking**       | `vi.mock()` for Prisma, `vi.fn()` for callbacks                   |
| **Async Testing** | Testing async hooks, API calls, Promises                          |
| **Coverage**      | `vitest --coverage` for code coverage report                      |
| **Watch Mode**    | `vitest --watch` for TDD workflow                                 |
| **Files to test** | Hooks (useDebounce, useInfiniteScroll), utils, validations, store |

### 5.2 Integration Testing (Vitest + RTL)

| Skill                     | Application                                               |
| ------------------------- | --------------------------------------------------------- |
| **React Testing Library** | `render()`, `screen.getByRole()`, `fireEvent`             |
| **User Events**           | `@testing-library/user-event` for realistic interactions  |
| **Async Queries**         | `waitFor()`, `findByRole()` for loading states            |
| **Mock Providers**        | Wrap components with mocked QueryClient, SessionProvider  |
| **Form Testing**          | Fill inputs, submit, check validation errors              |
| **Snapshot Testing**      | Rarely — only for stable, infrequently changed components |

### 5.3 E2E Testing (Playwright)

| Skill                  | Application                                             |
| ---------------------- | ------------------------------------------------------- |
| **Browser Automation** | `page.goto()`, `page.click()`, `page.fill()`            |
| **Assertions**         | `expect(locator).toBeVisible()`, `toHaveText()`         |
| **API Mocking**        | `page.route()` to intercept network requests            |
| **Mobile Testing**     | `chromium.devices['iPhone 14']` for responsive testing  |
| **Auth State**         | Storage state reuse via `page.context().storageState()` |
| **Screenshots**        | Visual regression: `expect(page).toHaveScreenshot()`    |
| **CI Integration**     | `playwright/action` GitHub Action                       |
| **Report**             | HTML report with traces for failed tests                |

### 5.4 Performance Testing

| Skill                  | Application                                               |
| ---------------------- | --------------------------------------------------------- |
| **Lighthouse**         | `lighthouse-ci` for Core Web Vitals in CI                 |
| **Load Testing (k6)**  | Simulate concurrent users hitting feed and post endpoints |
| **Bundle Analysis**    | `@next/bundle-analyzer` for JS bundle size                |
| **Network Throttling** | DevTools slow 3G for mobile testing                       |

### 5.5 Manual QA Checklist

| Skill               | Application                                     |
| ------------------- | ----------------------------------------------- |
| **Cross-browser**   | Chrome, Firefox, Safari, Edge                   |
| **Responsive**      | Test at 375px, 768px, 1024px, 1440px            |
| **Dark Mode**       | Toggle and verify all pages                     |
| **Offline/Network** | Slow network, offline indicator                 |
| **Edge Cases**      | Empty states, loading states, error states, 404 |
| **Accessibility**   | Tab through all features, screen reader test    |

---

## 6. UI/UX & Design Skills

### 6.1 Design Systems

| Skill                   | Application                                                     |
| ----------------------- | --------------------------------------------------------------- |
| **Component Libraries** | Building a custom design system from scratch                    |
| **Design Tokens**       | Color, spacing, typography, shadow tokens in CSS variables      |
| **Atomic Design**       | Atoms (Button, Input) → Molecules (PostCard) → Organisms (Feed) |
| **Consistency**         | Reuse components, avoid style drift                             |

### 6.2 Color Theory & Application

| Skill                   | Application                                                 |
| ----------------------- | ----------------------------------------------------------- |
| **Instagram Palette**   | `#405DE6`, `#833AB4`, `#E1306C`, `#FCAF45` — gradient usage |
| **Accessible Contrast** | WCAG AA ratios for text on backgrounds                      |
| **Semantic Colors**     | Success (green), Error (red), Warning (yellow)              |
| **Dark Mode Design**    | Invert lightness, adjust saturation, preserve brand colors  |
| **Gradient Mastery**    | Instagram's signature gradient on stories, logo, highlights |

### 6.3 Responsive Design

| Skill                 | Application                                                     |
| --------------------- | --------------------------------------------------------------- |
| **Mobile-First**      | Design for 375px first, then enhance for larger screens         |
| **Breakpoints**       | 480px (mobile), 768px (tablet), 1024px (desktop), 1280px (wide) |
| **Fluid Typography**  | `clamp()` for responsive font sizes                             |
| **Flexible Grids**    | CSS Grid with `auto-fill`, `minmax()` for profile grid          |
| **Container Queries** | Component-level responsiveness for cards and widgets            |
| **Touch Targets**     | Minimum 44x44px for mobile tap targets                          |

### 6.4 UX Patterns (Instagram-Specific)

| Skill                  | Application                                        |
| ---------------------- | -------------------------------------------------- |
| **Infinite Scroll**    | Feed loading, no pagination UI                     |
| **Pull to Refresh**    | Mobile gesture for feed refresh                    |
| **Double-Tap to Like** | Gesture on post media                              |
| **Swipe Gestures**     | Stories navigation, carousel, reels vertical swipe |
| **Bottom Sheet**       | Share menu, comment options                        |
| **Haptic Feedback**    | Like vibration on mobile (future)                  |
| **Skeleton Loading**   | Placeholder shimmer while content loads            |

### 6.5 Animation & Micro-interactions

| Skill                 | Application                                              |
| --------------------- | -------------------------------------------------------- |
| **CSS Animations**    | `@keyframes` for heart bounce, shimmer skeleton          |
| **Framer Motion**     | Page transitions, modal enter/exit, list reorder         |
| **Transition Timing** | Ease-in-out for hover states, spring for likes           |
| **Performance**       | GPU-accelerated properties only (`transform`, `opacity`) |
| **Reduced Motion**    | Respect `prefers-reduced-motion`                         |

### 6.6 Figma (Design Tool)

| Skill                     | Application                          |
| ------------------------- | ------------------------------------ |
| **Wireframing**           | Low-fidelity layout sketches         |
| **High-Fidelity Mockups** | Pixel-perfect UI screens             |
| **Auto Layout**           | Responsive component design          |
| **Variants**              | Button states, card variations       |
| **Prototyping**           | Click-through flows for user testing |

---

## 7. Soft Skills & Engineering Practices

### 7.1 Problem-Solving & Architecture

| Skill                  | Application                                                   |
| ---------------------- | ------------------------------------------------------------- |
| **System Design**      | Scalable feed generation, fanout patterns, caching strategies |
| **Trade-off Analysis** | Push vs pull feed, SQL vs NoSQL, SSR vs CSR                   |
| **Refactoring**        | Improve code without changing behavior                        |
| **Debugging**          | Chrome DevTools, VS Code debugger, server logs                |

### 7.2 Code Quality

| Skill             | Application                                              |
| ----------------- | -------------------------------------------------------- |
| **Clean Code**    | Meaningful names, small functions, single responsibility |
| **DRY**           | Extract reusable hooks, components, utilities            |
| **SOLID**         | Open/closed principle in component design                |
| **Code Reviews**  | Review PRs, provide constructive feedback                |
| **Documentation** | Clear README, JSDoc for complex functions                |

### 7.3 Collaboration

| Skill                | Application                                            |
| -------------------- | ------------------------------------------------------ |
| **Git Workflow**     | Feature branches, rebase vs merge, conflict resolution |
| **Task Management**  | Breaking work into tickets, estimating effort          |
| **Communication**    | Clear status updates, asking for help when blocked     |
| **Pair Programming** | Collaborative coding for complex features              |

### 7.4 Tooling & Productivity

| Skill                | Application                                                 |
| -------------------- | ----------------------------------------------------------- |
| **VS Code**          | Extensions: ESLint, Prettier, Tailwind IntelliSense, Prisma |
| **Terminal**         | Command line, npm scripts, git commands                     |
| **Postman/Insomnia** | API testing and documentation                               |
| **Prisma Studio**    | Visual database browser                                     |
| **Chrome DevTools**  | Debugging, performance profiling, network inspection        |

---

## 8. Skill Proficiency Levels

This project requires skills at different levels. Here is the breakdown:

| Level                  | Description                           | Skills at This Level                                          |
| ---------------------- | ------------------------------------- | ------------------------------------------------------------- |
| **★★★★★ Expert**       | Can teach others, deep internals      | TypeScript, React, Tailwind CSS, Git                          |
| **★★★★☆ Advanced**     | Production experience, best practices | Next.js, Prisma, REST APIs, PostgreSQL                        |
| **★★★☆☆ Intermediate** | Can build features independently      | Socket.io, Zustand, React Query, NextAuth, Playwright, Vitest |
| **★★☆☆☆ Competent**    | Can use with guidance                 | Cloudinary, Redis, Docker, CI/CD, Framer Motion               |
| **★☆☆☆☆ Beginner**     | Learning as you build                 | k6 load testing, Sentry, Figma, System design at scale        |

### Skill Map by Project Phase

| Phase             | Primary Skills                      | Secondary Skills                   |
| ----------------- | ----------------------------------- | ---------------------------------- |
| **Scaffolding**   | Next.js, TypeScript, Tailwind, Git  | NPM, VS Code                       |
| **Database**      | Prisma, PostgreSQL                  | Data modeling                      |
| **Auth**          | NextAuth, bcrypt, JWT               | OAuth 2.0                          |
| **Feed**          | React, React Query, Zustand         | Infinite scroll, cursor pagination |
| **Posts/Create**  | File upload, Cloudinary, forms, Zod | Image optimization                 |
| **Profiles**      | Dynamic routing, follow system      | Optimistic updates                 |
| **Stories**       | Timer-based UI, progress bar        | Socket.io                          |
| **Reels**         | Video player, vertical swipe        | IntersectionObserver               |
| **DMs**           | Socket.io, real-time UI             | Typing indicators, read receipts   |
| **Notifications** | Real-time push, notification bell   | Query invalidation                 |
| **Settings**      | Form management, permissions        | 2FA, theme persistence             |
| **Testing**       | Vitest, RTL, Playwright             | Mocking, CI integration            |
| **Deployment**    | Vercel, Railway, GitHub Actions     | Environment management             |

---

## Summary: The Developer You Need to Be

To build this Instagram clone end-to-end, you need to be comfortable with:

```
Frontend  →  TypeScript + React 19 + Next.js 15 + Tailwind v4 + Zustand + React Query
Backend   →  Node.js + Next.js Route Handlers + Prisma + PostgreSQL + Socket.io
DevOps    →  Git + Vercel + Railway + GitHub Actions + Sentry
Testing   →  Vitest + React Testing Library + Playwright
Design    →  Responsive/Mobile-First + Dark Mode + Animations + Accessibility
```

**Total: ~25 technologies and tools, spanning 6 domains.**

You don't need to be an expert in all of them on day one. You need:

- **Expert** in TypeScript and React
- **Advanced** in Next.js and Tailwind
- **Intermediate** in Prisma, PostgreSQL, and the testing stack
- **Competent** in everything else (learn as you build)

The execution.md is structured so each block builds on the previous one, gradually introducing new skills as you progress through the project.

---

_End of skills.md — Complete skill inventory for the Instagram Web App Clone project._
