import { Link } from 'react-router-dom';
import { getSession } from '../utils/auth.js';

/**
 * Public-facing navigation bar with session-aware CTAs.
 * Shows WriteSpace logo/brand. Displays role-aware CTAs:
 * - Admin: 'Dashboard' link
 * - User: 'My Blogs' link
 * - Guest: 'Login' and 'Get Started' buttons
 * @returns {JSX.Element}
 */
function PublicNavbar() {
  const session = getSession();

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-sm">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link
          to="/"
          className="text-xl font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
        >
          ✍️ WriteSpace
        </Link>

        <div className="flex items-center gap-3">
          {session ? (
            session.role === 'admin' ? (
              <Link
                to="/dashboard"
                className="inline-flex items-center rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-violet-700 transition-colors"
              >
                Dashboard
              </Link>
            ) : (
              <Link
                to="/my-blogs"
                className="inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 transition-colors"
              >
                My Blogs
              </Link>
            )
          ) : (
            <>
              <Link
                to="/login"
                className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 transition-colors"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default PublicNavbar;