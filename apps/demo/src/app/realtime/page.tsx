'use client';

import { useState, useEffect } from 'react';

type Update = {
  message?: string;
  ticker?: string;
  price?: string;
  time: string;
};

export default function RealtimeDemo() {
  const [updates, setUpdates] = useState<Update[]>([]);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    let eventSource: EventSource;

    const connect = () => {
      eventSource = new EventSource('/api/socket');
      
      eventSource.onopen = () => {
        setConnected(true);
      };

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          setUpdates(prev => [data, ...prev].slice(0, 15)); // Keep last 15 updates
        } catch (err) {
          console.error("Error parsing SSE data", err);
        }
      };

      eventSource.onerror = () => {
        setConnected(false);
        eventSource.close();
      };
    };

    connect();

    return () => {
      if (eventSource) {
        eventSource.close();
      }
    };
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Real-time Data (Server-Sent Events)</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-8 text-black">
        <div className="flex items-center gap-2 mb-6">
          <div className={`w-4 h-4 rounded-full ${connected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
          <span className="font-semibold text-lg">{connected ? 'Live Connection Active' : 'Disconnected'}</span>
        </div>
        
        <div className="bg-gray-50 border p-4 rounded-lg h-96 overflow-y-auto">
          {updates.length === 0 ? (
            <p className="text-gray-500 italic">Waiting for data stream...</p>
          ) : (
            <div className="space-y-3">
              {updates.map((update, idx) => (
                <div key={idx} className="flex justify-between items-center bg-white p-3 shadow-sm rounded border-l-4 border-blue-500">
                  <div>
                    {update.message ? (
                      <span className="font-medium text-gray-700">{update.message}</span>
                    ) : (
                      <span className="font-bold text-lg">
                        {update.ticker} <span className="text-green-600 font-mono ml-2">${update.price}</span>
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-gray-400 font-mono">
                    {update.time}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
