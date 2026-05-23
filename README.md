<div align="center">
  <br/>
  <img src="https://img.shields.io/badge/Next.js-16.2.6-black?style=flat-square&logo=next.js" alt="Next.js"/>
  <img src="https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?style=flat-square&logo=tailwindcss" alt="Tailwind CSS"/>
  <img src="https://img.shields.io/badge/Prisma-6.19.3-2d3748?style=flat-square&logo=prisma" alt="Prisma"/>
  <img src="https://img.shields.io/badge/Vitest-4.1.7-6b9a36?style=flat-square&logo=vitest" alt="Vitest"/>
  <img src="https://img.shields.io/badge/Playwright-latest-45ba4b?style=flat-square&logo=playwright" alt="Playwright"/>
  <br/><br/>
  <h1 align="center">📸 Insta Clone</h1>
  <p align="center">
    A full-featured Instagram web app clone built with Next.js 16, TypeScript, and Prisma PostgreSQL
  </p>
  <br/>
</div>

## ✨ Features

- **📱 Feed** — Infinite scroll, For You / Following tabs, double-tap like, carousel posts, hashtag highlighting
- **📖 Stories** — Full-screen viewer with progress bars, auto-advance, emoji reactions, create story overlay
- **🎬 Reels** — Vertical swipe feed with snap scrolling, play/pause, mute/unmute, like/comment/share
- **💬 Messages** — Real-time chat with typing indicators, emoji picker, read receipts, media sharing
- **🔔 Notifications** — Like, comment, follow, mention, reply notifications with per-type icons
- **🔍 Search** — Debounced search with All / Users / Hashtags tabs, recent searches, follow inline
- **🧭 Explore** — Masonry grid with hover overlay stats, infinite scroll, post detail modal
- **👤 Profiles** — Photo grid, follower/following modals, follow button (3 states), edit profile
- **➕ Create Post** — 5-step wizard: media upload, carousel editor, caption, hashtags, location
- **⚙️ Settings** — 8 pages: edit profile, privacy, security, appearance (dark mode), notifications, close friends, blocked, account
- **🛡️ Admin Panel** — Dashboard stats, user management (ban/unban/verify), report queue
- **🌙 Dark Mode** — Full theme support with CSS variables + class strategy
- **📱 Responsive** — Mobile bottom nav, tablet icon sidebar, desktop full sidebar

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 16.2.6 (App Router, Turbopack) |
| **Language** | TypeScript 5 (strict mode) |
| **Styling** | Tailwind CSS v4 + CSS variables |
| **Database** | PostgreSQL + Prisma 6.19.3 ORM |
| **Auth** | NextAuth v5 (Google, GitHub, Credentials, JWT) |
| **State** | Zustand (client state) + TanStack React Query (server state) |
| **Testing** | Vitest 4 + React Testing Library + Playwright |
| **Real-time** | Socket.io (typing, notifications) |
| **Icons** | Lucide React |

## 🚀 Getting Started

```bash
git clone https://github.com/nrkavya5-lab/insta-clone.git
cd insta-clone
npm install
```

### Environment Variables

```env
DATABASE_URL="postgresql://user:password@localhost:5432/instaclone"

AUTH_SECRET="generate-with-openssl-rand-hex-32"
AUTH_GOOGLE_ID=""
AUTH_GOOGLE_SECRET=""
AUTH_GITHUB_ID=""
AUTH_GITHUB_SECRET=""
```

### Run

```bash
# Start dev server (runs on port 3000)
npm run dev

# Build for production
npm run build

# Run tests
npm test           # unit + integration
npm run test:e2e   # Playwright E2E
```

## 📁 Project Structure

```
src/
├── app/
│   ├── (auth)/          # Login, signup, forgot password
│   ├── (main)/          # Feed, explore, messages, notifications, profile, search, settings
│   ├── (reels)/         # Reels feed
│   ├── (admin)/         # Admin panel
│   └── api/             # 43 API route handlers
├── components/
│   ├── auth/            # LoginForm, SignupForm, OAuthButtons
│   ├── create/          # MediaUploader, CaptionEditor, LocationPicker
│   ├── feed/            # FeedPost, StoriesBar, CarouselViewer, LikeButton
│   ├── layout/          # Sidebar, TopBar, BottomNav, SuggestionsPanel
│   ├── messages/        # ChatView, MessageBubble, MessageInput, ConversationList
│   ├── notifications/   # NotificationItem, NotificationList, NotificationBell
│   ├── profile/         # ProfileHeader, ProfileGrid, FollowButton, FollowersModal
│   ├── reels/           # ReelCard, ReelActions
│   ├── settings/        # EditProfileForm, SettingsSidebar, AvatarUpload
│   ├── stories/         # StoryViewer, CreateStory
│   └── ui/              # Button, Modal, Input, Avatar, Skeleton, Toast, Spinner
├── hooks/               # useFeed, useInfiniteScroll, useDebounce, useTheme
├── lib/                 # auth, prisma, api-client, validations, utils, constants
├── providers/           # Session, Theme, Query, Socket
└── store/               # themeStore (Zustand)
```

## 🧪 Testing

- **71 tests** — 32 unit tests + 39 integration tests across 12 test files
- **4 E2E suites** — Auth, Feed, Responsive, Settings with Playwright

```bash
npm test              # Run all unit + integration tests
npm run test:e2e      # Run Playwright E2E tests  
npm run test:ui       # Vitest UI mode
```

## 📊 Build Stats

- **53 routes** — 10 static pages + 43 dynamic API endpoints
- **21 Prisma models** — User, Post, Story, Message, Follow, Notification, Hashtag, etc.
- **60+ components** — Reusable UI, feature-specific, and layout components
- **Zero TypeScript errors** — `npx tsc --noEmit` passes clean

## 🌐 API Overview

All API routes accept `?__dev=1` to return mock data without authentication or database.

| Endpoint | Description |
|----------|-------------|
| `GET /api/posts` | Feed posts (cursor pagination) |
| `POST /api/posts` | Create post (with hashtag upsert) |
| `GET /api/posts/explore` | Explore grid |
| `GET /api/stories` | Active stories for feed |
| `GET /api/reels` | Reels feed |
| `GET /api/messages/conversations` | User conversations |
| `GET /api/notifications` | Notification list |
| `GET /api/search` | Search users + hashtags |
| `GET /api/admin/dashboard` | Admin stats |
| ... and 33 more | Full REST API |

## 📄 License

MIT
