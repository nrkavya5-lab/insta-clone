# Instagram Web App Clone — Complete Plan

## 1. Agent & Model Selection

| Item         | Selection                                               |
| ------------ | ------------------------------------------------------- |
| **Agent**    | General-purpose agent (autonomous multi-step execution) |
| **Model**    | DeepSeek V4 Flash Free                                  |
| **Language** | TypeScript (full-stack)                                 |

**Why TypeScript end-to-end:**

- Shared types between frontend and backend
- Largest ecosystem for social media apps (Next.js, Prisma, Socket.io)
- Strict type safety reduces runtime bugs
- Industry standard for production web apps in 2026

---

## 2. Tech Stack

| Layer          | Technology                                  | Rationale                                                                       |
| -------------- | ------------------------------------------- | ------------------------------------------------------------------------------- |
| **Framework**  | Next.js 15 (App Router)                     | SSR, API routes, image optimization, file-based routing, server components, RSC |
| **Styling**    | Tailwind CSS v4                             | Utility-first, responsive breakpoints, dark mode, small bundle, JIT compiler    |
| **State Mgmt** | Zustand + TanStack React Query              | Lightweight client state + server state caching with infinite scroll support    |
| **Database**   | PostgreSQL + Prisma ORM                     | Relational integrity, type-safe queries, auto-generated migrations, great DX    |
| **Cache**      | Redis (Upstash)                             | Feed caching, session store, rate limiting, pub/sub for real-time               |
| **Media**      | Cloudinary                                  | Image/video optimization, CDN, transformations, upload widgets                  |
| **Auth**       | NextAuth.js v5                              | OAuth (Google/GitHub), credentials, JWT sessions, database adapter              |
| **Real-time**  | Socket.io                                   | WebSocket-based DMs, notifications, live likes count                            |
| **Forms**      | React Hook Form + Zod                       | Performant forms with schema validation                                         |
| **Testing**    | Vitest + React Testing Library + Playwright | Unit, integration, E2E                                                          |
| **Linting**    | ESLint + Prettier                           | Code quality and consistency                                                    |
| **Deploy**     | Vercel (frontend) + Railway (backend/db)    | Zero-config deployment, global CDN                                              |

---

## 3. Instagram Color Palette

### Brand Gradient (Primary Identity)

```
linear-gradient(45deg, #405DE6, #5851DB, #833AB4, #C13584, #E1306C, #FD1D1D)
```

### Token System

```css
:root {
  /* Brand colors */
  --ig-blue: #405de6;
  --ig-purple: #833ab4;
  --ig-pink: #e1306c;
  --ig-orange: #f56040;
  --ig-yellow: #fcaf45;
  --ig-red: #fd1d1d;

  /* UI colors */
  --ig-bg-primary: #ffffff;
  --ig-bg-secondary: #fafafa;
  --ig-bg-tertiary: #f5f5f5;
  --ig-text-primary: #262626;
  --ig-text-secondary: #8e8e8e;
  --ig-text-link: #00376b;
  --ig-border: #dbdbdb;
  --ig-border-focus: #a8a8a8;
  --ig-overlay: rgba(0, 0, 0, 0.65);

  /* Story ring */
  --ig-story-gradient: linear-gradient(45deg, #fcaf45, #e1306c, #833ab4);

  /* Like animation */
  --ig-like-red: #ed4956;

  /* Success / Error */
  --ig-success: #00c853;
  --ig-error: #ed4956;
}
```

### Dark Mode Tokens

```css
.dark {
  --ig-bg-primary: #000000;
  --ig-bg-secondary: #121212;
  --ig-bg-tertiary: #1e1e1e;
  --ig-text-primary: #fafafa;
  --ig-text-secondary: #a8a8a8;
  --ig-border: #363636;
}
```

---

## 4. Complete Feature List

### Phase 1 — Core (MVP)

#### Authentication & User Management

| Feature          | Details                                                   |
| ---------------- | --------------------------------------------------------- |
| Sign Up          | Email + password, username validation, email verification |
| Login            | Email/password, "Remember me", JWT refresh tokens         |
| OAuth            | Google login, GitHub login                                |
| Forgot Password  | Email reset link, token expiry                            |
| Logout           | Session invalidation, cookie cleanup                      |
| Profile Creation | Avatar upload, bio, name, website, gender                 |
| Edit Profile     | Change username, name, bio, avatar, website               |
| Change Password  | Current password verification, strength meter             |

#### Feed & Posts

| Feature       | Details                                                |
| ------------- | ------------------------------------------------------ |
| Home Feed     | Infinite scroll, For You / Following tabs              |
| Create Post   | Upload image/video, crop, caption, hashtags, @mentions |
| Carousel      | Up to 10 images/videos, reorder after upload           |
| Like          | Heart animation, double-tap to like, unlike            |
| Comments      | Write, delete, view thread, nested replies             |
| Save/Bookmark | Saved posts collection                                 |
| Share         | Copy link, share to DM, external share                 |
| Report        | Reason selection, flag for moderation                  |
| Delete Post   | Soft delete, 30-day recovery                           |

#### Follow System

| Feature           | Details                              |
| ----------------- | ------------------------------------ |
| Follow / Unfollow | Button toggle with animation         |
| Followers List    | Searchable, mutual friends indicator |
| Following List    | Searchable, unfollow from list       |
| Follow Requests   | Accept / decline (private accounts)  |
| Suggested Users   | Based on mutual follows              |

