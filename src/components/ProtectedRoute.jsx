import { useAuth } from '../context/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  console.log("ProtectedRoute - user:", user, "loading:", loading, "location:", location.pathname);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F4E9] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#6A752D] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#6A752D] font-[Montserrat]">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;