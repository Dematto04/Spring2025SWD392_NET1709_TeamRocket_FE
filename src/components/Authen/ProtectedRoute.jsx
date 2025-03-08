import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "@/hooks/use-toast";

const ProtectedRoute = ({ children, allowedRoles, isRestricted }) => {
  const user = useSelector((state) => state.auth.user);

  if (isRestricted) {
    return user ? <Navigate to="/" /> : children;
  }
  if (allowedRoles) {
    if (!user) {
      toast({
        title: "You have to login first 😊"
      })
      return <Navigate to="/login" replace />;
    }

    if (!allowedRoles.includes(user.role)) {
      return <Navigate to="/" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