#### User Profiles

| Feature         | Details                                                   |
| --------------- | --------------------------------------------------------- |
| Profile Grid    | 3-column photo grid, pagination                           |
| Profile Header  | Avatar, name, bio, follower/following counts, edit button |
| Highlights      | Story collections displayed below bio                     |
| Posts Count     | Auto-updating counter                                     |
| Private Account | Lock icon, follow-to-view gate                            |

### Phase 2 — Engagement & Discovery

#### Stories

| Feature         | Details                                          |
| --------------- | ------------------------------------------------ |
| Story Rings     | At top of feed, sorted by recent                 |
| View Story      | Full-screen, tap sides to navigate, progress bar |
| Create Story    | Photo/video capture, text overlay, stickers      |
| Story Reactions | Emoji reactions, reply via DM                    |
| 24h Expiry      | Auto-delete, visible in archive                  |
| Highlights      | Permanent collection, add to profile             |

#### Reels

| Feature          | Details                         |
| ---------------- | ------------------------------- |
| Full-screen Feed | Vertical swipe, infinite scroll |
| Like / Comment   | Same as posts                   |
| Save / Share     | Bookmark and share to DM        |
| Audio Info       | Display audio track name        |
| Create Reel      | Upload video, trim              |

#### Search & Explore

| Feature           | Details                                |
| ----------------- | -------------------------------------- |
| Global Search     | Users, hashtags, locations (debounced) |
| Explore Grid      | Masonry layout, paginated              |
| Trending Hashtags | Sorted by post count                   |
| Search History    | Recent searches (localStorage)         |

#### Notifications

| Feature           | Details                                        |
| ----------------- | ---------------------------------------------- |
| Notification Bell | Badge count, dropdown list                     |
| Types             | Like, comment, follow, follow request, mention |
| Real-time         | Socket.io push for new notifications           |
| Mark Read         | Single and mark-all-as-read                    |

### Phase 3 — Communication

#### Direct Messages

| Feature           | Details                                      |
| ----------------- | -------------------------------------------- |
| Inbox List        | Recent conversations, unread indicator       |
| Chat View         | Bubbles, sent/receipt indicators, timestamps |
| Send Media        | Image upload in chat                         |
| Typing Indicators | Real-time via Socket.io                      |
| Read Receipts     | Seen at timestamp                            |
| Group Chats       | Add participants, group name                 |
| Message Requests  | From non-followers, accept/decline/block     |
| Delete Message    | Remove for self                              |
| Voice Notes       | Record and send (future)                     |

### Phase 4 — Settings & Account Management

| Category           | Settings                                                                                                            |
| ------------------ | ------------------------------------------------------------------------------------------------------------------- |
| **Edit Profile**   | Name, username, bio, avatar, website, pronouns                                                                      |
| **Password**       | Change password, remember password                                                                                  |
| **Privacy**        | Private account, activity status, story sharing, comment controls, tag controls, message controls, blocked accounts |
| **Security**       | Two-factor authentication (app/SMS), login activity, saved login info, passwordless login                           |
| **Notifications**  | Per-type toggles (likes, comments, follows, DMs, reminders)                                                         |
| **Appearance**     | Light / Dark / System theme, font size                                                                              |
| **Saved**          | All saved posts collection                                                                                          |
| **Archive**        | Archived posts and stories                                                                                          |
| **Close Friends**  | Manage close friends list                                                                                           |
| **Language**       | Multi-language support                                                                                              |
| **Account**        | Deactivate temporarily, delete permanently                                                                          |
| **Data**           | Download your information                                                                                           |
| **Login Activity** | Device list, logout from remote                                                                                     |
| **Supervision**    | Family center (future)                                                                                              |

### Phase 5 — Admin Panel (Future)

| Feature            | Details                                  |
| ------------------ | ---------------------------------------- |
| Dashboard          | User count, post count, engagement stats |
| User Management    | Ban, verify, suspend accounts            |
| Content Moderation | Reported posts queue, take down          |
| Analytics          | Growth trends, top hashtags              |

---

## 5. UI / Layout Design (Responsive)

### Desktop Layout (≥ 1024px)

```
┌──────────────┬──────────────────────────────────────┬──────────────┐
│  SIDEBAR     │          MAIN CONTENT                │  SUGGESTIONS │
│  (244px)     │          (630px)                     │  (319px)     │
│              │                                      │              │
│  ◉ Logo      │  ┌────────────────────────────────┐  │  Your Story  │
│              │  │  Stories (horizontal scroll)    │  │  ┌──┐ ┌──┐  │
│  🏠 Home     │  └────────────────────────────────┘  │  │  │ │  │  │
│  🔍 Search   │  ┌────────────────────────────────┐  │  └──┘ └──┘  │
│  📺 Explore  │  │  Post 1 (image + caption)       │  │              │
│  🎬 Reels    │  │  ❤️ 💬 🔖  Likes: 1,234        │  │  Suggestions │
│  ✉️ Messages │  │  Comments: "Great shot!"        │  │  for you     │
│  🔔 Notifs   │  └────────────────────────────────┘  │  ┌────────┐  │
│  ➕ Create   │  ┌────────────────────────────────┐  │  │ User │  │
│  👤 Profile  │  │  Post 2 (carousel)              │  │  │ Follow │  │
│              │  │  ◄ 1/5 ►                        │  │  └────────┘  │
│  ⋮ More      │  └────────────────────────────────┘  │  ┌────────┐  │
│              │                                      │  │ User │  │
│              │                                      │  │ Follow │  │
│              │                                      │  └────────┘  │
└──────────────┴──────────────────────────────────────┴──────────────┘
```

