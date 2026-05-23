# Instagram Clone — Execution Plan

> Project Root: `D:\Download\instagram-clone`
> This file breaks down the entire build into ordered blocks & subblocks.

---

## BLOCK 0 — Project Scaffolding

### 0.1 Initialize Next.js + TypeScript

```bash
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
```

### 0.2 Install Core Dependencies

```bash
npm install prisma @prisma/client next-auth@beta @auth/prisma-adapter
npm install @tanstack/react-query zustand react-hook-form @hookform/resolvers zod
npm install cloudinary axios date-fns uuid
npm install socket.io socket.io-client
npm install lucide-react  # Icons
```

### 0.3 Install Dev Dependencies

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom @playwright/test
npm install -D prettier eslint-config-prettier
npm install -D @types/node @types/uuid
```

### 0.4 Configure Tailwind

- Set up `tailwind.config.ts` with custom Instagram color tokens
- Add dark mode class strategy
- Update `globals.css` with CSS variables

### 0.5 Set Up Project Structure

```
instagram-clone/
├── plan.md
├── execution.md              ← THIS FILE
├── .env.local
├── prisma/
│   └── schema.prisma
├── src/
│   ├── app/
│   ├── components/
│   ├── lib/
│   ├── hooks/
│   ├── store/
│   ├── providers/
│   └── types/
└── tests/
    ├── unit/
    ├── integration/
    └── e2e/
