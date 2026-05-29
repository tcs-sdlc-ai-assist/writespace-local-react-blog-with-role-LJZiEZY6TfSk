import PropTypes from 'prop-types';
import { getAvatar } from './Avatar.jsx';

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
 * Determine if the delete button should be disabled for a given user.
 * Cannot delete the hard-coded admin user or yourself.
 * @param {Object} user - the user object
 * @param {Object|null} currentSession - the current session object
 * @returns {boolean} true if delete should be disabled
 */
function isDeleteDisabled(user, currentSession) {
  if (user.username === 'admin') return true;
  if (currentSession && user.username === currentSession.username) return true;
  return false;
}

/**
 * User row/card component for the admin user management panel.
 * Displays avatar, display name, username, role badge, created date, and delete button.
 * @param {{ user: Object, currentSession: Object|null, onDelete: Function }} props
 * @returns {JSX.Element}
 */
function UserRow({ user, currentSession, onDelete }) {
  const deleteDisabled = isDeleteDisabled(user, currentSession);

  const roleBadgeClasses =
    user.role === 'admin'
      ? 'bg-violet-100 text-violet-800 border border-violet-200'
      : 'bg-indigo-100 text-indigo-800 border border-indigo-200';

  return (
    <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-center gap-3 min-w-0">
        {getAvatar(user.role)}
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-bold text-gray-900 truncate">
              {user.displayName}
            </span>
            <span
              className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${roleBadgeClasses}`}
            >
              {user.role}
            </span>
          </div>
          <p className="text-xs text-gray-500 truncate">@{user.username}</p>
          {user.createdAt && (
            <time
              dateTime={user.createdAt}
              className="text-xs text-gray-400"
            >
              Joined {formatDate(user.createdAt)}
            </time>
          )}
        </div>
      </div>

      {!deleteDisabled && (
        <button
          type="button"
          onClick={() => onDelete(user.id)}
          className="ml-4 inline-flex items-center justify-center rounded-full w-8 h-8 text-gray-500 hover:bg-red-100 hover:text-red-700 transition-colors flex-shrink-0"
          aria-label={`Delete user: ${user.displayName}`}
        >
          🗑️
        </button>
      )}
    </div>
  );
}

UserRow.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    displayName: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
    createdAt: PropTypes.string,
  }).isRequired,
  currentSession: PropTypes.shape({
    username: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
    displayName: PropTypes.string.isRequired,
    loggedInAt: PropTypes.string,
  }),
  onDelete: PropTypes.func.isRequired,
};

UserRow.defaultProps = {
  currentSession: null,
};

export default UserRow;