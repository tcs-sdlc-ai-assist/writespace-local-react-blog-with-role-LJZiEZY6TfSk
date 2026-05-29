import { Link } from 'react-router-dom';
import PublicNavbar from '../components/PublicNavbar.jsx';
import { getAvatar } from '../components/Avatar.jsx';
import { getPosts } from '../utils/storage.js';
import { getSession } from '../utils/auth.js';

/**
 * Truncate content to a specified maximum length, appending ellipsis if needed.
 * @param {string} text - the text to truncate
 * @param {number} maxLength - maximum character length
 * @returns {string} truncated text
 */
function truncate(text, maxLength = 120) {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + '…';
}

/**
 * Format an ISO date string to a human-readable format.
 * @param {string} isoString - ISO date string
 * @returns {string} formatted date
 */
function formatDate(isoString) {
  if (!isoString) return '';
  try {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return '';
  }
}

/**
 * Features data for the features section.
 * @returns {Array<{ icon: string, title: string, description: string }>}
 */
function getFeatures() {
  return [
    {
      icon: '✍️',
      title: 'Write Freely',
      description:
        'Express your thoughts and ideas in a clean, distraction-free writing environment designed for creativity.',
    },
    {
      icon: '🔒',
      title: 'Role-Based Access',
      description:
        'Admins manage the platform while users focus on creating. Secure, role-based access keeps everything organized.',
    },
    {
      icon: '⚡',
      title: 'Instant & Local',
      description:
        'No servers, no waiting. Everything runs locally in your browser with instant saves and lightning-fast performance.',
    },
  ];
}

/**
 * Get the latest posts sorted by creation date, limited to a count.
 * @param {number} count - maximum number of posts to return
 * @returns {Array<Object>} array of post objects
 */
function getLatestPosts(count = 3) {
  const posts = getPosts();
  return posts
    .slice()
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, count);
}

/**
 * Public-facing landing page component.
 * Includes PublicNavbar, hero section, features section, latest posts preview, and footer.
 * @returns {JSX.Element}
 */
function LandingPage() {
  const session = getSession();
  const latestPosts = getLatestPosts(3);
  const features = getFeatures();

  /**
   * Get the link destination for a post based on session state.
   * @param {string} postId - the post ID
   * @returns {string} route path
   */
  function getPostLink(postId) {
    return session ? `/blog/${postId}` : '/login';
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <PublicNavbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 text-white">
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative mx-auto max-w-5xl px-4 py-24 sm:py-32 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight">
            Your Creative Writing Space
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-indigo-100 max-w-2xl mx-auto leading-relaxed">
            WriteSpace is a simple, beautiful platform for sharing your thoughts and stories.
            Start writing today — no sign-ups, no servers, just pure creativity.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4 flex-wrap">
            {session ? (
              <Link
                to={session.role === 'admin' ? '/dashboard' : '/write'}
                className="inline-flex items-center rounded-lg bg-white px-6 py-3 text-base font-semibold text-indigo-700 shadow-lg hover:bg-indigo-50 transition-colors"
              >
                {session.role === 'admin' ? 'Go to Dashboard' : 'Start Writing'}
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="inline-flex items-center rounded-lg bg-white px-6 py-3 text-base font-semibold text-indigo-700 shadow-lg hover:bg-indigo-50 transition-colors"
                >
                  Get Started Free
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center rounded-lg border-2 border-white/30 bg-white/10 px-6 py-3 text-base font-semibold text-white backdrop-blur-sm hover:bg-white/20 transition-colors"
                >
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-5xl px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900">
              Why WriteSpace?
            </h2>
            <p className="mt-3 text-gray-600 max-w-xl mx-auto">
              Everything you need to write, share, and manage your blog — all in one place.
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <div
                key={index}
                className="rounded-xl border border-gray-200 bg-gray-50 p-6 text-center shadow-sm transition-shadow hover:shadow-md"
                style={{
                  animation: `floatCard 3s ease-in-out ${index * 0.5}s infinite`,
                }}
              >
                <span className="text-4xl" aria-hidden="true">
                  {feature.icon}
                </span>
                <h3 className="mt-4 text-lg font-bold text-gray-900">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Posts Section */}
      {latestPosts.length > 0 && (
        <section className="py-20 bg-gray-50">
          <div className="mx-auto max-w-5xl px-4">
            <div className="text-center mb-14">
              <h2 className="text-3xl font-bold text-gray-900">
                Latest Posts
              </h2>
              <p className="mt-3 text-gray-600 max-w-xl mx-auto">
                Check out what the community has been writing about recently.
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {latestPosts.map((post) => (
                <Link
                  key={post.id}
                  to={getPostLink(post.id)}
                  className="block rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
                >
                  <h3 className="text-lg font-bold text-gray-900 hover:text-indigo-600 transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                    {truncate(post.content)}
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getAvatar(post.role)}
                      <span className="text-sm font-medium text-gray-700">
                        {post.author}
                      </span>
                    </div>
                    <time
                      dateTime={post.createdAt}
                      className="text-xs text-gray-400"
                    >
                      {formatDate(post.createdAt)}
                    </time>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="mt-auto border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-4">
              <Link
                to="/"
                className="text-lg font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
              >
                ✍️ WriteSpace
              </Link>
              <Link
                to="/login"
                className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                Register
              </Link>
            </div>
            <p className="text-sm text-gray-400">
              © {new Date().getFullYear()} WriteSpace. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* CSS-only floating animation for feature cards */}
      <style>{`
        @keyframes floatCard {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-8px);
          }
        }
      `}</style>
    </div>
  );
}

export default LandingPage;