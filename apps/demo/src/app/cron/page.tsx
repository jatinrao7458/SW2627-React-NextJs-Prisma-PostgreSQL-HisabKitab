'use client';

import { useState, useEffect } from 'react';

type Log = {
  id: string;
  message: string;
  timestamp: string;
};

export default function CronDemo() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);
  const [triggering, setTriggering] = useState(false);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/cron');
      const data = await res.json();
      if (data.success) {
        setLogs(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch logs', error);
    }
    setLoading(false);
  };

  const handleTrigger = async () => {
    setTriggering(true);
    try {
      const res = await fetch('/api/cron', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setLogs([data.data, ...logs].slice(0, 10)); // Keep max 10
      }
    } catch (error) {
      console.error('Failed to trigger cron', error);
    }
    setTriggering(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Scheduled Jobs / Cron (Mocked)</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-8 text-black">
        <h2 className="text-xl font-semibold mb-4">Manual Cron Trigger</h2>
        <p className="mb-4 text-gray-700">
          In a real application (e.g. Vercel), a cron service would hit an exposed API endpoint on a schedule. 
          Here, you can manually trigger that endpoint to simulate the scheduled job running.
        </p>
        <button
          onClick={handleTrigger}
          disabled={triggering}
          className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 disabled:opacity-50"
        >
          {triggering ? 'Running Job...' : 'Trigger Cron Job Now'}
        </button>
      </div>

      <div className="bg-gray-900 text-white p-6 rounded-lg shadow-md font-mono">
        <h2 className="text-xl font-semibold mb-4 text-gray-200">Execution Logs</h2>
        {loading ? (
          <p>Loading logs...</p>
        ) : logs.length === 0 ? (
          <p className="text-gray-500">No logs yet. Trigger a job above.</p>
        ) : (
          <div className="space-y-2">
            {logs.map((log) => (
              <div key={log.id} className="border-b border-gray-700 pb-2">
                <span className="text-green-400">[{new Date(log.timestamp).toLocaleString()}]</span> 
                {' '}
                <span className="text-gray-300">{log.message}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
