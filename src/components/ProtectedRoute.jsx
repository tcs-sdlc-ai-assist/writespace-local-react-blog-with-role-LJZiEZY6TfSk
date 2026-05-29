import PropTypes from 'prop-types';
import { Navigate, Outlet } from 'react-router-dom';
import { getSession } from '../utils/auth.js';

/**
 * Route guard component for protected routes.
 * Checks session via auth.js getSession.
 * - If no session exists, redirects to '/login'.
 * - If a role prop is specified and the session role does not match, redirects to '/my-blogs'.
 * - Otherwise, renders children or an Outlet for nested routes.
 * @param {{ role?: string, children?: React.ReactNode }} props
 * @returns {JSX.Element}
 */
function ProtectedRoute({ role, children }) {
  const session = getSession();

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  if (role && session.role !== role) {
    return <Navigate to="/my-blogs" replace />;
  }

  return children ? children : <Outlet />;
}

ProtectedRoute.propTypes = {
  role: PropTypes.string,
  children: PropTypes.node,
};

ProtectedRoute.defaultProps = {
  role: undefined,
  children: undefined,
};

export default ProtectedRoute;