import React, { useEffect, useState } from 'react';
import { apiClient } from '../lib/api.js';

const DashboardPage = () => {
  const [profile, setProfile] = useState(null);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const profileRes = await apiClient.getUserProfile();
        const historyRes = await apiClient.getDigestHistory();
        setProfile(profileRes.user);
        setHistory(historyRes.logs || []);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleTestDigest = async () => {
    try {
      await apiClient.sendTestDigest();
      alert('Test digest sent.');
    } catch (e) {
      alert(e.message);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="grid gap-6">
      {error && <p className="text-red-600">{error}</p>}
      <div className="card">
        <h2 className="text-2xl font-bold mb-2">Dashboard</h2>
        <p className="text-gray-600 mb-4">Welcome {profile?.email || 'user'}.</p>
        <button className="btn-primary" onClick={handleTestDigest}>Send Test Digest</button>
      </div>
      <div className="card">
        <h3 className="font-semibold mb-3">Recent Digests</h3>
        {history.length === 0 && <p className="text-gray-600">No digests yet.</p>}
        <ul className="grid gap-2">
          {history.map((log) => (
            <li key={log.id} className="text-sm text-gray-700">
              {new Date(log.sent_at).toLocaleString()} - {log.status} ({log.tweet_count} tweets)
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DashboardPage;