### Tablet Layout (768–1023px)

```
┌───┬──────────────────────────────────────────────┐
│   │                                              │
│ I │  ┌────────────────────────────────────────┐  │
│ C │  │  Stories                               │  │
│ O │  └────────────────────────────────────────┘  │
│ N │                                              │
│   │  ┌────────────────────────────────────────┐  │
│   │  │  Post 1                                │  │
│ S │  │  ❤️ 💬 🔖  Likes: 1,234              │  │
│ I │  └────────────────────────────────────────┘  │
│ D │                                              │
│ E │  ┌────────────────────────────────────────┐  │
│   │  │  Post 2                                │  │
│ B │  └────────────────────────────────────────┘  │
│ A │                                              │
│ R │                    ...                       │
│   │                                              │
└───┴──────────────────────────────────────────────┘
```

### Mobile Layout (< 768px)

```
┌─────────────────────────────────────┐
│  ← Instagram  ♡  ✉️               │  ← Top bar
├─────────────────────────────────────┤
│ ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐│  ← Stories
│ │S1│ │S2│ │S3│ │S4│ │S5│ │S6│ │S7││
│ └──┘ └──┘ └──┘ └──┘ └──┘ └──┘ └──┘│
├─────────────────────────────────────┤
│ ┌─────────────────────────────┐     │
│ │  Post image (full width)    │     │
│ │  ❤️ 💬 🔖                 │     │
│ │  Liked by user1 and 234     │     │
│ │  others                     │     │
│ │  caption_text #hashtag      │     │
│ │  View all 12 comments       │     │
│ └─────────────────────────────┘     │
│                                     │
│ ┌─────────────────────────────┐     │
│ │  Next post...               │     │
│ └─────────────────────────────┘     │
├─────────────────────────────────────┤
│  🏠  🔍  ➕  🎬  👤              │  ← Bottom nav
└─────────────────────────────────────┘
```

### Breakpoint Strategy

| Breakpoint | Width       | Layout                                         |
| ---------- | ----------- | ---------------------------------------------- |
| Mobile S   | < 480px     | Single column, compact spacing, bottom nav     |
| Mobile L   | 480–767px   | Single column, standard spacing, bottom nav    |
| Tablet     | 768–1023px  | Icon sidebar + single column feed              |
| Desktop    | 1024–1279px | Full sidebar + feed + suggestions panel        |
| Wide       | ≥ 1280px    | Max 975px centered feed with wider suggestions |

### Login Page Design

```
┌──────────────────────────────────────┐
│                                      │
│          ◉ Instagram Logo            │
│                                      │
│  ┌──────────────────────────────┐    │
│  │ 📧 Email or username          │    │
│  └──────────────────────────────┘    │
│                                      │
│  ┌──────────────────────────────┐    │
│  │ 🔒 Password                   │    │
│  └──────────────────────────────┘    │
│                                      │
│  ┌──────────────────────────────┐    │
│  │       Log In                │    │ ← ig-blue bg, white text
│  └──────────────────────────────┘    │
│                                      │
│  ────────────── OR ───────────────   │
│                                      │
│  ┌──────────────────────────────┐    │
│  │  Continue with Google        │    │ ← White bg, google icon
│  └──────────────────────────────┘    │
│                                      │
│  Forgot password?                    │
│                                      │
│  ──────────────────────────────────  │
│  Don't have an account?  Sign Up     │
│                                      │
│        Get the app.                  │
│     [App Store] [Google Play]        │
│                                      │
└──────────────────────────────────────┘
```

---

## 6. Database Schema (Prisma)

