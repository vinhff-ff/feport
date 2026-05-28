import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../store/authStore';
import { LoadingSpinner } from '../../../components/ui/Loading/LoadingSpinner';

const AuthCallbackPage = () => {
  const navigate = useNavigate();
  const { setToken } = useAuthStore();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get('accessToken');
    const refreshToken = params.get('refreshToken');
    const role = params.get('role');
    const error = params.get('error');

    if (error || !accessToken || !refreshToken) {
      navigate('/', { replace: true });
      return;
    }

    setToken(accessToken, refreshToken, role);

    navigate(role === 'ADMIN' ? '/admin/profile' : '/', { replace: true });
  }, []);

  return <div><LoadingSpinner /></div>;
};

export default AuthCallbackPage;