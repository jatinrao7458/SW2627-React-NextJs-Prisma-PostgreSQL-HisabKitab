export const dynamic = 'force-dynamic';

export async function GET() {
  const encoder = new TextEncoder();
  
  const customReadable = new ReadableStream({
    start(controller) {
      // Send an initial message
      controller.enqueue(encoder.encode(`data: ${JSON.stringify({ message: 'Connected to real-time server', time: new Date().toLocaleTimeString() })}\n\n`));
      
      // Send a random stock price update every 2 seconds
      const interval = setInterval(() => {
        const update = {
          ticker: 'AAPL',
          price: (150 + Math.random() * 10).toFixed(2),
          time: new Date().toLocaleTimeString()
        };
        
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(update)}\n\n`));
      }, 2000);

      // Clean up when the client disconnects
      // In a real app, this might be handled differently depending on the deployment platform
      setTimeout(() => {
        clearInterval(interval);
        controller.close();
      }, 60000); // close after 1 min for demo safety
    }
  });

  return new Response(customReadable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