```prisma
// ─── User ───
model User {
  id              String   @id @default(cuid())
  username        String   @unique
  email           String   @unique
  passwordHash    String?
  name            String?
  bio             String?
  avatarUrl       String?
  website         String?
  phone           String?
  gender          String?
  isPrivate       Boolean  @default(false)
  isVerified      Boolean  @default(false)
  isCreator       Boolean  @default(false)
  allowTagging    Boolean  @default(true)
  activityStatus  Boolean  @default(true)
  theme           String   @default("system") // light | dark | system
  language        String   @default("en")
  twoFactorEnabled Boolean @default(false)
  twoFactorSecret String?

  posts           Post[]
  stories         Story[]
  comments        Comment[]
  likes           Like[]
  savedPosts      SavedPost[]
  followers       Follow[]  @relation("following")
  following       Follow[]  @relation("follower")
  sentMessages    Message[] @relation("sender")
  conversations   ConversationParticipant[]
  notifications   Notification[]
  blockedUsers    Block[]   @relation("blocker")
  blockedBy       Block[]   @relation("blocked")
  closeFriends    CloseFriend[] @relation("user")
  addedByClose    CloseFriend[] @relation("closeFriend")

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

// ─── Follow ───
model Follow {
  id          String  @id @default(cuid())
  followerId  String
  followingId String
  status      String  @default("active") // active | pending | blocked
  follower    User    @relation("follower", fields: [followerId], references: [id])
  following   User    @relation("following", fields: [followingId], references: [id])
  createdAt   DateTime @default(now())

  @@unique([followerId, followingId])
  @@index([followingId])
}

// ─── Post ───
model Post {
  id         String   @id @default(cuid())
  userId     String
  caption    String?
  mediaUrls  String[]
  mediaType  String   // photo | video | carousel
  location   String?
  likeCount  Int      @default(0)
  commentCount Int    @default(0)
  isArchived Boolean  @default(false)
  isDeleted  Boolean  @default(false)
  deletedAt  DateTime?

  user       User     @relation(fields: [userId], references: [id])
  comments   Comment[]
  likes      Like[]
  savedBy    SavedPost[]
  hashtags   PostHashtag[]
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  @@index([userId, createdAt])
  @@index([createdAt])
}

// ─── Story ───
model Story {
  id        String   @id @default(cuid())
  userId    String
  mediaUrl  String
  mediaType String   // photo | video
  caption   String?
  expiresAt DateTime
  user      User     @relation(fields: [userId], references: [id])
  createdAt DateTime @default(now())

  @@index([userId])
  @@index([expiresAt])
}

// ─── Comment ───
model Comment {
  id              String    @id @default(cuid())
  postId          String
  userId          String
  text            String
  parentCommentId String?
  post            Post      @relation(fields: [postId], references: [id])
  user            User      @relation(fields: [userId], references: [id])
  parentComment   Comment?  @relation("CommentReplies", fields: [parentCommentId], references: [id])
  replies         Comment[] @relation("CommentReplies")
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  @@index([postId, createdAt])
}

// ─── Like ───
model Like {
  id      String @id @default(cuid())
  postId  String
  userId  String
  post    Post   @relation(fields: [postId], references: [id])
  user    User   @relation(fields: [userId], references: [id])
  createdAt DateTime @default(now())

  @@unique([postId, userId])
}

// ─── Saved Post ───
model SavedPost {
  id      String @id @default(cuid())
  userId  String
  postId  String
  user    User   @relation(fields: [userId], references: [id])
  post    Post   @relation(fields: [postId], references: [id])
  createdAt DateTime @default(now())

  @@unique([userId, postId])
}

// ─── Conversation ───
model Conversation {
  id        String   @id @default(cuid())
  isGroup   Boolean  @default(false)
  name      String?
  imageUrl  String?
  messages  Message[]
  participants ConversationParticipant[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

// ─── Conversation Participant ───
model ConversationParticipant {
  id             String       @id @default(cuid())
  conversationId String
  userId         String
  lastReadAt     DateTime?
  conversation   Conversation @relation(fields: [conversationId], references: [id])
  user           User         @relation(fields: [userId], references: [id])
  joinedAt       DateTime     @default(now())

  @@unique([conversationId, userId])
}

// ─── Message ───
model Message {
  id             String       @id @default(cuid())
  conversationId String
  senderId       String
  text           String?
  mediaUrl       String?
  mediaType      String?
  isRead         Boolean      @default(false)
  readAt         DateTime?
  isDeleted      Boolean      @default(false)
  conversation   Conversation @relation(fields: [conversationId], references: [id])
  sender         User         @relation("sender", fields: [senderId], references: [id])
  createdAt      DateTime     @default(now())

  @@index([conversationId, createdAt])
}

// ─── Notification ───
model Notification {
  id        String   @id @default(cuid())
  userId    String
  type      String   // like | comment | follow | follow_request | mention | reply
  actorId   String
  postId    String?
  commentId String?
  isRead    Boolean  @default(false)
  user      User     @relation(fields: [userId], references: [id])
  createdAt DateTime @default(now())

  @@index([userId, createdAt])
}

// ─── Hashtag ───
model Hashtag {
  id        String        @id @default(cuid())
  name      String        @unique
  postCount Int           @default(0)
  posts     PostHashtag[]
  createdAt DateTime      @default(now())
}

// ─── PostHashtag (junction) ───
model PostHashtag {
  postId    String
  hashtagId String
  post      Post    @relation(fields: [postId], references: [id])
  hashtag   Hashtag @relation(fields: [hashtagId], references: [id])

  @@id([postId, hashtagId])
}

// ─── Block ───
model Block {
  id        String @id @default(cuid())
  blockerId String
  blockedId String
  blocker   User   @relation("blocker", fields: [blockerId], references: [id])
  blocked   User   @relation("blocked", fields: [blockedId], references: [id])
  createdAt DateTime @default(now())

  @@unique([blockerId, blockedId])
}

// ─── Close Friend ───
model CloseFriend {
  id           String @id @default(cuid())
  userId       String
  closeFriendId String
  user         User   @relation("user", fields: [userId], references: [id])
  closeFriend  User   @relation("closeFriend", fields: [closeFriendId], references: [id])
  createdAt    DateTime @default(now())

  @@unique([userId, closeFriendId])
}

// ─── Account (for NextAuth) ───
model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?
  user              User    @relation(fields: [userId], references: [id])

  @@unique([provider, providerAccountId])
}

// ─── Session (for NextAuth) ───
model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id])
}

// ─── VerificationToken (for NextAuth) ───
model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
}
```

---

## 7. API Routes Design

### Auth (`/api/auth/*` — NextAuth.js handles these)

