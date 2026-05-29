# Changelog

All notable changes to the WriteSpace project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-01-01

### Added

#### Public Pages
- **Landing Page** (`/`) — Hero section with session-aware CTAs, feature highlights (Write Freely, Role-Based Access, Instant & Local), latest posts preview, and footer with navigation links.
- **Login Page** (`/login`) — Sign in form with username and password fields, validation against hard-coded admin and localStorage users, role-based redirect on success, and already-authenticated redirect.
- **Registration Page** (`/register`) — Account creation form with display name, username, password, and confirm password fields, unique username validation, automatic session creation, and redirect to My Blogs.

#### Authentication & Authorization
- **Role-Based Access Control** — Two roles supported: `admin` (full platform management) and `user` (own content management).
- **Hard-Coded Admin Account** — Default admin credentials (`admin` / `admin`) available out of the box.
- **Protected Routes** — Route guard component (`ProtectedRoute`) redirects unauthenticated users to `/login` and unauthorized users to `/my-blogs`.
- **Session Management** — Login, logout, and session persistence via localStorage under the `writespace_session` key.

#### Blog CRUD
- **Create Post** (`/write`) — Blog post creation form with title and content fields, character counters, and required field validation.
- **Read Post** (`/blog/:id`) — Full blog post view with title, author avatar, formatted date, and ownership-aware edit/delete controls.
- **Edit Post** (`/edit/:id`) — Pre-filled edit form with ownership enforcement (users edit own posts, admins edit any post).
- **Delete Post** — Confirmation dialog before removal, available on blog listing, read view, and admin dashboard.
- **Blog Listing** (`/my-blogs`) — All community posts displayed in a responsive grid, sorted newest first, with BlogCard components.

#### Admin Features
- **Admin Dashboard** (`/dashboard`) — Gradient banner with welcome message, four stat cards (Total Posts, Total Users, Admins, Users), quick-action buttons, and recent posts list with inline edit/delete controls.
- **User Management** (`/users`) — Create new users with display name, username, password, and role assignment; view all users including hard-coded admin; delete users with confirmation (self-deletion and admin deletion prevented).

#### Components
- **Navbar** — Authenticated navigation bar with role-based links (Blogs, Write, Dashboard, Users), user avatar with display name, active route highlighting, and logout button.
- **PublicNavbar** — Public navigation bar with session-aware CTAs (Dashboard for admin, My Blogs for user, Login/Get Started for guests).
- **BlogCard** — Blog post preview card with title, truncated content excerpt, formatted date, author avatar, and ownership-aware edit link.
- **StatCard** — Reusable dashboard stat card with configurable label, value, icon, and color theme.
- **UserRow** — User management row with avatar, display name, username, role badge, join date, and conditional delete button.
- **Avatar** — Role-based avatar component with crown emoji for admin and book emoji for user.

#### Data Persistence
- **localStorage Storage Layer** — Full CRUD operations for posts (`writespace_posts`), users (`writespace_users`), and sessions (`writespace_session`) with safe JSON parsing and UUID generation.

#### UI & Styling
- **Tailwind CSS** — Utility-first responsive design across all pages and components.
- **Responsive Layout** — Mobile-friendly grid layouts with `sm:`, `md:`, and `lg:` breakpoints.
- **Gradient Backgrounds** — Indigo-to-purple gradient on hero sections, login, and registration pages.
- **Hover & Transition Effects** — Shadow transitions, color transitions, and floating animation on feature cards.

#### Deployment
- **Vercel Configuration** — `vercel.json` with SPA rewrite rules for client-side routing support.

#### Testing
- **Unit Tests** — Test suites for Avatar, ProtectedRoute, LandingPage, LoginPage, auth utilities, and storage utilities using Vitest and React Testing Library.
- **localStorage Mock** — Test setup with localStorage mock and automatic cleanup between tests.