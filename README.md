# WriteSpace

A simple, beautiful blogging platform built with React and Vite. WriteSpace lets users create, read, edit, and delete blog posts with role-based access control — all powered by localStorage with no backend required.

## Tech Stack

- **Vite** — Lightning-fast build tool and dev server
- **React 18** — UI library with functional components and hooks
- **React Router v6** — Client-side routing with protected routes
- **Tailwind CSS** — Utility-first CSS framework
- **localStorage** — Client-side data persistence for posts, users, and sessions
- **UUID** — Unique ID generation for posts and users
- **Vitest** — Unit testing framework with React Testing Library

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher)
- npm (comes with Node.js)

### Installation

```bash
git clone <repository-url>
cd writespace
npm install
```

### Development

Start the local development server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

### Build

Create a production build:

```bash
npm run build
```

The output will be in the `dist/` directory.

### Preview

Preview the production build locally:

```bash
npm run preview
```

### Testing

Run all tests:

```bash
npm run test
```

Run tests in watch mode:

```bash
npm run test:watch
```

## Folder Structure

```
writespace/
├── index.html                  # HTML entry point
├── package.json                # Dependencies and scripts
├── vite.config.js              # Vite configuration
├── vitest.config.js            # Vitest configuration
├── tailwind.config.js          # Tailwind CSS configuration
├── postcss.config.js           # PostCSS configuration
├── vercel.json                 # Vercel deployment configuration
├── src/
│   ├── main.jsx                # React entry point
│   ├── App.jsx                 # Root component with routing
│   ├── index.css               # Tailwind CSS imports
│   ├── setup.js                # Test setup (localStorage mock)
│   ├── setupTests.js           # Vitest setup file
│   ├── components/
│   │   ├── Avatar.jsx          # Role-based avatar component
│   │   ├── Avatar.test.jsx     # Avatar tests
│   │   ├── BlogCard.jsx        # Blog post preview card
│   │   ├── Navbar.jsx          # Authenticated navigation bar
│   │   ├── ProtectedRoute.jsx  # Route guard component
│   │   ├── ProtectedRoute.test.jsx
│   │   ├── PublicNavbar.jsx    # Public navigation bar
│   │   ├── StatCard.jsx        # Dashboard stat card
│   │   └── UserRow.jsx         # User management row
│   ├── pages/
│   │   ├── AdminDashboard.jsx  # Admin dashboard page
│   │   ├── Home.jsx            # Blog listing page
│   │   ├── LandingPage.jsx     # Public landing page
│   │   ├── LandingPage.test.jsx
│   │   ├── LoginPage.jsx       # Login page
│   │   ├── LoginPage.test.jsx
│   │   ├── ReadBlog.jsx        # Single blog post page
│   │   ├── RegisterPage.jsx    # Registration page
│   │   ├── UserManagement.jsx  # Admin user management page
│   │   └── WriteBlog.jsx       # Create/edit blog post page
│   └── utils/
│       ├── auth.js             # Authentication logic
│       ├── auth.test.js        # Auth tests
│       ├── storage.js          # localStorage CRUD operations
│       └── storage.test.js     # Storage tests
```

## Usage Guide

### Roles

WriteSpace supports two roles:

| Role    | Capabilities                                                                 |
| ------- | ---------------------------------------------------------------------------- |
| **Admin** | View dashboard, manage all posts (create, read, edit, delete), manage users |
| **User**  | Create, read, edit, and delete their own posts                              |

### Default Admin Account

A hard-coded admin account is available out of the box:

- **Username:** `admin`
- **Password:** `admin`

### Features

#### Public Pages

- **Landing Page** (`/`) — Hero section, feature highlights, and latest posts preview
- **Login** (`/login`) — Sign in with username and password
- **Register** (`/register`) — Create a new user account

#### Authenticated Pages

- **My Blogs** (`/my-blogs`) — Browse all posts from the community
- **Write** (`/write`) — Create a new blog post with title and content
- **Read Blog** (`/blog/:id`) — View a full blog post
- **Edit Post** (`/edit/:id`) — Edit an existing post (own posts for users, any post for admins)

#### Admin-Only Pages

- **Dashboard** (`/dashboard`) — Platform overview with stats (total posts, users, admins), quick actions, and recent posts
- **User Management** (`/users`) — Create new users with role assignment, view all users, and delete users

### Data Persistence

All data is stored in the browser's localStorage under the following keys:

- `writespace_posts` — Blog posts
- `writespace_users` — Registered users
- `writespace_session` — Current user session

Clearing your browser's localStorage will reset all data.

## Deployment

### Vercel

WriteSpace is configured for deployment on [Vercel](https://vercel.com/) with the included `vercel.json` that handles SPA routing rewrites.

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket).
2. Import the project in the [Vercel Dashboard](https://vercel.com/dashboard).
3. Vercel will auto-detect the Vite framework. Use the default settings:
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`
4. Click **Deploy**.

The `vercel.json` file ensures all routes are rewritten to `index.html` for client-side routing:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### Other Platforms

For any static hosting platform (Netlify, GitHub Pages, Cloudflare Pages, etc.):

1. Run `npm run build` to generate the `dist/` directory.
2. Deploy the contents of `dist/` to your hosting provider.
3. Configure a catch-all redirect so all routes serve `index.html` (required for client-side routing with React Router).

## License

This is a private project. All rights reserved.