| Route           | Method | Description                                             |
| --------------- | ------ | ------------------------------------------------------- |
| `[...nextauth]` | \*     | NextAuth catch-all (signin, signout, callback, session) |
| `register`      | POST   | Custom registration endpoint (if extending NextAuth)    |
| `verify-email`  | POST   | Verify email with token                                 |

### Users (`/api/users`)

| Route                   | Method | Description                                 |
| ----------------------- | ------ | ------------------------------------------- |
| `/`                     | GET    | List/search users (query: q, limit, cursor) |
| `/[username]`           | GET    | Get user profile                            |
| `/me`                   | GET    | Get current user                            |
| `/me`                   | PUT    | Update current user profile                 |
| `/me/avatar`            | POST   | Upload avatar                               |
| `/me/password`          | PUT    | Change password                             |
| `/[id]/followers`       | GET    | Get followers list (cursor pagination)      |
| `/[id]/following`       | GET    | Get following list (cursor pagination)      |
| `/[id]/follow`          | POST   | Follow a user                               |
| `/[id]/unfollow`        | DELETE | Unfollow a user                             |
| `/[id]/accept-request`  | POST   | Accept follow request                       |
| `/[id]/decline-request` | DELETE | Decline follow request                      |
| `/[id]/posts`           | GET    | Get user's posts (cursor pagination)        |
| `/suggestions`          | GET    | Get suggested users to follow               |

### Posts (`/api/posts`)

| Route                  | Method | Description                             |
| ---------------------- | ------ | --------------------------------------- |
| `/`                    | GET    | Get feed (following + for-you timeline) |
| `/`                    | POST   | Create a post                           |
| `/explore`             | GET    | Explore posts (cursor pagination)       |
| `/[id]`                | GET    | Get post detail                         |
| `/[id]`                | PUT    | Update post (caption, location)         |
| `/[id]`                | DELETE | Delete post                             |
| `/[id]/like`           | POST   | Like a post                             |
| `/[id]/unlike`         | DELETE | Unlike a post                           |
| `/[id]/comments`       | GET    | Get post comments (cursor)              |
| `/[id]/comments`       | POST   | Add comment                             |
| `/[id]/comments/[cid]` | DELETE | Delete comment                          |
| `/[id]/save`           | POST   | Save post                               |
| `/[id]/unsave`         | DELETE | Unsave post                             |
| `/saved`               | GET    | Get saved posts                         |
| `/archive`             | GET    | Get archived posts                      |
| `/[id]/archive`        | POST   | Archive/unarchive a post                |

### Stories (`/api/stories`)

| Route              | Method | Description                            |
| ------------------ | ------ | -------------------------------------- |
| `/`                | GET    | Get active stories from followed users |
| `/`                | POST   | Create a story                         |
| `/[id]`            | GET    | Get story detail                       |
| `/[id]`            | DELETE | Delete story                           |
| `/[id]/view`       | POST   | Mark story as viewed                   |
| `/highlights`      | GET    | Get user's highlights                  |
| `/highlights`      | POST   | Create highlight collection            |
| `/highlights/[id]` | PUT    | Update highlight                       |

### Reels (`/api/reels`)

| Route          | Method | Description                        |
| -------------- | ------ | ---------------------------------- |
| `/`            | GET    | Get reels feed (cursor pagination) |
| `/`            | POST   | Create a reel                      |
| `/[id]`        | GET    | Get reel detail                    |
| `/[id]`        | DELETE | Delete reel                        |
| `/[id]/like`   | POST   | Like                               |
| `/[id]/unlike` | DELETE | Unlike                             |

### Messages (`/api/messages`)

| Route                          | Method | Description              |
| ------------------------------ | ------ | ------------------------ |
| `/conversations`               | GET    | Get user's conversations |
| `/conversations`               | POST   | Create conversation      |
| `/conversations/[id]`          | GET    | Get conversation detail  |
| `/conversations/[id]`          | DELETE | Leave conversation       |
| `/conversations/[id]/messages` | GET    | Get messages (cursor)    |
| `/conversations/[id]/messages` | POST   | Send message             |
| `/conversations/[id]/read`     | POST   | Mark as read             |
| `/requests`                    | GET    | Get message requests     |

### Notifications (`/api/notifications`)

| Route           | Method | Description                |
| --------------- | ------ | -------------------------- |
| `/`             | GET    | Get notifications (cursor) |
| `/unread-count` | GET    | Get unread count           |
| `/read-all`     | POST   | Mark all as read           |
| `/[id]/read`    | POST   | Mark single as read        |

### Hashtags (`/api/hashtags`)

| Route       | Method | Description                 |
| ----------- | ------ | --------------------------- |
| `/search`   | GET    | Search hashtags (query: q)  |
| `/[name]`   | GET    | Get hashtag page with posts |
| `/trending` | GET    | Get trending hashtags       |

### Search (`/api/search`)

| Route | Method | Description                 |
| ----- | ------ | --------------------------- | ------- | ---- |
| `/`   | GET    | Global search (q, type=user | hashtag | all) |

### Settings (`/api/settings`)

