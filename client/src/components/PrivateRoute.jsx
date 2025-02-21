import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

export default function PrivateRoute({ children, adminOnly = false, allowedRoles = [] }) {
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  // Allow access to home page without authentication
  if (isHomePage && !user) {
    return children;
  }

  // For other routes, require authentication
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Role-based access control
  if (user.role === 'admin') {
    return adminOnly ? children : <Navigate to="/admin" replace />;
  }

  if (user.role === 'shelter') {
    return allowedRoles === 'shelter' ? children : <Navigate to="/shelter-panel" replace />;
  }

  // Regular user (adopter) access checks
  if (adminOnly || allowedRoles.length > 0) {
    return <Navigate to="/" replace />;
  }

  return children;
}