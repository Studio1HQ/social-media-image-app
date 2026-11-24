<div align="center">

<img src="https://raw.githubusercontent.com/Studio1HQ/Studio1HQ/main/assets/banners/social-media-image-app.webp" alt="Pixel-Palace Image Sharing App: A social image sharing app with likes, comments and follows on Supabase" width="100%" />

<br />
<br />

# Pixel-Palace Image Sharing App

### A social image sharing app with likes, comments and follows on Supabase

Pixel-Palace is a React and Supabase social platform for sharing images. Users upload images, like and comment on posts, and follow other users. The UI came from Webcrumbs Frontend AI and the backend from Lovable.

<br />

[![Built by Studio1](https://img.shields.io/badge/Built_by_Studio1-f97316?style=for-the-badge&logo=data%3Aimage%2Fsvg%2Bxml%3Bbase64%2CPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxNjAgMTYwIiBmaWxsPSJub25lIj48cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTAgMzVDMCAxNi42ODA3IDE0LjA3NDQgMS42NDg0NCAzMiAwLjEyNjk1M1YxNDFINTEuMDUyM0M1Mi40MzA4IDEzNy4zNDQgNTQuNzQ0NiAxMzMuNjg5IDU3Ljk5MzggMTMwLjAzM0M2MS4xNDQ2IDEyNi41MDggNjQuNjg5MiAxMjMuNDQgNjguNjI3NyAxMjAuODI5QzcyLjU2NjIgMTE4LjM0OSA3Ni4zNTY5IDExNi43ODIgODAgMTE2LjEyOVY4Ni43NTQ0Qzc1LjQ3MDggODcuOTI5MiA3MS4zODQ2IDg5LjY5MTkgNjcuNzQxNSA5Mi4wNDE1QzY0IDk0LjUyMjUgNjAuNzUwOCA5Ny40NiA1Ny45OTM4IDEwMC44NTRDNTYuNTM0NSAxMDIuNzIgNTUuMjU0NSAxMDQuNjU5IDU0LjE1MzkgMTA2LjY3MVYwSDEyNUMxNDQuMzMgMCAxNjAgMTUuNjY5OSAxNjAgMzVWMTI1QzE2MCAxNDQuMzMgMTQ0LjMzIDE2MCAxMjUgMTYwSDEyNFYxOEgxMDQuOTQ4QzEwMy41NjkgMjEuNjgxNiAxMDEuMjU1IDI1LjM2MjggOTguMDA2MiAyOS4wNDQ0Qzk0Ljg1NTQgMzIuNTk0MiA5MS4zMTA4IDM1LjY4NDEgODcuMzcyMyAzOC4zMTRDODMuNDMzOCA0MC44MTIgNzkuNjQzMSA0Mi4zODk2IDc2IDQzLjA0NzRWNzIuNjMwNEM4MC41MjkyIDcxLjQ0NzMgODQuNjE1NCA2OS42NzI0IDg4LjI1ODUgNjcuMzA1N0M5MiA2NC44MDc2IDk1LjI0OTIgNjEuODQ5MSA5OC4wMDYyIDU4LjQzMDdDOTkuNDY1NSA1Ni41NTEzIDEwMC43NDUgNTQuNTk4NiAxMDEuODQ2IDUyLjU3MjNWMTYwSDM1QzE1LjY3IDE2MCAwIDE0NC4zMyAwIDEyNVYzNVoiIGZpbGw9IiNmZmZmZmYiLz48L3N2Zz4K)](https://studio1hq.com)
[![Built with Webcrumbs](https://img.shields.io/badge/Built_with_Webcrumbs-141414?style=for-the-badge)](https://www.webcrumbs.ai)
[![Live demo](https://img.shields.io/badge/Live_demo-1c1917?style=for-the-badge&logo=googlechrome&logoColor=white)](https://pixel-palace-glide.lovable.app/)

[Webcrumbs docs](https://www.webcrumbs.ai) &nbsp;·&nbsp; [Webcrumbs](https://www.webcrumbs.ai) &nbsp;·&nbsp; [More examples](https://github.com/Studio1HQ) &nbsp;·&nbsp; [studio1hq.com](https://studio1hq.com)

</div>

<br />

## Overview

Pixel-Palace is a social media image sharing platform. Users upload images, like and comment on posts, and follow other users. It was built with AI tools: [Webcrumbs Frontend AI](https://www.webcrumbs.ai/) generated the UI from a prompt, and [Lovable](https://lovable.dev/) generated the pages, the Supabase schema, the RLS policies and the app logic.

A live version is at [pixel-palace-glide.lovable.app](https://pixel-palace-glide.lovable.app/).

## Features

- **Image uploads**: signed-in users upload images from the Upload page.
- **Likes and comments**: engage with posts on the image detail page.
- **Follows**: follow users and view profiles by username.
- **Auth flows**: login, password reset and forgot-password pages, with protected and public-only routes.
- **Realtime updates**: a Supabase realtime subscription hook keeps data in sync.
- **Theme toggle**: light and dark mode.
- **Settings and profile**: pages for the signed-in user's profile and settings.

## Tech stack

| Layer | Tool |
| --- | --- |
| Frontend generation | [Webcrumbs Frontend AI](https://www.webcrumbs.ai/) |
| Backend generation | [Lovable](https://lovable.dev/) |
| Framework | [React](https://react.dev), [Vite](https://vite.dev), TypeScript |
| UI | [Tailwind CSS](https://tailwindcss.com), [shadcn/ui](https://ui.shadcn.com) |
| Backend and auth | [Supabase](https://supabase.com) |
| Data fetching | [TanStack Query](https://tanstack.com/query) |

## Getting started

### Prerequisites

- Node.js 18 or later and npm
- A [Supabase](https://supabase.com) project with the schema this app expects (see How it works)

### Installation

```bash
git clone https://github.com/Studio1HQ/social-media-image-app.git
cd social-media-image-app
npm install
```

### Environment variables

This app does not read a `.env` file. Set your Supabase credentials in `src/integrations/supabase/client.ts`:

| Constant | Description |
| --- | --- |
| `SUPABASE_URL` | Your Supabase project URL, from Project Settings, API. |
| `SUPABASE_PUBLISHABLE_KEY` | Your Supabase publishable (anon) key, from the same page. |

```ts
const SUPABASE_URL = "YOUR_SUPABASE_URL";
const SUPABASE_PUBLISHABLE_KEY = "YOUR_SUPABASE_KEY";
```

### Run

```bash
npm run dev
```

Open the URL Vite prints. Other scripts: `npm run build`, `npm run lint`, `npm run preview`.

## How it works

Routes in `src/App.tsx`: `/` (image grid), `/upload`, `/image/:id`, `/profile`, `/profile/:username`, `/settings`, `/login` and the password reset pages. Upload, profile and settings are wrapped in `ProtectedRoute`, and login is wrapped in `PublicOnlyRoute`.

The generated Supabase types in `src/integrations/supabase/types.ts` describe the data model: tables `images`, `likes`, `comments`, `follows` and `profiles`, a view `image_stats`, and functions `get_follower_count`, `get_following_count`, `has_liked_image` and `is_following_user`. The repo has `supabase/config.toml` but no migrations, so create these in your own project.

```text
src/
├── pages/          # Index, Upload, ImageDetail, Profile, Settings, Login, ...
├── components/     # ImageGrid, Navbar, SideMenu, UploadButton, ThemeToggle, route guards
├── hooks/useRealtimeSubscription.ts
└── integrations/supabase/   # client and generated types
```

## Resources

- [Pixel-Palace live demo](https://pixel-palace-glide.lovable.app/): the deployed app.
- [Supabase docs](https://supabase.com/docs): backend, auth and realtime.
- [Webcrumbs](https://www.webcrumbs.ai/): Frontend AI used to generate the UI.
- [Lovable](https://lovable.dev/): used to generate the pages, schema and logic.

<br />

---

<div align="center">

<a href="https://studio1hq.com">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/Studio1HQ/website/main/brand/studio1-logo-on-dark.svg" />
    <img src="https://raw.githubusercontent.com/Studio1HQ/website/main/brand/studio1-logo-on-light.svg" alt="Studio1" width="160" />
  </picture>
</a>

Built by **[Studio1](https://studio1hq.com)**, the technical content and DevRel partner for devtool teams. Made with [Webcrumbs](https://www.webcrumbs.ai).<br />
Browse more open-source examples at [github.com/Studio1HQ](https://github.com/Studio1HQ).

[![Website](https://img.shields.io/badge/studio1hq.com-0b0807?style=for-the-badge&logo=googlechrome&logoColor=white)](https://studio1hq.com)
[![Book a call](https://img.shields.io/badge/Book_a_strategy_call-f97316?style=for-the-badge&logo=googlecalendar&logoColor=white)](https://cal.com/studio1/collab)
[![X](https://img.shields.io/badge/%40Studio1HQ-141414?style=for-the-badge&logo=x&logoColor=white)](https://x.com/Studio1HQ)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0a66c2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/company/studio1hq/)

<sub><a href="https://studio1hq.com">studio1hq.com</a> · Technical content, docs, video and DevRel for devtools</sub>

</div>
