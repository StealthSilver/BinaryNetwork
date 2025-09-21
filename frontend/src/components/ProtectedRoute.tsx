import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../config/redux/store";
import type { JSX } from "react";

interface ProtectedRouteProps {
  children: JSX.Element;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { loggedIn } = useSelector((state: RootState) => state.auth);

  if (!loggedIn) {
    // User is not logged in, redirect to login page
    return <Navigate to="/login" replace />;
  }

  // User is logged in, render the requested component
  return children;
}
