'use client';

import { useState } from 'react';

export default function AgentDemo() {
  const [task, setTask] = useState('');
  const [running, setRunning] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [finalAnswer, setFinalAnswer] = useState<string | null>(null);

  const handleRunAgent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!task) return;
    
    setRunning(true);
    setLogs([]);
    setFinalAnswer(null);

    try {
      const res = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task }),
      });

      if (!res.body) throw new Error('No readable stream');
      
      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value);
        const lines = chunk.split('\n\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const dataStr = line.slice(6);
            try {
              const data = JSON.parse(dataStr);
              if (data.message.startsWith('FINAL_ANSWER: ')) {
                setFinalAnswer(data.message.replace('FINAL_ANSWER: ', ''));
              } else {
                setLogs(prev => [...prev, data.message]);
              }
            } catch (err) {}
          }
        }
      }
    } catch (error) {
      console.error('Agent execution failed', error);
      setLogs(prev => [...prev, 'Error executing agent']);
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Multi-step Agent (Mocked)</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-8 text-black">
        <form onSubmit={handleRunAgent} className="flex gap-4">
          <input
            type="text"
            className="flex-1 border p-3 rounded-lg text-black focus:ring-2 focus:ring-purple-500"
            placeholder="Assign a task to the agent..."
            value={task}
            onChange={(e) => setTask(e.target.value)}
            disabled={running}
          />
          <button
            type="submit"
            disabled={running || !task}
            className="bg-purple-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-purple-700 disabled:opacity-50"
          >
            {running ? 'Agent is working...' : 'Run Agent'}
          </button>
        </form>
      </div>

      {(logs.length > 0 || finalAnswer) && (
        <div className="bg-gray-900 rounded-lg p-6 font-mono text-sm shadow-inner">
          <div className="mb-4">
            <h3 className="text-gray-400 mb-2 border-b border-gray-700 pb-1">Agent Thought Process</h3>
            <ul className="space-y-2">
              {logs.map((log, i) => (
                <li key={i} className="text-green-400">
                  <span className="text-gray-500 mr-2">{'>'}</span>
                  {log}
                </li>
              ))}
              {running && (
                <li className="text-yellow-400 animate-pulse">
                  <span className="text-gray-500 mr-2">{'>'}</span>
                  Thinking...
                </li>
              )}
            </ul>
          </div>
          
          {finalAnswer && (
            <div className="mt-6 border-t border-gray-700 pt-4">
              <h3 className="text-blue-400 font-bold mb-2">Final Output:</h3>
              <p className="text-white bg-gray-800 p-4 rounded whitespace-pre-wrap">{finalAnswer}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
