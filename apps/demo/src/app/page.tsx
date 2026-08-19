import Link from 'next/link';

export default function Home() {
  const topics = [
    { title: 'CRUD Operations (Mongo)', path: '/crud', desc: 'Mocked MongoDB Create, Read, Update, Delete.' },
    { title: 'Scheduled Jobs / Cron', path: '/cron', desc: 'Trigger and view logs for background scheduled jobs.' },
    { title: 'Payment Gateway Integration', path: '/payment', desc: 'Mocked checkout flow with Stripe/Razorpay.' },
    { title: 'WebSocket / Real-time', path: '/realtime', desc: 'Server-Sent Events for live data streaming.' },
    { title: 'Server-Side Rendering (SSR)', path: '/ssr', desc: 'Fast initial load and SEO friendly Next.js page.' },
    { title: 'RAG / Vector Retrieval', path: '/rag', desc: 'Mocked semantic search and LLM synthesis.' },
    { title: 'Multi-step Agent', path: '/agent', desc: 'Streaming AI agent thought process.' },
  ];

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl mb-4">
            Advanced Topics Demo
          </h1>
          <p className="text-xl text-gray-500">
            A standalone application showcasing implementations of complex features for Hisab Kitab.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {topics.map((topic, idx) => (
            <Link 
              key={idx} 
              href={topic.path}
              className="block group"
            >
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-full transition-all duration-200 hover:shadow-md hover:border-blue-300 hover:ring-1 hover:ring-blue-300">
                <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600">
                  {topic.title} &rarr;
                </h2>
                <p className="text-gray-600">
                  {topic.desc}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
