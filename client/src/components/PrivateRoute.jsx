import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

export default function PrivateRoute({ children, adminOnly = false, allowedRoles = [], excludedRoles = [] }) {
  const { user } = useSelector((state) => state.auth);

  if (!user) return <Navigate to="/login" />;
  
  // Redirect admin to admin panel
  if (user.role === 'admin') {
    return adminOnly ? children : <Navigate to="/admin" />;
  }
  
  // Redirect shelter to shelter panel
  if (user.role === 'shelter') {
    return allowedRoles === 'shelter' ? children : <Navigate to="/shelter-panel" />;
  }
  
  // Regular user (adopter) access checks
  if (adminOnly) return <Navigate to="/" />;
  if (allowedRoles.length > 0) return <Navigate to="/" />;
  
  return children;
}