import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import type { AppRoute } from '../types/Layout';

type Props = {
  route: AppRoute;
  children: React.ReactNode;
};

export function RouteGuard({ route, children }: Props) {
  const token = useAuthStore((s) => s.accessToken);
  const role = useAuthStore((s) => s.role);

  if (route.public) {
    return <>{children}</>;
  }

  if (!token) {
    return <Navigate to="/auth" replace />;
  }

  if (role !== 'ADMIN') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}