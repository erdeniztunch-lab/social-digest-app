import React, { useEffect, useState } from 'react';
import { apiClient } from '../lib/api.js';

const SettingsPage = () => {
  const [detailLevel, setDetailLevel] = useState('medium');
  const [digestEnabled, setDigestEnabled] = useState(false);
  const [status, setStatus] = useState('');

  useEffect(() => {
    const load = async () => {
      const res = await apiClient.getUserProfile();
      setDetailLevel(res.user?.preferences?.detail_level || 'medium');
      setDigestEnabled(!!res.user?.digest_enabled);
    };
    load();
  }, []);

  const handleSave = async () => {
    setStatus('Saving...');
    try {
      await apiClient.updatePreferences({
        digest_enabled: digestEnabled,
        preferences: { detail_level: detailLevel },
      });
      setStatus('Saved!');
    } catch (e) {
      setStatus(e.message);
    }
  };

  return (
    <div className="max-w-xl card">
      <h2 className="text-2xl font-bold mb-4">Settings</h2>
      <div className="grid gap-4">
        <label className="flex items-center gap-3">
          <input type="checkbox" checked={digestEnabled} onChange={(e) => setDigestEnabled(e.target.checked)} />
          <span>Enable daily digest</span>
        </label>
        <div>
          <label className="label">Detail level</label>
          <select className="input" value={detailLevel} onChange={(e) => setDetailLevel(e.target.value)}>
            <option value="low">Low (5 tweets)</option>
            <option value="medium">Medium (15 tweets)</option>
            <option value="high">High (30 tweets)</option>
          </select>
        </div>
        <button className="btn-primary" onClick={handleSave}>Save</button>
        {status && <p className="text-sm text-gray-600">{status}</p>}
      </div>
    </div>
  );
};

export default SettingsPage;