```

---

## BLOCK 1 — Database & Auth Foundation

### 1.1 Prisma Schema

- Write `prisma/schema.prisma` with all 14 models
- Run `npx prisma generate`
- Run `npx prisma db push`

### 1.2 Database Seed Script

- Create `prisma/seed.ts`
- Seed: 10 users, 30 posts, 100 comments, 200 likes, follow relationships
- Run `npx prisma db seed`

### 1.3 NextAuth Configuration

| File                                      | Purpose                                         |
| ----------------------------------------- | ----------------------------------------------- |
| `src/lib/auth.ts`                         | NextAuth config (providers, adapter, callbacks) |
| `src/app/api/auth/[...nextauth]/route.ts` | NextAuth catch-all route                        |
| `src/providers/SessionProvider.tsx`       | Client session wrapper                          |
| `src/app/layout.tsx`                      | Wrap with SessionProvider                       |

### 1.4 Auth Pages (Frontend)

| Page               | Components                          |
| ------------------ | ----------------------------------- |
| `/login`           | `LoginForm.tsx`, `OAuthButtons.tsx` |
| `/signup`          | `SignupForm.tsx`                    |
| `/forgot-password` | `ForgotPasswordForm.tsx`            |

### 1.5 Auth API (Backend)

| Route                         | Handler                                     |
| ----------------------------- | ------------------------------------------- |
| `POST /api/auth/register`     | Custom registration (if extending NextAuth) |
| `POST /api/auth/verify-email` | Email verification                          |

---

## BLOCK 2 — Shared UI Components

### 2.1 Design System Components (src/components/ui/)

| Component      | Features                                            |
| -------------- | --------------------------------------------------- |
| `Avatar.tsx`   | Image with fallback, sizes, story ring              |
| `Button.tsx`   | Variants (primary, secondary, ghost), loading state |
| `Input.tsx`    | Text, password, email, error state, label           |
| `Modal.tsx`    | Portal-based, backdrop, close on ESC                |
| `Spinner.tsx`  | Loading spinner, sizes                              |
| `Skeleton.tsx` | Loading placeholder shapes                          |
| `Toast.tsx`    | Success/error notifications                         |

### 2.2 Layout Components (src/components/layout/)

| Component              | Desktop                          | Mobile                  |
| ---------------------- | -------------------------------- | ----------------------- |
| `Sidebar.tsx`          | Fixed left, 244px, all nav links | Hidden                  |
| `BottomNav.tsx`        | Hidden                           | Fixed bottom, 5 icons   |
| `TopBar.tsx`           | Hidden                           | Fixed top, logo + icons |
| `SuggestionsPanel.tsx` | Right sidebar, 319px             | Hidden                  |
| `MobileHeader.tsx`     | Hidden                           | Stories + feed header   |

### 2.3 Providers Setup

| Provider | File                                |
| -------- | ----------------------------------- |
| Session  | `src/providers/SessionProvider.tsx` |
| Theme    | `src/providers/ThemeProvider.tsx`   |
| Query    | `src/providers/QueryProvider.tsx`   |
| Socket   | `src/providers/SocketProvider.tsx`  |

### 2.4 Globals & Theme

- `globals.css`: CSS variables, Tailwind layers, keyframe animations
- Dark mode toggle hook
- Theme persistence in localStorage

---

## BLOCK 3 — Core Feed (Frontend)

### 3.1 Feed Page (`/feed`)

| Subblock | What to Build                                                               |
| -------- | --------------------------------------------------------------------------- |
| 3.1.1    | `StoriesBar.tsx` — Horizontal scroll, story rings with gradient border      |
| 3.1.2    | `StoryRing.tsx` — Single story ring (avatar + gradient + username)          |
| 3.1.3    | `FeedPost.tsx` — Full post card (header, media, actions, caption, comments) |
| 3.1.4    | `FeedPostHeader.tsx` — Avatar + username + location + ellipsis menu         |
| 3.1.5    | `FeedPostActions.tsx` — Like, comment, share, save icons row                |
| 3.1.6    | `FeedPostCaption.tsx` — Username bold + caption text + hashtags + mentions  |
| 3.1.7    | `FeedPostComments.tsx` — Comment preview + "View all X comments" link       |
| 3.1.8    | `LikeButton.tsx` — Heart icon with animation, double-tap on media           |
| 3.1.9    | `CarouselViewer.tsx` — Swipeable carousel with dots indicator               |

### 3.2 Infinite Scroll

| Subblock | What to Build                                       |
| -------- | --------------------------------------------------- |
| 3.2.1    | `useInfiniteScroll.ts` — Intersection observer hook |
| 3.2.2    | React Query `useInfiniteQuery` for feed posts       |
| 3.2.3    | Cursor-based pagination in feed load                |

### 3.3 For You / Following Tabs

- Tab switcher at top of feed
- Different API query params per tab
- Animated tab indicator

---

## BLOCK 4 — Core Feed (Backend API)

### 4.1 Feed API

| Route            | Query Params                   | Response   |
| ---------------- | ------------------------------ | ---------- | ------------------------- |
| `GET /api/posts` | `cursor`, `limit`, `tab=foryou | following` | `{ posts[], nextCursor }` |

### 4.2 Post CRUD API

| Route             | Method | Purpose                                  |
| ----------------- | ------ | ---------------------------------------- |
| `/api/posts`      | POST   | Create post (media + caption + hashtags) |
| `/api/posts/[id]` | GET    | Get single post with comments            |
| `/api/posts/[id]` | PUT    | Update caption/location                  |
| `/api/posts/[id]` | DELETE | Soft delete post                         |

### 4.3 Like API

| Route                    | Method | Purpose     |
| ------------------------ | ------ | ----------- |
| `/api/posts/[id]/like`   | POST   | Like post   |
| `/api/posts/[id]/unlike` | DELETE | Unlike post |

### 4.4 Comment API

| Route                            | Method | Purpose               |
| -------------------------------- | ------ | --------------------- |
| `/api/posts/[id]/comments`       | GET    | Get comments (cursor) |
| `/api/posts/[id]/comments`       | POST   | Add comment           |
| `/api/posts/[id]/comments/[cid]` | DELETE | Delete comment        |

### 4.5 Save API

| Route                    | Method | Purpose         |
| ------------------------ | ------ | --------------- |
| `/api/posts/[id]/save`   | POST   | Save post       |
| `/api/posts/[id]/unsave` | DELETE | Unsave post     |
| `/api/posts/saved`       | GET    | Get saved posts |

### 4.6 Hashtag Extraction

- Parse `#hashtag` from caption on post create
- Upsert hashtag records
- Link via PostHashtag junction table

---

## BLOCK 5 — User Profiles & Follow System

### 5.1 Profile Page (Frontend) (`/profile/[username]`)

| Subblock | Component                                                                   |
| -------- | --------------------------------------------------------------------------- |
| 5.1.1    | `ProfileHeader.tsx` — Avatar, name, bio, website, follower/following counts |
| 5.1.2    | `FollowButton.tsx` — Follow/unfollow/pending states, animation              |
| 5.1.3    | `ProfileInfo.tsx` — Posts count, followers, following (clickable)           |
| 5.1.4    | `HighlightsBar.tsx` — Story highlight rings                                 |
| 5.1.5    | `ProfileTabs.tsx` — Posts / Reels / Saved / Tagged tabs                     |
| 5.1.6    | `ProfileGrid.tsx` — 3-column responsive grid with lazy load                 |

### 5.2 Edit Profile (Frontend) (`/settings/edit`)

