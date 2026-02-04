import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => (
  <div className="grid gap-10">
    <section className="card text-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">Never miss your Twitter feed again</h1>
      <p className="text-gray-600 mb-6">We summarize your timeline and email it every morning.</p>
      <Link to="/signup" className="btn-primary">Get Started</Link>
    </section>
    <section className="grid md:grid-cols-3 gap-6">
      <div className="card">
        <h3 className="font-semibold text-lg mb-2">Secure OAuth</h3>
        <p className="text-gray-600">Connect Twitter safely with OAuth 2.0.</p>
      </div>
      <div className="card">
        <h3 className="font-semibold text-lg mb-2">Daily Digests</h3>
        <p className="text-gray-600">Wake up to a clean summary of the last 24 hours.</p>
      </div>
      <div className="card">
        <h3 className="font-semibold text-lg mb-2">Custom Settings</h3>
        <p className="text-gray-600">Choose detail level and delivery time.</p>
      </div>
    </section>
  </div>
);

export default LandingPage;
