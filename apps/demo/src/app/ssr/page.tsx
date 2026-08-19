// This is a Server Component (SSR by default in Next.js App Router)
// No 'use client' directive

export const dynamic = 'force-dynamic'; // Ensure it runs on every request for demo purposes

type Post = {
  id: number;
  title: string;
  body: string;
};

// This function runs entirely on the server during the request
async function getPosts(): Promise<Post[]> {
  // We use JSONPlaceholder for a mock public API
  const res = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=5', {
    // We can use Next.js fetch cache options here, but for demo we force no-store
    cache: 'no-store' 
  });
  
  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }
  
  return res.json();
}

export default async function SSRDemo() {
  const posts = await getPosts();
  const serverTime = new Date().toISOString();

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Server-Side Rendering (SSR)</h1>
      
      <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4 mb-8 text-indigo-900">
        <p className="font-semibold mb-2">Notice the fast initial load!</p>
        <p className="text-sm">
          This page was fully rendered on the server before being sent to your browser. 
          The data below was fetched securely on the backend. This improves SEO and perceived performance.
        </p>
        <p className="text-sm mt-2 font-mono bg-indigo-100 p-2 rounded inline-block">
          Rendered At: {serverTime}
        </p>
      </div>

      <div className="space-y-6">
        {posts.map((post) => (
          <div key={post.id} className="bg-white p-6 rounded-lg shadow-md text-black">
            <h2 className="text-xl font-bold capitalize mb-2">{post.title}</h2>
            <p className="text-gray-700">{post.body}</p>
            <div className="mt-4 text-xs text-gray-400 font-mono">
              Post ID: {post.id}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
