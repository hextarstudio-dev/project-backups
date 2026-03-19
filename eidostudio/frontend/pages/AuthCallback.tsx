import React, { useEffect } from 'react';
import { useNavigate } from '../utils/router-types';
import { useSearchParams } from 'react-router-dom';
import { syncUserToStorage } from '../context/authUtils';

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const success = searchParams.get('success');
    const error = searchParams.get('error');

    // Wave 4: Backend now sets HttpOnly cookies + eidos_user cookie
    // Just need to read eidos_user from cookies and sync to localStorage
    if (success === 'true') {
      try {
        // Read user data from cookie (not HttpOnly, readable by JS)
        const cookies = document.cookie.split(';').reduce(
          (acc, cookie) => {
            const [key, value] = cookie.trim().split('=');
            acc[key] = value;
            return acc;
          },
          {} as Record<string, string>
        );

        const eidosUser = cookies['eidos_user'];
        const eidosAuth = cookies['eidos_auth'];

        if (eidosUser && eidosAuth) {
          const user = JSON.parse(decodeURIComponent(eidosUser));

          // Wave 4: Sync user data from cookie to localStorage
          localStorage.setItem('eidos_auth', 'true');
          syncUserToStorage({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            avatarUrl: user.avatarUrl || null,
          });

          // Redirect to hub
          navigate(`/hub/meus-produtos`);
        } else {
          console.error('OAuth cookies not found');
          navigate('/login?error=Auth cookies missing');
        }
      } catch (error) {
        console.error('Error parsing OAuth callback:', error);
        navigate('/login?error=Auth parsing failed');
      }
    } else if (error) {
      console.error('OAuth error:', error);
      navigate(`/login?error=${error}`);
    } else {
      navigate('/login');
    }
  }, [navigate, searchParams]);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-brand-neutral">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-brand-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-white text-lg">Autenticando...</p>
      </div>
    </div>
  );
};

export default AuthCallback;