| Route                  | Method | Description                     |
| ---------------------- | ------ | ------------------------------- |
| `/privacy`             | PUT    | Update privacy settings         |
| `/notifications`       | PUT    | Update notification preferences |
| `/appearance`          | PUT    | Update theme/language           |
| `/security/two-factor` | POST   | Enable 2FA                      |
| `/security/two-factor` | DELETE | Disable 2FA                     |
| `/close-friends`       | GET    | Get close friends list          |
| `/close-friends`       | POST   | Add to close friends            |
| `/close-friends/[id]`  | DELETE | Remove from close friends       |
| `/blocked`             | GET    | Get blocked users               |
| `/blocked`             | POST   | Block a user                    |
| `/blocked/[id]`        | DELETE | Unblock a user                  |
| `/deactivate`          | POST   | Deactivate account              |
| `/delete`              | DELETE | Delete account permanently      |

### Admin (`/api/admin`)

| Route                   | Method | Description                 |
| ----------------------- | ------ | --------------------------- |
| `/dashboard`            | GET    | Admin stats dashboard       |
| `/users`                | GET    | List all users with filters |
| `/users/[id]/ban`       | POST   | Ban user                    |
| `/users/[id]/verify`    | POST   | Verify user                 |
| `/reports`              | GET    | Get reported content        |
| `/reports/[id]/resolve` | POST   | Resolve report              |

---

## 8. Frontend Folder Structure

```
src/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout (providers, theme)
│   ├── page.tsx                  # Home feed (redirect to /feed)
│   ├── loading.tsx               # Global loading state
│   ├── error.tsx                 # Global error boundary
│   ├── globals.css               # Tailwind imports + CSS variables
│   │
│   ├── (auth)/                   # Auth group (no sidebar)
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── signup/
│   │   │   └── page.tsx
│   │   └── forgot-password/
│   │       └── page.tsx
│   │
│   ├── (main)/                   # Main app group (with sidebar)
│   │   ├── layout.tsx            # Sidebar + main content layout
│   │   │
│   │   ├── feed/
│   │   │   └── page.tsx          # Home feed with stories + posts
│   │   ├── explore/
│   │   │   └── page.tsx          # Explore grid
│   │   ├── reels/
│   │   │   └── page.tsx          # Reels full-screen feed
│   │   ├── messages/
│   │   │   ├── page.tsx          # Inbox list
│   │   │   └── [id]/
│   │   │       └── page.tsx      # Conversation view
│   │   ├── notifications/
│   │   │   └── page.tsx          # Notifications list
│   │   ├── profile/
│   │   │   ├── [username]/
│   │   │   │   └── page.tsx      # User profile
│   │   │   ├── edit/
│   │   │   │   └── page.tsx      # Edit profile form
│   │   │   └── saved/
│   │   │       └── page.tsx      # Saved posts
│   │   ├── post/
│   │   │   ├── [id]/
│   │   │   │   └── page.tsx      # Post detail
│   │   │   └── create/
│   │   │       └── page.tsx      # Create post wizard
│   │   ├── story/
│   │   │   └── [id]/
│   │   │       └── page.tsx      # Story viewer
│   │   ├── settings/
│   │   │   ├── page.tsx          # Settings overview
│   │   │   ├── privacy/
│   │   │   │   └── page.tsx
│   │   │   ├── security/
│   │   │   │   └── page.tsx
│   │   │   ├── notifications/
│   │   │   │   └── page.tsx
│   │   │   ├── appearance/
│   │   │   │   └── page.tsx
│   │   │   ├── close-friends/
│   │   │   │   └── page.tsx
│   │   │   ├── blocked/
│   │   │   │   └── page.tsx
│   │   │   ├── archive/
│   │   │   │   └── page.tsx
│   │   │   └── account/
│   │   │       └── page.tsx
│   │   │
│   │   ├── search/
│   │   │   └── page.tsx          # Search page with results
│   │   └── hashtag/
│   │       └── [name]/
│   │           └── page.tsx      # Hashtag page
│   │
│   └── admin/                    # Admin panel
│       ├── layout.tsx
│       ├── page.tsx              # Dashboard
│       ├── users/
│       │   └── page.tsx
│       └── reports/
│           └── page.tsx
│
├── components/
│   ├── ui/                       # Reusable UI primitives
│   │   ├── Avatar.tsx
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Modal.tsx
│   │   ├── Spinner.tsx
│   │   ├── Skeleton.tsx
│   │   └── Toast.tsx
│   │
│   ├── layout/                   # Layout components
│   │   ├── Sidebar.tsx
│   │   ├── BottomNav.tsx
│   │   ├── TopBar.tsx
│   │   ├── SuggestionsPanel.tsx
│   │   └── MobileHeader.tsx
│   │
│   ├── feed/
│   │   ├── FeedPost.tsx
│   │   ├── FeedPostActions.tsx
│   │   ├── FeedPostHeader.tsx
│   │   ├── FeedPostCaption.tsx
│   │   ├── FeedPostComments.tsx
│   │   ├── StoriesBar.tsx
│   │   ├── StoryRing.tsx
│   │   └── StoryViewer.tsx
│   │
│   ├── post/
│   │   ├── PostCard.tsx
│   │   ├── PostGrid.tsx
│   │   ├── PostModal.tsx
│   │   ├── CarouselViewer.tsx
│   │   ├── LikeButton.tsx
│   │   ├── CommentSection.tsx
│   │   ├── CommentItem.tsx
│   │   └── ShareMenu.tsx
│   │
│   ├── create/
│   │   ├── CreatePostWizard.tsx
│   │   ├── MediaUploader.tsx
│   │   ├── MediaPreview.tsx
│   │   ├── CaptionEditor.tsx
│   │   ├── CarouselEditor.tsx
│   │   └── LocationPicker.tsx
│   │
│   ├── profile/
│   │   ├── ProfileHeader.tsx
│   │   ├── ProfileInfo.tsx
│   │   ├── ProfileTabs.tsx
│   │   ├── ProfileGrid.tsx
│   │   ├── HighlightsBar.tsx
│   │   └── FollowButton.tsx
│   │
│   ├── messages/
│   │   ├── ConversationList.tsx
│   │   ├── ConversationItem.tsx
│   │   ├── ChatView.tsx
│   │   ├── MessageBubble.tsx
│   │   ├── MessageInput.tsx
│   │   └── TypingIndicator.tsx
│   │
│   ├── notifications/
│   │   ├── NotificationList.tsx
│   │   ├── NotificationItem.tsx
│   │   └── NotificationBell.tsx
│   │
│   ├── explore/
│   │   ├── ExploreGrid.tsx
│   │   ├── SearchBar.tsx
│   │   └── TrendingHashtags.tsx
│   │
│   ├── reels/
│   │   ├── ReelsFeed.tsx
│   │   ├── ReelCard.tsx
│   │   └── ReelActions.tsx
│   │
│   ├── auth/
│   │   ├── LoginForm.tsx
│   │   ├── SignupForm.tsx
│   │   ├── OAuthButtons.tsx
│   │   └── ForgotPasswordForm.tsx
│   │
│   └── settings/
│       ├── SettingsSidebar.tsx
│       ├── EditProfileForm.tsx
│       ├── PrivacySettings.tsx
│       ├── NotificationSettings.tsx
│       ├── AppearanceSettings.tsx
│       ├── SecuritySettings.tsx
│       ├── CloseFriendsList.tsx
│       ├── BlockedUsersList.tsx
│       └── AccountActions.tsx
│
├── lib/
│   ├── prisma.ts                 # Prisma client singleton
│   ├── auth.ts                   # NextAuth config
│   ├── upload.ts                 # Cloudinary upload helpers
│   ├── socket.ts                 # Socket.io client
│   ├── api-client.ts             # Fetch wrapper with error handling
│   ├── utils.ts                  # Utility functions
│   ├── constants.ts              # App constants
│   └── validations.ts            # Zod schemas
│
├── hooks/
│   ├── useInfiniteScroll.ts
│   ├── useDebounce.ts
│   ├── useMediaQuery.ts
│   ├── useSocket.ts
│   ├── useNotifications.ts
│   ├── useLike.ts
│   ├── useFollow.ts
│   └── useTheme.ts
│
├── store/
│   ├── authStore.ts              # Auth state (Zustand)
│   ├── uiStore.ts                # UI state (modals, sidebar)
│   └── themeStore.ts             # Theme state
│
├── providers/
│   ├── SessionProvider.tsx
│   ├── ThemeProvider.tsx
│   ├── SocketProvider.tsx
│   └── QueryProvider.tsx
│
└── types/
    ├── index.ts                  # Shared TypeScript types
    ├── next-auth.d.ts            # NextAuth type augmentation
    └── socket-events.ts          # Socket.io event types
```