| Subblock | Component                                                    |
| -------- | ------------------------------------------------------------ |
| 5.2.1    | `EditProfileForm.tsx` — Name, username, bio, website, gender |
| 5.2.2    | Avatar upload with crop + preview                            |

### 5.3 Followers/Following Modals

| Subblock | Feature                           |
| -------- | --------------------------------- |
| 5.3.1    | Clickable counts open modal       |
| 5.3.2    | Search within followers/following |
| 5.3.3    | Follow/unfollow from within modal |
| 5.3.4    | Mutual friends indicator          |

### 5.4 Profile API (Backend)

| Route                             | Method | Purpose                 |
| --------------------------------- | ------ | ----------------------- |
| `/api/users/[username]`           | GET    | Get profile with counts |
| `/api/users/me`                   | PUT    | Update own profile      |
| `/api/users/[id]/followers`       | GET    | Follower list (cursor)  |
| `/api/users/[id]/following`       | GET    | Following list (cursor) |
| `/api/users/[id]/follow`          | POST   | Follow user             |
| `/api/users/[id]/unfollow`        | DELETE | Unfollow user           |
| `/api/users/[id]/posts`           | GET    | User's posts (cursor)   |
| `/api/users/suggestions`          | GET    | Suggested users         |
| `/api/users/[id]/accept-request`  | POST   | Accept follow request   |
| `/api/users/[id]/decline-request` | DELETE | Decline follow request  |

---

## BLOCK 6 — Create Post Flow

### 6.1 Create Post Page (Frontend) (`/post/create`)

| Step | Component            | Function                                  |
| ---- | -------------------- | ----------------------------------------- |
| 1    | `MediaUploader.tsx`  | Drag & drop, file picker, multiple select |
| 2    | `MediaPreview.tsx`   | Crop, filter presets, aspect ratio        |
| 3    | `CarouselEditor.tsx` | Reorder images, remove from carousel      |
| 4    | `CaptionEditor.tsx`  | Textarea, hashtag suggestions, @mention   |
| 5    | `LocationPicker.tsx` | Search + select location                  |

### 6.2 Create Post API (Backend)

| Step | Action                                                |
| ---- | ----------------------------------------------------- |
| 1    | Upload media to Cloudinary (pre-signed URL or widget) |
| 2    | Create Post record with media URLs                    |
| 3    | Parse hashtags, upsert, link via PostHashtag          |
| 4    | Notify followers via Socket.io                        |

---

## BLOCK 7 — Stories

### 7.1 Stories UI (Frontend)

| Subblock | Component                                                             |
| -------- | --------------------------------------------------------------------- |
| 7.1.1    | `StoryViewer.tsx` — Full-screen overlay, tap navigation, progress bar |
| 7.1.2    | Story progress bar (auto-advance, pause on hover, tap sides)          |
| 7.1.3    | Emoji reaction bar at bottom                                          |
| 7.1.4    | Reply via DM button                                                   |
| 7.1.5    | Create story from camera or gallery                                   |
| 7.1.6    | `StoriesBar.tsx` — Top of feed, horizontal scroll                     |

### 7.2 Stories API (Backend)

| Route                    | Method | Purpose                                |
| ------------------------ | ------ | -------------------------------------- |
| `/api/stories`           | GET    | Get active stories from followed (24h) |
| `/api/stories`           | POST   | Create story                           |
| `/api/stories/[id]`      | DELETE | Delete story                           |
| `/api/stories/[id]/view` | POST   | Mark as viewed                         |

---

## BLOCK 8 — Reels

### 8.1 Reels UI (Frontend) (`/reels`)

| Subblock | Component                                                           |
| -------- | ------------------------------------------------------------------- |
| 8.1.1    | `ReelsFeed.tsx` — Full-screen vertical swipe (like TikTok)          |
| 8.1.2    | `ReelCard.tsx` — Video player, mute/unmute, pause                   |
| 8.1.3    | `ReelActions.tsx` — Like, comment, save, share (right side overlay) |
| 8.1.4    | Audio info bar at bottom                                            |
| 8.1.5    | Create reel from video upload                                       |

### 8.2 Reels API (Backend)

| Route                    | Method | Purpose                        |
| ------------------------ | ------ | ------------------------------ |
| `/api/reels`             | GET    | Reels feed (cursor, algorithm) |
| `/api/reels`             | POST   | Create reel                    |
| `/api/reels/[id]`        | GET    | Get reel detail                |
| `/api/reels/[id]`        | DELETE | Delete reel                    |
| `/api/reels/[id]/like`   | POST   | Like                           |
| `/api/reels/[id]/unlike` | DELETE | Unlike                         |

