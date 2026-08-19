export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const { task } = await request.json();
  const encoder = new TextEncoder();
  
  const customReadable = new ReadableStream({
    async start(controller) {
      const sendStep = (message: string) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ message })}\n\n`));
      };

      try {
        sendStep(`Received task: "${task}"`);
        await new Promise(r => setTimeout(r, 1000));
        
        sendStep('Agent analyzing the intent...');
        await new Promise(r => setTimeout(r, 1500));
        
        sendStep('Decision: Needs to search the web for current context.');
        await new Promise(r => setTimeout(r, 1000));
        
        sendStep('Tool Call: web_search({ query: "' + task + '" })');
        await new Promise(r => setTimeout(r, 2000));
        
        sendStep('Tool Result: Found 5 relevant articles.');
        await new Promise(r => setTimeout(r, 1000));
        
        sendStep('Decision: Synthesizing final answer from tool results...');
        await new Promise(r => setTimeout(r, 1500));
        
        sendStep('FINAL_ANSWER: Based on my multi-step analysis, this is the simulated final output for your request. The agent successfully utilized external tools to gather context.');
      } catch (err) {
        sendStep('Error processing request.');
      } finally {
        controller.close();
      }
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
