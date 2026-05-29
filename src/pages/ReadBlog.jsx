import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import { getAvatar } from '../components/Avatar.jsx';
import { getPosts, deletePost } from '../utils/storage.js';
import { getSession } from '../utils/auth.js';

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
 * Determine if the current session user can edit/delete the given post.
 * Admins can edit all posts; users can only edit their own.
 * @param {Object} post - the post object
 * @param {Object|null} currentSession - the current session object
 * @returns {boolean}
 */
function canEdit(post, currentSession) {
  if (!currentSession) return false;
  if (currentSession.role === 'admin') return true;
  return post.author === currentSession.username;
}

/**
 * Single blog post reading page.
 * Displays full post content with title, author avatar, date, and ownership-aware controls.
 * Admin sees edit/delete on all posts; users see these only on their own.
 * Invalid/missing post ID shows error message with back link.
 * Includes Navbar.
 * @returns {JSX.Element}
 */
function ReadBlog() {
  const { id } = useParams();
  const navigate = useNavigate();
  const session = getSession();
  const [post, setPost] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const allPosts = getPosts();
    const found = allPosts.find((p) => p.id === id);
    if (found) {
      setPost(found);
      setNotFound(false);
    } else {
      setPost(null);
      setNotFound(true);
    }
  }, [id]);

  /**
   * Handle deleting the current post.
   * Confirms before removal and redirects to '/blogs'.
   */
  function handleDelete() {
    const confirmed = window.confirm('Are you sure you want to delete this post?');
    if (!confirmed) return;

    deletePost(post.id);
    navigate('/my-blogs', { replace: true });
  }

  const showControls = post && canEdit(post, session);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="mx-auto max-w-3xl px-4 py-8">
        {notFound ? (
          <div className="rounded-lg border border-gray-200 bg-white p-12 text-center shadow-sm">
            <span className="text-5xl" aria-hidden="true">
              😕
            </span>
            <h2 className="mt-4 text-lg font-bold text-gray-900">
              Post Not Found
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              The post you&apos;re looking for doesn&apos;t exist or has been removed.
            </p>
            <Link
              to="/my-blogs"
              className="mt-6 inline-flex items-center rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 transition-colors"
            >
              ← Back to Blogs
            </Link>
          </div>
        ) : post ? (
          <article className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <h1 className="text-2xl font-bold text-gray-900 flex-1 min-w-0">
                {post.title}
              </h1>
              {showControls && (
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Link
                    to={`/edit/${post.id}`}
                    className="inline-flex items-center justify-center w-8 h-8 rounded-full text-gray-500 hover:bg-indigo-100 hover:text-indigo-700 transition-colors"
                    aria-label={`Edit post: ${post.title}`}
                  >
                    ✏️
                  </Link>
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="inline-flex items-center justify-center w-8 h-8 rounded-full text-gray-500 hover:bg-red-100 hover:text-red-700 transition-colors"
                    aria-label={`Delete post: ${post.title}`}
                  >
                    🗑️
                  </button>
                </div>
              )}
            </div>

            <div className="mt-4 flex items-center justify-between border-b border-gray-200 pb-4">
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

            <div className="mt-6 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
              {post.content}
            </div>

            <div className="mt-8 pt-4 border-t border-gray-200">
              <Link
                to="/my-blogs"
                className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
              >
                ← Back to Blogs
              </Link>
            </div>
          </article>
        ) : null}
      </main>
    </div>
  );
}

export default ReadBlog;