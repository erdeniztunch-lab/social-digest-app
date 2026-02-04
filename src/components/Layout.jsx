import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { supabase } from '../lib/supabase.js';

const NavLink = ({ to, children }) => (
  <Link to={to} className="text-gray-700 hover:text-twitter font-medium">
    {children}
  </Link>
);

const Layout = () => {
  const { user } = useAuth();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="text-xl font-bold text-twitter">Twitter Digest</Link>
          <nav className="flex items-center gap-6">
            {user && (
              <>
                <NavLink to="/dashboard">Dashboard</NavLink>
                <NavLink to="/settings">Settings</NavLink>
                <button onClick={handleSignOut} className="btn-secondary">Sign Out</button>
              </>
            )}
            {!user && (
              <>
                <NavLink to="/login">Login</NavLink>
                <Link to="/signup" className="btn-primary">Get Started</Link>
              </>
            )}
          </nav>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-10">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
