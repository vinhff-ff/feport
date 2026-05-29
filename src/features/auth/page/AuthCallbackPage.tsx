import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../store/authStore';
import { LoadingSpinner } from '../../../components/ui/Loading/LoadingSpinner';

const AuthCallbackPage = () => {
  const navigate = useNavigate();
  const { setToken } = useAuthStore();
  const handled = useRef(false);

  useEffect(() => {
    if (handled.current) return;
    handled.current = true;

    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get('accessToken');
    const refreshToken = params.get('refreshToken');
    const role = params.get('role');
    const error = params.get('error');

    if (error || !accessToken || !refreshToken) {
      navigate('/', { replace: true });
      return;
    }

    try {
      // Set thủ công vào localStorage trước để chắc chắn persist
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('role', role ?? '');

      setToken(accessToken, refreshToken, role ?? '');
    } catch (err) {
      console.error('Failed to save tokens:', err);
      navigate('/', { replace: true });
      return;
    }

    navigate(role === 'ADMIN' ? '/admin/profile' : '/', { replace: true });
  }, []);

  return <div><LoadingSpinner /></div>;
};

export default AuthCallbackPage;