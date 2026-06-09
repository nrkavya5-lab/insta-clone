# Insta Clone Documentation

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Features](#features)
  - [Feed](#feed)
  - [Stories](#stories)
  - [Reels](#reels)
  - [Messages](#messages)
  - [Notifications](#notifications)
  - [Search](#search)
  - [Explore](#explore)
  - [Profiles](#profiles)
  - [Create Post](#create-post)
  - [Settings](#settings)
  - [Admin Panel](#admin-panel)
  - [Dark Mode](#dark-mode)
  - [Responsive Design](#responsive-design)
- [Installation Guide](#installation-guide)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [API Overview](#api-overview)
- [Architecture](#architecture)
- [Testing](#testing)
- [License](#license)

---

## Overview

Insta Clone is a full-featured Instagram web application clone built with modern web technologies. It replicates the core Instagram experience including feed browsing, stories, reels, direct messaging, notifications, search, explore, user profiles, post creation, settings, and an admin panel.

The application is built with **Next.js 16.2.6** (App Router with Turbopack), **TypeScript 5** (strict mode), and **Prisma 6.19.3** ORM backed by **PostgreSQL**. The frontend styling is powered by **Tailwind CSS v4** with CSS variables for theming. Authentication is handled by **NextAuth v5** supporting Google OAuth, GitHub OAuth, and credentials-based login with JWT sessions.

The project ships with **71 tests** (32 unit + 39 integration) across 12 test files and **4 Playwright E2E suites**. It features **53 routes** (10 static pages + 43 dynamic API endpoints) and **21 Prisma models** with zero TypeScript errors.

---

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Next.js (App Router, Turbopack) | 16.2.6 |
| Language | TypeScript (strict mode) | ^5 |
| Styling | Tailwind CSS + CSS variables | v4 |
| Database | PostgreSQL + Prisma ORM | 6.19.3 |
| Authentication | NextAuth (Google, GitHub, Credentials, JWT) | v5 |
| Client State | Zustand | ^5.0.13 |
| Server State | TanStack React Query | ^5.100.13 |
| Real-time | Socket.io (client + server) | ^4.8.3 |
| Forms | React Hook Form + Zod | ^7.76.1 / ^4.4.3 |
| Media | Cloudinary | ^2.10.0 |
| Icons | Lucide React | ^1.16.0 |
| Unit/Integration Testing | Vitest + React Testing Library | ^4.1.7 |
| E2E Testing | Playwright | ^1.60.0 |
| Linting | ESLint + Prettier | ^9 |

---

## Features

### Feed

- Infinite scroll with cursor-based pagination
- For You / Following tab switching
- Double-tap to like with heart animation
- Carousel posts with swipe navigation and dot indicators
- Hashtag highlighting with clickable links
- Like, comment, save, and share actions on each post
- Skeleton loading states during data fetch
- Stories bar at the top with unviewed indicators

### Stories

- Full-screen story viewer with progress bar tracking
- Tap left/right edges to navigate between stories
- Auto-advance to next story after current one finishes
- Emoji reactions support
- Create story overlay with media upload
- 24-hour auto-expiry
- Story views tracking

### Reels

- Vertical swipe feed with snap scrolling
- Play/pause toggle on tap
- Mute/unmute controls
- Like, comment, and share actions
- Bookmark/save support
- Full-screen immersive layout

### Messages

- Real-time chat via Socket.io with auto-reconnection
- Typing indicators with animated dots
- Emoji picker for message input
- Read receipts with timestamps
- Media sharing in conversations
- Conversation list with unread badges
- Message requests from non-followers

### Notifications

- Bell icon with unread count badge
- Per-type icons (like, comment, follow, mention, reply)
- Real-time push via Socket.io
- Mark single as read and mark-all-as-read
- Notification list with cursor pagination
- Notification preference toggles (likes, comments, follows, DMs, reminders)

### Search

- Debounced search input (300ms)
- Three result tabs: All, Users, Hashtags
- Recent searches stored in localStorage
- Inline follow/unfollow on user results
- Hashtag post count display
- Trending hashtags section

### Explore

- Masonry grid layout with hover overlay showing like/comment stats
- Infinite scroll for continuous loading
- Post detail modal on click
- Trending content discovery

### Profiles

- 3-column photo grid with pagination
- Profile header with avatar, name, bio, follower/following counts
- Followers and Following modals with search
- Follow button with 3 visual states (follow, following, requested)
- Edit profile capability (avatar, name, bio, website)
- Private account with follow gate
- Highlights bar for story collections

### Create Post

- 5-step wizard: Upload Media, Carousel Editor, Caption, Hashtags, Location
- Drag-and-drop media upload with preview
- Carousel reorder support (up to 10 media items)
- Caption editor with @mention and hashtag autocomplete
- Hashtag suggestions
- Location picker
- Cloudinary integration for media upload

### Settings

- 8 settings pages:
  - **Edit Profile** — Name, username, bio, avatar, website, pronouns
  - **Privacy** — Private account, activity status, comment/tag/message controls
  - **Security** — Password change, two-factor authentication (TOTP), login activity
  - **Appearance** — Light / Dark / System theme, font size
  - **Notifications** — Per-type toggle (likes, comments, follows, DMs, reminders)
  - **Close Friends** — Manage close friends list
  - **Blocked** — View and manage blocked users
  - **Account** — Deactivate temporarily or delete permanently

### Admin Panel

- Dashboard with stats (user count, post count, engagement metrics)
- User management: list, search, ban, unban, verify accounts
- Report queue: view reported content, resolve reports
- Admin-only route protection

### Dark Mode

- Full theme support with CSS variables
- Class-based strategy (`.dark` class on root)
- System preference detection as default
- Persisted preference via Zustand store
- All components respect dark mode tokens

### Responsive Design

| Breakpoint | Width | Layout |
|-----------|-------|--------|
| Mobile | < 768px | Single column, compact spacing, bottom navigation bar |
| Tablet | 768–1023px | Icon sidebar + single column feed |
| Desktop | 1024–1279px | Full sidebar (244px) + feed (630px) + suggestions panel |
| Wide | >= 1280px | Max 975px centered feed with wider suggestions |

- Mobile: bottom navigation with 5 tabs (Home, Search, Create, Reels, Profile)
- Tablet: collapsed icon sidebar
- Desktop: full sidebar with labels and suggestions panel

---

## Installation Guide

### Prerequisites

- Node.js >= 18
- PostgreSQL database (local or remote)
- npm or yarn

### Steps

```bash
# Clone the repository
git clone https://github.com/nrkavya5-lab/insta-clone.git
cd insta-clone

# Install dependencies
npm install

# Set up environment variables (see next section)
# Copy the variables below into a .env file in the project root

# Run database migrations
npx prisma migrate dev

# Seed the database (optional)
npx prisma db seed

# Start development server
npm run dev
```

The server starts on `http://localhost:3000`.

### Production Build

```bash
npm run build
npm start
```

---

## Environment Variables

Create a `.env` file in the project root:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/instaclone"

# Auth (NextAuth v5)
AUTH_SECRET="generate-with-openssl-rand-hex-32"
AUTH_GOOGLE_ID=""
AUTH_GOOGLE_SECRET=""
AUTH_GITHUB_ID=""
AUTH_GITHUB_SECRET=""

# Media (Cloudinary)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=""
CLOUDINARY_API_KEY=""
CLOUDINARY_API_SECRET=""

# Redis (Upstash, optional)
REDIS_URL=""

# Socket.io
NEXT_PUBLIC_SOCKET_URL="http://localhost:3000"

# App URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

---

## Project Structure

```
insta-clone/
├── .opencode/                  # OpenCode agent configurations
│   └── agents/
│       ├── architect.md
│       ├── backend.md
│       ├── frontend.md
│       ├── scaffolder.md
│       ├── tester.md
│       ├── reviewer.md
│       ├── typechecker.md
│       └── perf-auditor.md
├── prisma/
│   └── schema.prisma           # 21 database models
├── public/                     # Static assets
├── src/
│   ├── app/
│   │   ├── (auth)/             # Login, signup, forgot password pages
│   │   │   ├── login/
│   │   │   ├── signup/
│   │   │   └── forgot-password/
│   │   ├── (main)/             # Main app with sidebar layout
│   │   │   ├── feed/           # Home feed page
│   │   │   ├── explore/        # Explore grid page
│   │   │   ├── messages/       # Inbox + conversation view
│   │   │   ├── notifications/  # Notification list
│   │   │   ├── post/           # Post detail + create wizard
│   │   │   ├── profile/        # User profile pages
│   │   │   ├── search/         # Search page
│   │   │   ├── settings/       # 8 settings pages
│   │   │   └── layout.tsx      # Sidebar + main content layout
│   │   ├── (reels)/            # Reels feed (full-screen layout)
│   │   │   └── reels/
│   │   ├── (admin)/            # Admin panel with layout
│   │   │   └── admin/
│   │   │       ├── page.tsx    # Dashboard
│   │   │       ├── users/      # User management
│   │   │       └── reports/    # Report queue
│   │   ├── api/                # 43 dynamic API route handlers
│   │   │   ├── auth/           # NextAuth catch-all + verify-email
│   │   │   ├── users/          # Profile, follow, followers, suggestions
│   │   │   ├── posts/          # Feed, CRUD, like, comment, save, archive
│   │   │   ├── stories/        # Story CRUD, views, highlights
│   │   │   ├── reels/          # Reels CRUD, like/unlike
│   │   │   ├── messages/       # Conversations, messages, requests
│   │   │   ├── notifications/  # List, unread count, mark read
│   │   │   ├── search/         # Global search
│   │   │   ├── hashtags/       # Search, trending, detail
│   │   │   ├── settings/       # Privacy, security, appearance, etc.
│   │   │   ├── media/          # Cloudinary upload
│   │   │   └── admin/          # Dashboard, users, reports
│   │   ├── layout.tsx          # Root layout with providers
│   │   ├── page.tsx            # Home redirect
│   │   └── globals.css         # Tailwind + CSS variables + dark mode
│   ├── components/
│   │   ├── ui/                 # Avatar, Button, Input, Modal, Spinner, Skeleton, Toast
│   │   ├── auth/               # LoginForm, SignupForm, OAuthButtons, ForgotPasswordForm
│   │   ├── layout/             # Sidebar, BottomNav, TopBar, MobileHeader, SuggestionsPanel
│   │   ├── feed/               # FeedPost, StoriesBar, StoryRing, CarouselViewer, LikeButton
│   │   ├── post/               # PostCard, PostGrid, PostModal, CommentSection, ShareMenu
│   │   ├── create/             # MediaUploader, MediaPreview, CaptionEditor, CarouselEditor, LocationPicker
│   │   ├── profile/            # ProfileHeader, ProfileGrid, FollowButton, FollowersModal, FollowingModal
│   │   ├── messages/           # ChatView, MessageBubble, MessageInput, ConversationList, TypingIndicator
│   │   ├── notifications/      # NotificationList, NotificationItem, NotificationBell
│   │   ├── explore/            # ExploreGrid, SearchBar, TrendingHashtags
│   │   ├── reels/              # ReelCard, ReelActions
│   │   ├── stories/            # StoryViewer, CreateStory
│   │   └── settings/           # EditProfileForm, SettingsSidebar, AvatarUpload
│   ├── hooks/                  # useFeed, useInfiniteScroll, useDebounce, useTheme, useLike, useFollow, useSocket
│   ├── lib/                    # prisma, auth, api-client, validations, utils, constants, upload, socket
│   ├── providers/              # SessionProvider, ThemeProvider, QueryProvider, SocketProvider
│   └── store/                  # themeStore (Zustand)
├── tests/
│   ├── unit/                   # 5 test files (store, hooks, lib)
│   ├── integration/            # 7 test files (components, forms)
│   ├── e2e/                    # 4 Playwright suites
│   │   ├── auth.spec.ts
│   │   ├── feed.spec.ts
│   │   ├── settings.spec.ts
│   │   └── responsive.spec.ts
│   ├── setup.ts
│   └── vitest.d.ts
├── prompts/                    # Build prompts
├── docs/                       # Documentation
├── package.json
├── tsconfig.json
├── next.config.ts
├── vitest.config.ts
├── playwright.config.ts
├── eslint.config.mjs
├── postcss.config.mjs
└── README.md
```

---

## API Overview

The application exposes **43 dynamic API endpoints** (plus NextAuth handler routes) organized into resource groups. All API routes are located under `src/app/api/` and support cursor-based pagination where applicable.

### Auth (`/api/auth`)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `[...nextauth]` | * | NextAuth catch-all (signin, signout, callback, session) |
| `verify-email` | POST | Verify email with token |

### Users (`/api/users`)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | List/search users (query: q, limit, cursor) |
| `/[username]/profile` | GET | Get user profile by username |
| `/[id]/followers` | GET | Get followers list (cursor pagination) |
| `/[id]/following` | GET | Get following list (cursor pagination) |
| `/[id]/follow` | POST | Follow a user |
| `/[id]/unfollow` | DELETE | Unfollow a user |
| `/[id]/accept-request` | POST | Accept follow request |
| `/[id]/decline-request` | DELETE | Decline follow request |
| `/[id]/posts` | GET | Get user's posts (cursor pagination) |
| `/suggestions` | GET | Get suggested users to follow |

### Posts (`/api/posts`)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | Get feed (following + for-you timeline) |
| `/` | POST | Create a post |
| `/explore` | GET | Explore posts (cursor pagination) |
| `/[id]` | GET | Get post detail |
| `/[id]` | PUT | Update post (caption, location) |
| `/[id]` | DELETE | Delete post |
| `/[id]/like` | POST | Like a post |
| `/[id]/unlike` | DELETE | Unlike a post |
| `/[id]/save` | POST | Save/bookmark a post |
| `/[id]/unsave` | DELETE | Remove saved post |

### Stories (`/api/stories`)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | Get active stories from followed users |
| `/` | POST | Create a story |
| `/[id]` | GET | Get story detail |
| `/[id]` | DELETE | Delete a story |

### Reels (`/api/reels`)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | Get reels feed (cursor pagination) |
| `/` | POST | Create a reel |
| `/[id]` | GET | Get reel detail |
| `/[id]` | DELETE | Delete a reel |

### Messages (`/api/messages`)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/conversations` | GET | Get user's conversations |
| `/conversations` | POST | Create conversation |
| `/conversations/[id]` | GET | Get conversation detail |
| `/conversations/[id]` | DELETE | Leave conversation |

### Notifications (`/api/notifications`)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | Get notifications (cursor) |
| `/unread-count` | GET | Get unread count |
| `/read-all` | POST | Mark all as read |
| `/[id]/read` | POST | Mark single as read |

### Hashtags (`/api/hashtags`)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/search` | GET | Search hashtags (query: q) |
| `/[name]` | GET | Get hashtag page with posts |
| `/trending` | GET | Get trending hashtags |

### Search (`/api/search`)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | Global search (q, type=user|hashtag|all) |

### Settings (`/api/settings`)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/privacy` | PUT | Update privacy settings |
| `/notifications` | PUT | Update notification preferences |
| `/appearance` | PUT | Update theme/language |
| `/security` | PUT | Security settings |
| `/close-friends` | GET | Get close friends list |
| `/close-friends` | POST | Add to close friends |
| `/blocked` | GET | Get blocked users |
| `/blocked` | POST | Block a user |
| `/deactivate` | POST | Deactivate account |
| `/delete` | DELETE | Delete account permanently |

### Media (`/api/media`)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/upload` | POST | Upload media to Cloudinary |

### Admin (`/api/admin`)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/dashboard` | GET | Admin stats dashboard |
| `/users` | GET | List all users with filters |
| `/users/[id]/verify` | POST | Verify a user |
| `/reports` | GET | Get reported content |

### Development Mode

Append `?__dev=1` to any API route to receive mock data without authentication or a database connection.

---

## Architecture

### Frontend Architecture

The application follows Next.js 16 App Router conventions with route groups for layout differentiation:

- `(auth)` — Pages without sidebar (login, signup, forgot-password)
- `(main)` — Core app pages wrapped in a layout with sidebar, top bar, and suggestions panel
- `(reels)` — Full-screen immersive layout for reels
- `(admin)` — Admin panel with its own sidebar layout

State management is split between **Zustand** (client-side UI state like theme) and **TanStack React Query** (server state caching, infinite queries, mutations). The API client is a centralized Axios-based module with JWT interceptor for automatic token attachment.

Socket.io provides real-time functionality for messages (typing indicators, new messages) and notifications (push on new events).

### Backend Architecture

API routes are co-located in `src/app/api/` following the Next.js file-based routing pattern. Each route file exports named HTTP method handlers (GET, POST, PUT, DELETE). The Prisma client is a singleton instance, with NextAuth v5 handling authentication using the Prisma adapter for database-backed sessions.

Database operations use Prisma's generated client with full type safety. Cursor-based pagination is used for all list endpoints to provide stable pagination with new content.

### Database Schema

The Prisma schema defines **17 core models**:

| Model | Purpose |
|-------|---------|
| User | User accounts with profile fields and preferences |
| Post | Media posts with like/comment counts and soft delete |
| Story | Ephemeral content with 24-hour expiry |
| StoryView | Story view tracking |
| Comment | Post comments with nested replies |
| Like | Post likes (unique per user-post) |
| SavedPost | Bookmarked posts |
| Follow | Follow relationships with status tracking |
| Conversation | DM threads (group or direct) |
| ConversationParticipant | Conversation membership with read tracking |
| Message | Individual messages with read receipts |
| Notification | Activity notifications with type discrimination |
| NotificationPreference | Per-user notification toggle settings |
| Hashtag | Hashtag registry with post count |
| PostHashtag | Many-to-many post-hashtag junction |
| Block | User block relationships |
| CloseFriend | Close friends list |
| Report | Content moderation reports |

Additionally, NextAuth requires **Account**, **Session**, and **VerificationToken** models.

### Deployment Architecture

The intended deployment uses Vercel for the Next.js frontend (edge + SSR + ISR), Railway for PostgreSQL and the Socket.io server, Upstash for Redis caching, and Cloudinary as the media CDN.

---

## Testing

The project includes **71 tests** across 12 test files, plus **4 Playwright E2E suites**.

### Test Breakdown

| Category | Count | Files | Framework |
|----------|-------|-------|-----------|
| Unit tests | 32 | 5 | Vitest |
| Integration tests | 39 | 7 | Vitest + React Testing Library |
| E2E suites | 4 | 4 | Playwright |

### Unit Tests

Located in `tests/unit/`:

| File | Subject |
|------|---------|
| `store/themeStore.test.ts` | Zustand theme store actions and state |
| `hooks/useDebounce.test.ts` | Debounce hook behavior |
| `hooks/useInfiniteScroll.test.ts` | Infinite scroll hook logic |
| `lib/utils.test.ts` | Utility functions |
| `lib/validations.test.ts` | Zod validation schemas |

### Integration Tests

Located in `tests/integration/`:

| File | Subject |
|------|---------|
| `LoginForm.test.tsx` | Login form validation and submission |
| `SignupForm.test.tsx` | Signup form validation and submission |
| `LikeButton.test.tsx` | Like/unlike interaction |
| `FollowButton.test.tsx` | Follow/unfollow interaction |
| `CommentSection.test.tsx` | Comment create and display |
| `PostCard.test.tsx` | Post card rendering and actions |
| `SearchBar.test.tsx` | Search input and results display |

### E2E Tests

Located in `tests/e2e/`:

| Suite | Scenarios Covered |
|-------|-------------------|
| `auth.spec.ts` | Register, login, logout, protected route access |
| `feed.spec.ts` | Feed scroll, like, comment, save interactions |
| `settings.spec.ts` | Theme toggle, privacy update, notification preferences |
| `responsive.spec.ts` | Mobile bottom nav, tablet sidebar, desktop layout |

### Running Tests

```bash
# Unit + integration tests
npm test

# Watch mode
npm run test:watch

# Vitest UI mode
npm run test:ui

# Playwright E2E tests
npm run test:e2e
```

---

## License

This project is licensed under the MIT License. See the LICENSE file for details.
