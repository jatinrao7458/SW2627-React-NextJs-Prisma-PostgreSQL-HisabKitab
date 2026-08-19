import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const LOGS_FILE = path.join(process.cwd(), 'cron_logs.json');

// Helper to get logs
function getLogs() {
  if (!fs.existsSync(LOGS_FILE)) {
    fs.writeFileSync(LOGS_FILE, JSON.stringify([]));
  }
  return JSON.parse(fs.readFileSync(LOGS_FILE, 'utf-8'));
}

// GET: Fetch cron logs
export async function GET() {
  try {
    const logs = getLogs();
    return NextResponse.json({ success: true, data: logs });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch logs' }, { status: 500 });
  }
}

// POST: Trigger cron job
export async function POST(request: Request) {
  try {
    // In Vercel, cron jobs hit an endpoint via a GET/POST request with an Authorization header
    // Here we simulate the triggered job
    
    // Perform some mock scheduled task
    const logs = getLogs();
    const newLog = {
      id: Math.random().toString(36).substring(2, 15),
      message: 'Cron job executed successfully. Sent daily summary emails.',
      timestamp: new Date().toISOString(),
    };
    
    logs.unshift(newLog); // Add to beginning
    
    // Keep only last 10 logs
    if (logs.length > 10) {
      logs.pop();
    }
    
    fs.writeFileSync(LOGS_FILE, JSON.stringify(logs, null, 2));
    
    return NextResponse.json({ success: true, data: newLog }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to execute cron job' }, { status: 500 });
  }
}