---

## 9. Testing Strategy

### Unit Tests (Vitest)

- **Services**: auth service, post service, notification service
- **Hooks**: useDebounce, useMediaQuery, useInfiniteScroll
- **Utils**: date formatting, text truncation, URL validation
- **Store**: Zustand store actions and state mutations

### Integration Tests (Vitest + React Testing Library)

- **Components**: like button, comment section, follow button, post card
- **Forms**: login form validation, signup form validation, create post
- **Auth flow**: login → redirect, signup → email verification

### E2E Tests (Playwright)

| Test        | Flow                                                 |
| ----------- | ---------------------------------------------------- |
| Auth        | Signup → verify email → login → logout               |
| Create Post | Upload image → add caption → hashtag → submit        |
| Feed        | Scroll feed → like → comment → save                  |
| Profile     | View profile → follow → unfollow                     |
| Search      | Search user → visit profile                          |
| DM          | Open conversation → send message → receive           |
| Stories     | View story → react → reply                           |
| Settings    | Change theme → update privacy → toggle notifications |
| Responsive  | Resize to mobile → verify bottom nav works           |

### Performance Tests

- Lighthouse CI for core web vitals
- Load testing with k6 for API endpoints
- Image optimization validation

---

## 10. Deployment Architecture

```
                    ┌──────────────────┐
                    │   Cloudflare DNS  │
                    └────────┬─────────┘
                             │
                    ┌────────▼─────────┐
                    │   Vercel (Edge)  │
                    │  Next.js App     │
                    │  ISR + SSR + SSG │
                    └────────┬─────────┘
                             │
          ┌──────────────────┼──────────────────┐
          │                  │                  │
          ▼                  ▼                  ▼
  ┌───────────────┐ ┌───────────────┐ ┌───────────────┐
  │   Railway      │ │  Upstash      │ │  Cloudinary    │
  │  PostgreSQL    │ │  Redis        │ │  Media CDN     │
  │  + Prisma      │ │  Cache + Pub  │ │  + Uploads     │
  └───────────────┘ └───────────────┘ └───────────────┘
          │
          ▼
  ┌───────────────┐
  │   Socket.io    │
  │  Server        │
  │  (Railway)     │
  └───────────────┘
```

