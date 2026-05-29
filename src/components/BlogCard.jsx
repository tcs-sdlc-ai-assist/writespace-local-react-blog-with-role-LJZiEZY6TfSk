import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { getAvatar } from './Avatar.jsx';

/**
 * Truncate content to a specified maximum length, appending ellipsis if needed.
 * @param {string} text - the text to truncate
 * @param {number} maxLength - maximum character length
 * @returns {string} truncated text
 */
function truncate(text, maxLength = 150) {
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
 * Blog post preview card component.
 * Displays title, excerpt, date, author with avatar, and ownership-aware edit control.
 * @param {{ post: Object, currentSession: Object|null }} props
 * @returns {JSX.Element}
 */
function BlogCard({ post, currentSession }) {
  const showEdit = canEdit(post, currentSession);

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <Link
          to={`/blog/${post.id}`}
          className="flex-1 min-w-0"
        >
          <h2 className="text-lg font-bold text-gray-900 hover:text-indigo-600 transition-colors line-clamp-2">
            {post.title}
          </h2>
        </Link>
        {showEdit && (
          <Link
            to={`/edit/${post.id}`}
            className="inline-flex items-center justify-center w-8 h-8 rounded-full text-gray-500 hover:bg-indigo-100 hover:text-indigo-700 transition-colors flex-shrink-0"
            aria-label={`Edit post: ${post.title}`}
          >
            ✏️
          </Link>
        )}
      </div>

      <Link to={`/blog/${post.id}`}>
        <p className="mt-2 text-sm text-gray-600 leading-relaxed">
          {truncate(post.content)}
        </p>
      </Link>

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
    </div>
  );
}

BlogCard.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    updatedAt: PropTypes.string,
  }).isRequired,
  currentSession: PropTypes.shape({
    username: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
    displayName: PropTypes.string.isRequired,
    loggedInAt: PropTypes.string,
  }),
};

BlogCard.defaultProps = {
  currentSession: null,
};

export default BlogCard;