import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import StatCard from '../components/StatCard.jsx';
import { getAvatar } from '../components/Avatar.jsx';
import { getPosts, getUsers, deletePost } from '../utils/storage.js';
import { getSession } from '../utils/auth.js';

/**
 * Truncate content to a specified maximum length, appending ellipsis if needed.
 * @param {string} text - the text to truncate
 * @param {number} maxLength - maximum character length
 * @returns {string} truncated text
 */
function truncate(text, maxLength = 80) {
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
 * Admin-only dashboard page.
 * Displays gradient banner header with welcome message, four StatCard components
 * showing Total Posts, Total Users, Admins count, and Users count from localStorage.
 * Quick-action buttons for creating posts and managing users.
 * Recent posts list (up to 5) with inline edit/delete controls.
 * Includes Navbar.
 * @returns {JSX.Element}
 */
function AdminDashboard() {
  const session = getSession();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  /**
   * Load all posts and users from localStorage.
   */
  function loadData() {
    const allPosts = getPosts();
    const sorted = allPosts
      .slice()
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    setPosts(sorted);

    const allUsers = getUsers();
    setUsers(allUsers);
  }

  /**
   * Handle deleting a post by id.
   * Confirms before removal and reloads data.
   * @param {string} postId - UUID of the post to delete
   */
  function handleDelete(postId) {
    const confirmed = window.confirm('Are you sure you want to delete this post?');
    if (!confirmed) return;

    deletePost(postId);
    loadData();
  }

  const totalPosts = posts.length;
  const totalUsers = users.length + 1; // +1 for hard-coded admin
  const adminCount = users.filter((u) => u.role === 'admin').length + 1; // +1 for hard-coded admin
  const userCount = users.filter((u) => u.role === 'user').length;
  const recentPosts = posts.slice(0, 5);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="mx-auto max-w-5xl px-4 py-8">
        {/* Gradient Banner */}
        <div className="rounded-xl bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 p-8 text-white shadow-lg mb-8">
          <h1 className="text-2xl font-bold">
            Welcome back, {session ? session.displayName : 'Admin'} 👋
          </h1>
          <p className="mt-2 text-indigo-100">
            Here&apos;s an overview of your WriteSpace platform.
          </p>
        </div>

        {/* Stat Cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <StatCard
            title="Total Posts"
            value={totalPosts}
            icon="📝"
            color="blue"
          />
          <StatCard
            title="Total Users"
            value={totalUsers}
            icon="👥"
            color="green"
          />
          <StatCard
            title="Admins"
            value={adminCount}
            icon="👑"
            color="violet"
          />
          <StatCard
            title="Users"
            value={userCount}
            icon="📖"
            color="indigo"
          />
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-3 mb-8">
          <Link
            to="/write"
            className="inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 transition-colors"
          >
            ✍️ Create Post
          </Link>
          <Link
            to="/users"
            className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 transition-colors"
          >
            👥 Manage Users
          </Link>
        </div>

        {/* Recent Posts */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Recent Posts</h2>
            <Link
              to="/my-blogs"
              className="text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
            >
              View All →
            </Link>
          </div>

          {recentPosts.length === 0 ? (
            <div className="rounded-lg border border-gray-200 bg-white p-12 text-center shadow-sm">
              <span className="text-5xl" aria-hidden="true">
                📝
              </span>
              <h2 className="mt-4 text-lg font-bold text-gray-900">
                No posts yet
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Be the first to share something with the community!
              </p>
              <Link
                to="/write"
                className="mt-6 inline-flex items-center rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 transition-colors"
              >
                Create Your First Post
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentPosts.map((post) => (
                <div
                  key={post.id}
                  className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    {getAvatar(post.role)}
                    <div className="min-w-0 flex-1">
                      <Link
                        to={`/blog/${post.id}`}
                        className="text-sm font-bold text-gray-900 hover:text-indigo-600 transition-colors line-clamp-1"
                      >
                        {post.title}
                      </Link>
                      <p className="text-xs text-gray-500 line-clamp-1">
                        {truncate(post.content)}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-500">
                          by {post.author}
                        </span>
                        <time
                          dateTime={post.createdAt}
                          className="text-xs text-gray-400"
                        >
                          {formatDate(post.createdAt)}
                        </time>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 flex-shrink-0 ml-3">
                    <Link
                      to={`/edit/${post.id}`}
                      className="inline-flex items-center justify-center w-8 h-8 rounded-full text-gray-500 hover:bg-indigo-100 hover:text-indigo-700 transition-colors"
                      aria-label={`Edit post: ${post.title}`}
                    >
                      ✏️
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleDelete(post.id)}
                      className="inline-flex items-center justify-center w-8 h-8 rounded-full text-gray-500 hover:bg-red-100 hover:text-red-700 transition-colors"
                      aria-label={`Delete post: ${post.title}`}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;