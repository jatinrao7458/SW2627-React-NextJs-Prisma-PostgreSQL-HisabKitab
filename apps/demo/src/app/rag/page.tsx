'use client';

import { useState } from 'react';

export default function RAGDemo() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{answer: string, contextUsed: string[], steps: string[]} | null>(null);

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;
    
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch('/api/rag', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });
      const data = await res.json();
      
      if (data.success) {
        setResult(data);
      }
    } catch (error) {
      console.error('Failed to query RAG', error);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">RAG (Retrieval-Augmented Generation) Mock</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-8 text-black">
        <p className="mb-4 text-gray-700 text-sm">
          Try asking: "What is Hisab Kitab?" or "How much does the premium plan cost?"
        </p>
        <form onSubmit={handleAsk} className="flex gap-4">
          <input
            type="text"
            className="flex-1 border p-3 rounded-lg text-black focus:ring-2 focus:ring-blue-500"
            placeholder="Ask a question about the project..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !query}
            className="bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Searching...' : 'Ask AI'}
          </button>
        </form>
      </div>

      {result && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-green-50 p-6 rounded-lg border border-green-200">
            <h2 className="text-xl font-bold mb-4 text-green-800">AI Answer</h2>
            <p className="text-green-900">{result.answer}</p>
          </div>
          
          <div className="bg-gray-100 p-6 rounded-lg border border-gray-200 text-black">
            <h3 className="font-bold mb-2">Internal Execution Steps (Mocked)</h3>
            <ul className="list-decimal list-inside text-sm text-gray-700 mb-4 space-y-1">
              {result.steps.map((step, i) => <li key={i}>{step}</li>)}
            </ul>
            
            <h3 className="font-bold mb-2">Context Retrieved from Vector DB</h3>
            <ul className="list-disc list-inside text-xs text-gray-600 space-y-1">
              {result.contextUsed.map((doc, i) => <li key={i}>{doc}</li>)}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
