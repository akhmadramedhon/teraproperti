// RequireCompleteProfile.jsx
import { useUser } from "@clerk/clerk-react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Navigate } from "react-router-dom";
import Loading from "./Loading";

export default function RequireCompleteProfile({ children }) {
  const { user, isLoaded } = useUser();

  const userData = useQuery(
    api.users.getUser,
    isLoaded && user?.id ? { userId: user.id } : "skip"
  );

  const isLoading = !isLoaded || userData === undefined;

  if (isLoading) return <Loading />;

  const isProfileComplete =
    userData?.name && userData?.nik && userData?.ktp_image_url;

  const currentPath = window.location.pathname;
  const isOnIsiDataPage = currentPath === "/isi-data";

  if ((!isProfileComplete || !userData.role) && !isOnIsiDataPage) {
    return <Navigate to="/isi-data" replace />;
  }

  return children;
}
