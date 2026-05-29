import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login, getSession } from '../utils/auth.js';

/**
 * Login page component.
 * Renders a login form with username and password fields.
 * Validates against hard-coded admin and localStorage users via auth.js.
 * On success, redirects admin to '/dashboard' and user to '/my-blogs'.
 * Already-authenticated users are redirected to their home.
 * @returns {JSX.Element}
 */
function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const session = getSession();
    if (session) {
      if (session.role === 'admin') {
        navigate('/dashboard', { replace: true });
      } else {
        navigate('/my-blogs', { replace: true });
      }
    }
  }, [navigate]);

  /**
   * Handle form submission.
   * Calls auth.js login, redirects on success, shows error on failure.
   * @param {React.FormEvent} e - form event
   */
  function handleSubmit(e) {
    e.preventDefault();
    setError('');

    const result = login(username, password);

    if (!result.success) {
      setError(result.error || 'Login failed.');
      return;
    }

    if (result.session && result.session.role === 'admin') {
      navigate('/dashboard', { replace: true });
    } else {
      navigate('/my-blogs', { replace: true });
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-xl">
        <div className="text-center mb-8">
          <Link
            to="/"
            className="text-2xl font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
          >
            ✍️ WriteSpace
          </Link>
          <h1 className="mt-4 text-2xl font-bold text-gray-900">
            Welcome Back
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to your account to continue
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
              autoComplete="username"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
          >
            Sign In
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Don&apos;t have an account?{' '}
          <Link
            to="/register"
            className="font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;