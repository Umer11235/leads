// hooks/useAuthRedirect.ts
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiService } from '@/apies/Services/UserService';

export const useAuthRedirect = () => {
  const router = useRouter();
  const [authStatus, setAuthStatus] = useState<'checking' | 'authenticated' | 'unauthenticated'>('checking');

  useEffect(() => {
    const verifyCredentials = async () => {
      const username = localStorage.getItem("username");
      const password = localStorage.getItem("password");
      
      if (!username || !password) {
        setAuthStatus('unauthenticated');
        router.push('/login');
        return;
      }


      try {
        const response = await apiService.postData("/Login/login", {
          username,
          password
        });

        if (response?.isSuccess) {
          setAuthStatus('authenticated');
        } else {
          alert("Authentication failed:");
          setAuthStatus('unauthenticated');
          router.push('/login');
        }
      } catch (error) {
        setAuthStatus('unauthenticated');
        router.push('/login');
      }
    };

    verifyCredentials();
  }, [router]);

  return {
    isAuthenticated: authStatus === 'authenticated',
    isLoading: authStatus === 'checking'
  };
};