import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { apiClient } from '../lib/api.js';

const TwitterCallbackPage = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const run = async () => {
      const code = params.get('code');
      const state = params.get('state');
      const codeVerifier = localStorage.getItem('twitter_code_verifier');

      if (!code || !codeVerifier) {
        navigate('/dashboard');
        return;
      }

      await apiClient.handleTwitterCallback(code, codeVerifier, state);
      localStorage.removeItem('twitter_code_verifier');
      navigate('/dashboard');
    };

    run();
  }, [params, navigate]);

  return <div>Connecting Twitter...</div>;
};

export default TwitterCallbackPage;
