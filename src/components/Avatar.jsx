import PropTypes from 'prop-types';

/**
 * Returns a role-based JSX avatar element.
 * @param {string} role - 'admin' or 'user'
 * @returns {JSX.Element} avatar element with role-specific emoji and background
 */
export function getAvatar(role) {
  if (role === 'admin') {
    return (
      <span
        className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-violet-200 text-violet-800 text-sm font-semibold"
        aria-label="Admin avatar"
      >
        👑
      </span>
    );
  }

  return (
    <span
      className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-indigo-200 text-indigo-800 text-sm font-semibold"
      aria-label="User avatar"
    >
      📖
    </span>
  );
}

/**
 * Avatar component that renders a role-based visual avatar.
 * @param {{ role: string }} props
 * @returns {JSX.Element}
 */
function Avatar({ role }) {
  return getAvatar(role);
}

Avatar.propTypes = {
  role: PropTypes.string.isRequired,
};

export default Avatar;