---

## BLOCK 9 — Explore & Search

### 9.1 Explore Page (Frontend) (`/explore`)

| Subblock | Component                                   |
| -------- | ------------------------------------------- |
| 9.1.1    | `ExploreGrid.tsx` — Masonry grid, paginated |
| 9.1.2    | Click post → opens PostModal                |
| 9.1.3    | `TrendingHashtags.tsx` — Sidebar list       |

### 9.2 Search (Frontend) (`/search`)

| Subblock | Component                                          |
| -------- | -------------------------------------------------- |
| 9.2.1    | `SearchBar.tsx` — Debounced input, recent searches |
| 9.2.2    | Results tabs: Users / Hashtags / All               |
| 9.2.3    | User result cards + follow button inline           |

### 9.3 Explore & Search API (Backend)

| Route                    | Method | Purpose                               |
| ------------------------ | ------ | ------------------------------------- |
| `/api/posts/explore`     | GET    | Explore posts (randomized, paginated) |
| `/api/search`            | GET    | Global search (q, type)               |
| `/api/hashtags/trending` | GET    | Trending hashtags                     |
| `/api/hashtags/[name]`   | GET    | Hashtag page with posts               |

---

## BLOCK 10 — Direct Messages

### 10.1 DM UI (Frontend) (`/messages`)

| Subblock | Component                                                            |
| -------- | -------------------------------------------------------------------- |
| 10.1.1   | `ConversationList.tsx` — Sidebar list with preview                   |
| 10.1.2   | `ConversationItem.tsx` — Avatar, name, last message, unread dot      |
| 10.1.3   | `ChatView.tsx` — Message list with date separators                   |
| 10.1.4   | `MessageBubble.tsx` — Sent (right, gradient) / Received (left, gray) |
| 10.1.5   | `MessageInput.tsx` — Text + emoji + image upload                     |
| 10.1.6   | `TypingIndicator.tsx` — "..." animated dots                          |
| 10.1.7   | Group chat creation modal                                            |

### 10.2 DM Socket.io Events (Backend)

| Event          | Direction       | Payload                                 |
| -------------- | --------------- | --------------------------------------- |
| `chat:send`    | Client → Server | `{ conversationId, text, mediaUrl }`    |
| `chat:message` | Server → Client | `{ message }`                           |
| `chat:typing`  | Bidirectional   | `{ conversationId, userId }`            |
| `chat:read`    | Client → Server | `{ conversationId, messageId }`         |
| `chat:seen`    | Server → Client | `{ conversationId, userId, messageId }` |

### 10.3 DM API (Backend)

| Route                                       | Method | Purpose               |
| ------------------------------------------- | ------ | --------------------- |
| `/api/messages/conversations`               | GET    | List conversations    |
| `/api/messages/conversations`               | POST   | Create conversation   |
| `/api/messages/conversations/[id]/messages` | GET    | Get messages (cursor) |
| `/api/messages/conversations/[id]/messages` | POST   | Send message          |
| `/api/messages/conversations/[id]/read`     | POST   | Mark read             |

---

## BLOCK 11 — Notifications

### 11.1 Notifications UI (Frontend)

| Subblock | Component                                                       |
| -------- | --------------------------------------------------------------- |
| 11.1.1   | `NotificationBell.tsx` — Header icon with red badge             |
| 11.1.2   | `NotificationList.tsx` — Infinite scroll list                   |
| 11.1.3   | `NotificationItem.tsx` — Icon + text + time ("liked your post") |

### 11.2 Notification Types

| Type             | Display Text                            |
| ---------------- | --------------------------------------- |
| `like`           | "{username} liked your post"            |
| `comment`        | "{username} commented: {preview}"       |
| `follow`         | "{username} started following you"      |
| `follow_request` | "{username} sent a follow request"      |
| `mention`        | "{username} mentioned you in a comment" |
| `reply`          | "{username} replied to your comment"    |

### 11.3 Notifications API (Backend)

| Route                             | Method | Purpose                    |
| --------------------------------- | ------ | -------------------------- |
| `/api/notifications`              | GET    | Get notifications (cursor) |
| `/api/notifications/unread-count` | GET    | Unread badge count         |
| `/api/notifications/read-all`     | POST   | Mark all read              |
| `/api/notifications/[id]/read`    | POST   | Mark single read           |

### 11.4 Real-time Push

- Socket.io event `notification:new` from server
- React Query invalidation on new notification