### Environment Variables

```env
# Database
DATABASE_URL="postgresql://..."

# Auth
AUTH_SECRET="..."
AUTH_GOOGLE_ID="..."
AUTH_GOOGLE_SECRET="..."
AUTH_GITHUB_ID="..."
AUTH_GITHUB_SECRET="..."

# Media
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="..."
CLOUDINARY_API_KEY="..."
CLOUDINARY_API_SECRET="..."

# Redis
REDIS_URL="..."

# Socket.io
NEXT_PUBLIC_SOCKET_URL="..."

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

---

## 11. Implementation Order

| Step | Milestone                                           | Est. Time  |
| ---- | --------------------------------------------------- | ---------- |
| 1    | Scaffold Next.js + Tailwind + Prisma + NextAuth     | 1 session  |
| 2    | Database schema + migrations + seed script          | 1 session  |
| 3    | Auth pages (login, signup, forgot password) + OAuth | 1 session  |
| 4    | Main layout (sidebar, responsive nav)               | 1 session  |
| 5    | Home feed with posts (infinite scroll)              | 2 sessions |
| 6    | Create post flow (upload, crop, caption)            | 1 session  |
| 7    | Post interactions (like, comment, save, share)      | 1 session  |
| 8    | User profiles + follow system                       | 1 session  |
| 9    | Explore + search                                    | 1 session  |
| 10   | Stories (view + create + highlights)                | 2 sessions |
| 11   | Reels feed                                          | 1 session  |
| 12   | Direct messages (Socket.io)                         | 2 sessions |
| 13   | Notifications (real-time)                           | 1 session  |
| 14   | Settings pages (privacy, security, appearance)      | 1 session  |
| 15   | Dark mode + responsive polish                       | 1 session  |
| 16   | E2E tests (Playwright)                              | 1 session  |
| 17   | Performance optimization + deployment               | 1 session  |

---

## 12. Key Design Decisions

| Decision                      | Choice               | Reasoning                                                                                      |
| ----------------------------- | -------------------- | ---------------------------------------------------------------------------------------------- |
| **PostgreSQL over MongoDB**   | PostgreSQL           | Social graph needs relational integrity (follows, likes, comments). Prisma makes it type-safe. |
| **Zustand over Redux**        | Zustand              | Simpler API, less boilerplate, native TypeScript support. Redux is overkill.                   |
| **React Query over SWR**      | TanStack React Query | Better pagination, infinite queries, mutations, cache invalidation for social feeds.           |
| **NextAuth over custom auth** | NextAuth.js          | Battle-tested, OAuth providers built-in, database sessions, JWT support.                       |
| **Cloudinary over S3**        | Cloudinary           | Built-in image transformations, CDN, upload widgets, automatic format optimization.            |
| **Socket.io over WebSockets** | Socket.io            | Auto-reconnection, fallback to polling, rooms, production-ready.                               |
| **Cursor over Offset**        | Cursor pagination    | Stable with new content, faster on large datasets, no offset drift.                            |
| **SSR + ISR over SPA**        | Hybrid               | SEO for profiles/posts, fast initial load via server components, interactive client hydration. |
| **Tailwind over CSS-in-JS**   | Tailwind             | Smaller bundles (JIT), consistent design tokens, responsive built-in, dark mode toggle.        |

---

## 13. Accessibility (a11y) Checklist

- [ ] All interactive elements keyboard-navigable
- [ ] ARIA labels on icons (heart, comment, share, save)
- [ ] Focus indicators visible (focus-visible)
- [ ] Alt text on all images (auto-generated or user-provided)
- [ ] Color contrast meets WCAG AA (4.5:1 text, 3:1 large)
- [ ] Screen reader announcements for dynamic content
- [ ] Skip-to-content link
- [ ] Reduced motion media query for animations
- [ ] Form error announcements
- [ ] Semantic HTML structure (main, nav, article, section)

---

## 14. Security Checklist

- [ ] HTTPS enforced
- [ ] HTTP-only cookies for session
- [ ] CSRF protection (NextAuth built-in)
- [ ] Rate limiting (Redis-based)
- [ ] Input validation (Zod on all endpoints)
- [ ] SQL injection prevention (Prisma parameterized)
- [ ] XSS prevention (React escaping, CSP headers)
- [ ] File upload validation (type, size, virus scan)
- [ ] Password hashing (bcrypt, 12 rounds)
- [ ] 2FA support (TOTP)
- [ ] Session expiry and refresh
- [ ] Login activity monitoring
- [ ] CORS configuration
- [ ] Helmet.js headers
- [ ] Data download/delete (GDPR compliance)

---

## 15. Performance Targets

| Metric                         | Target  |
| ------------------------------ | ------- |
| First Contentful Paint (FCP)   | < 1.5s  |
| Largest Contentful Paint (LCP) | < 2.5s  |
| Time to Interactive (TTI)      | < 3.0s  |
| First Input Delay (FID)        | < 100ms |
| Cumulative Layout Shift (CLS)  | < 0.1   |
| API response (p95)             | < 200ms |
| Image load (CDN)               | < 500ms |
| Lighthouse score               | ≥ 90    |

---

_End of plan. This document covers the complete architecture, design, and implementation roadmap for building a production-grade Instagram web app clone._
