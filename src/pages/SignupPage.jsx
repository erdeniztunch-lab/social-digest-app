import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase.js';

const SignupPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error: signUpError } = await supabase.auth.signUp({ email, password });
    setLoading(false);
    if (signUpError) {
      setError(signUpError.message);
      return;
    }
    navigate('/dashboard');
  };

  return (
    <div className="max-w-md mx-auto card">
      <h2 className="text-2xl font-bold mb-4">Create your account</h2>
      {error && <p className="text-red-600 mb-3">{error}</p>}
      <form className="grid gap-4" onSubmit={handleSubmit}>
        <div>
          <label className="label">Email</label>
          <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label className="label">Password</label>
          <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button className="btn-primary" type="submit" disabled={loading}>{loading ? 'Creating...' : 'Sign Up'}</button>
      </form>
      <p className="text-sm text-gray-600 mt-4">Already have an account? <Link className="text-twitter" to="/login">Sign in</Link></p>
    </div>
  );
};

export default SignupPage;