---

## BLOCK 12 — Settings Pages

### 12.1 Settings UI (Frontend) (`/settings`)

| Subblock | Component                  | Fields                                                                          |
| -------- | -------------------------- | ------------------------------------------------------------------------------- |
| 12.1.1   | `SettingsSidebar.tsx`      | Nav links for all setting categories                                            |
| 12.1.2   | `EditProfileForm.tsx`      | Name, username, bio, website, avatar, pronouns                                  |
| 12.1.3   | `PrivacySettings.tsx`      | Private account, activity status, story controls, tags, messages, blocked users |
| 12.1.4   | `SecuritySettings.tsx`     | Change password, 2FA toggle, login activity                                     |
| 12.1.5   | `NotificationSettings.tsx` | Per-type toggles (likes, comments, follows, DMs, reminders)                     |
| 12.1.6   | `AppearanceSettings.tsx`   | Light/Dark/System theme, language dropdown                                      |
| 12.1.7   | `CloseFriendsList.tsx`     | Add/remove from search                                                          |
| 12.1.8   | `BlockedUsersList.tsx`     | View blocked, unblock                                                           |
| 12.1.9   | `AccountActions.tsx`       | Deactivate, delete (with confirm modals)                                        |

### 12.2 Settings API (Backend)

| Route                               | Method | Purpose                    |
| ----------------------------------- | ------ | -------------------------- |
| `/api/settings/privacy`             | PUT    | Update privacy settings    |
| `/api/settings/notifications`       | PUT    | Update notification prefs  |
| `/api/settings/appearance`          | PUT    | Update theme/language      |
| `/api/settings/security/two-factor` | POST   | Enable 2FA                 |
| `/api/settings/security/two-factor` | DELETE | Disable 2FA                |
| `/api/settings/close-friends`       | GET    | Get close friends          |
| `/api/settings/close-friends`       | POST   | Add to close friends       |
| `/api/settings/close-friends/[id]`  | DELETE | Remove from close friends  |
| `/api/settings/blocked`             | GET    | Get blocked users          |
| `/api/settings/blocked`             | POST   | Block user                 |
| `/api/settings/blocked/[id]`        | DELETE | Unblock user               |
| `/api/settings/deactivate`          | POST   | Deactivate account         |
| `/api/settings/delete`              | DELETE | Delete account permanently |

---

## BLOCK 13 — Dark Mode & Responsive Polish

### 13.1 Dark Mode

- CSS class strategy on `<html>`
- Persist choice in localStorage
- All components check `dark:` variants
- Smooth transition between modes

### 13.2 Responsive Testing

| Device           | Verify                                |
| ---------------- | ------------------------------------- |
| Mobile (375px)   | Bottom nav, single column, compact    |
| Tablet (768px)   | Icon sidebar, medium feed             |
| Desktop (1024px) | Full sidebar + feed + suggestions     |
| Wide (1440px)    | Max 975px centered, wider suggestions |

### 13.3 Animations

| Element          | Animation                    |
| ---------------- | ---------------------------- |
| Like heart       | Scale bounce + color fill    |
| Follow button    | Smooth background transition |
| Story progress   | Linear timer bar             |
| Page transitions | Fade/slide                   |
| Modal open       | Scale + backdrop fade        |
| Skeleton loading | Shimmer pulse                |
| Double-tap like  | Heart pop-up at center       |

---

## BLOCK 14 — Testing

### 14.1 Unit Tests (Vitest)

| File                                         | Tests                       |
| -------------------------------------------- | --------------------------- |
| `tests/unit/hooks/useDebounce.test.ts`       | Debounce timing             |
| `tests/unit/hooks/useInfiniteScroll.test.ts` | Intersection callback       |
| `tests/unit/lib/utils.test.ts`               | Date formatting, truncation |
| `tests/unit/lib/validations.test.ts`         | Zod schema validation       |
| `tests/unit/store/authStore.test.ts`         | Auth state mutations        |

### 14.2 Integration Tests (Vitest + RTL)

| File                                        | Tests                             |
| ------------------------------------------- | --------------------------------- |
| `tests/integration/LoginForm.test.tsx`      | Submit valid/invalid, show errors |
| `tests/integration/SignupForm.test.tsx`     | Validation, submit                |
| `tests/integration/LikeButton.test.tsx`     | Toggle like, optimistic update    |
| `tests/integration/FollowButton.test.tsx`   | Follow/unfollow states            |
| `tests/integration/CommentSection.test.tsx` | Add, delete comment               |
| `tests/integration/PostCard.test.tsx`       | Render post, all actions          |
| `tests/integration/SearchBar.test.tsx`      | Debounced search, results         |

