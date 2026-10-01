import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {

  // Get JWT token from browser localStorage
  const token = localStorage.getItem("token");

  // If token does not exist,
  // send the user to the login page
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If token exists,
  // allow the requested page to be displayed
  return children;
}

export default ProtectedRoute;