import { useSelector } from "react-redux";
import { ReactNode } from "react";
import NotFound from "./NotFound";
import { RootState } from "./store";

interface RoleGuardProps {
  requiredRole: string[];
  children: ReactNode;
}

const RoleGuard = ({ requiredRole, children }: RoleGuardProps) => {
  const userRole = useSelector((state: RootState) => state.user.role);
  const hasRole = userRole ? requiredRole.includes(userRole) : false;

  if (!hasRole) {
    return <NotFound />;
  }
  return <>{children}</>;
};

export default RoleGuard;
