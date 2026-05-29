import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getSession, logout } from '../utils/auth.js';
import { getAvatar } from './Avatar.jsx';

/**
 * Authenticated navigation bar with role-based links.
 * Shows WriteSpace brand, navigation links (Blogs, Write),
 * role-based links (Dashboard and Users for Admin),
 * user avatar with display name, and logout button.
 * Highlights active route.
 * @returns {JSX.Element}
 */
function Navbar() {
  const session = getSession();
  const location = useLocation();
  const navigate = useNavigate();

  /**
   * Handle logout: clear session and redirect to login.
   */
  function handleLogout() {
    logout();
    navigate('/login');
  }

  /**
   * Determine if a given path matches the current route.
   * @param {string} path - the route path to check
   * @returns {boolean}
   */
  function isActive(path) {
    return location.pathname === path;
  }

  /**
   * Get link classes based on whether the route is active.
   * @param {string} path - the route path to check
   * @returns {string} Tailwind class string
   */
  function linkClasses(path) {
    const base = 'inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors';
    if (isActive(path)) {
      return `${base} bg-indigo-100 text-indigo-700`;
    }
    return `${base} text-gray-600 hover:bg-gray-100 hover:text-gray-900`;
  }

  if (!session) {
    return null;
  }

  const isAdmin = session.role === 'admin';

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-sm">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-1">
          <Link
            to="/"
            className="text-xl font-bold text-indigo-600 hover:text-indigo-700 transition-colors mr-4"
          >
            ✍️ WriteSpace
          </Link>

          <Link
            to="/my-blogs"
            className={linkClasses('/my-blogs')}
          >
            Blogs
          </Link>

          <Link
            to="/write"
            className={linkClasses('/write')}
          >
            Write
          </Link>

          {isAdmin && (
            <>
              <Link
                to="/dashboard"
                className={linkClasses('/dashboard')}
              >
                Dashboard
              </Link>
              <Link
                to="/users"
                className={linkClasses('/users')}
              >
                Users
              </Link>
            </>
          )}
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            {getAvatar(session.role)}
            <span className="text-sm font-medium text-gray-700">
              {session.displayName}
            </span>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;