### 14.3 E2E Tests (Playwright)

| Test File                       | Flow                                 |
| ------------------------------- | ------------------------------------ |
| `tests/e2e/auth.spec.ts`        | Signup → verify → login → logout     |
| `tests/e2e/feed.spec.ts`        | Scroll feed → like → comment → save  |
| `tests/e2e/create-post.spec.ts` | Upload → caption → hashtags → submit |
| `tests/e2e/profile.spec.ts`     | View profile → follow → unfollow     |
| `tests/e2e/search.spec.ts`      | Search user → visit profile          |
| `tests/e2e/dm.spec.ts`          | Open conversation → send message     |
| `tests/e2e/stories.spec.ts`     | View story → react → swipe           |
| `tests/e2e/settings.spec.ts`    | Change theme → update privacy        |
| `tests/e2e/responsive.spec.ts`  | Resize to mobile → verify nav        |

### 14.4 Run Commands

```bash
npm run test          # Vitest unit + integration
npm run test:e2e      # Playwright
npm run test:ui       # Vitest UI mode
npx playwright show-report  # E2E report
```

---

## BLOCK 15 — Admin Panel

### 15.1 Admin UI (Frontend) (`/admin`)

| Subblock | Component                                      |
| -------- | ---------------------------------------------- |
| 15.1.1   | Dashboard cards (users, posts, reports counts) |
| 15.1.2   | User management table (search, ban, verify)    |
| 15.1.3   | Report queue (view reported content, resolve)  |

### 15.2 Admin API (Backend)

| Route                             | Method | Purpose                  |
| --------------------------------- | ------ | ------------------------ |
| `/api/admin/dashboard`            | GET    | Stats overview           |
| `/api/admin/users`                | GET    | List all users (filters) |
| `/api/admin/users/[id]/ban`       | POST   | Ban user                 |
| `/api/admin/users/[id]/unban`     | POST   | Unban user               |
| `/api/admin/users/[id]/verify`    | POST   | Toggle verified          |
| `/api/admin/reports`              | GET    | Reported content queue   |
| `/api/admin/reports/[id]/resolve` | POST   | Resolve report           |

---

## BLOCK 16 — Final Verification & Deployment

### 16.1 TypeScript Check

```bash
npx tsc --noEmit     # Zero type errors
```

### 16.2 Lint & Format

```bash
npm run lint          # ESLint passing
npx prettier --check . # Prettier passing
```

### 16.3 Build Test

```bash
npm run build         # Successful production build
```

### 16.4 Performance Audit

- Run Lighthouse in Chrome DevTools
- Target: ≥ 90 all categories

### 16.5 Security Scan

- Check for exposed `.env` variables
- Verify CSP headers
- Rate limiting active

### 16.6 Environment Variables (.env.local)

```env
DATABASE_URL="postgresql://..."
AUTH_SECRET="..."
AUTH_GOOGLE_ID="..."
AUTH_GITHUB_ID="..."
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="..."
CLOUDINARY_API_KEY="..."
CLOUDINARY_API_SECRET="..."
REDIS_URL="..."
NEXT_PUBLIC_SOCKET_URL="..."
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 16.7 Deploy

- **Frontend**: `vercel --prod`
- **Database**: Railway PostgreSQL
- **Redis**: Upstash
- **Media**: Cloudinary
- **Socket server**: Railway

---

## Execution Progress Tracker

Copy this and mark `[x]` as you complete each block:

```
[ ] BLOCK 0  — Project Scaffolding
[ ] BLOCK 1  — Database & Auth Foundation
[ ] BLOCK 2  — Shared UI Components
[ ] BLOCK 3  — Core Feed (Frontend)
[ ] BLOCK 4  — Core Feed (Backend API)
[ ] BLOCK 5  — User Profiles & Follow System
[ ] BLOCK 6  — Create Post Flow
[ ] BLOCK 7  — Stories
[ ] BLOCK 8  — Reels
[ ] BLOCK 9  — Explore & Search
[ ] BLOCK 10 — Direct Messages
[ ] BLOCK 11 — Notifications
[ ] BLOCK 12 — Settings Pages
[ ] BLOCK 13 — Dark Mode & Responsive Polish
[ ] BLOCK 14 — Testing
[ ] BLOCK 15 — Admin Panel
[ ] BLOCK 16 — Final Verification & Deployment
```
