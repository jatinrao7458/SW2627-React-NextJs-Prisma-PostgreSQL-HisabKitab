import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Use a local JSON file to mock a MongoDB database
const DB_FILE = path.join(process.cwd(), 'db.json');

// Helper to get items
function getItems() {
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify([]));
  }
  const data = fs.readFileSync(DB_FILE, 'utf-8');
  return JSON.parse(data);
}

// Helper to save items
function saveItems(items: any[]) {
  fs.writeFileSync(DB_FILE, JSON.stringify(items, null, 2));
}

// GET: Read items
export async function GET() {
  try {
    const items = getItems();
    return NextResponse.json({ success: true, data: items });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch items' }, { status: 500 });
  }
}

// POST: Create item (Simulating MongoDB Insert)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const items = getItems();
    
    // Simulate MongoDB ObjectId
    const newItem = {
      _id: Math.random().toString(36).substring(2, 15),
      ...body,
      createdAt: new Date().toISOString(),
    };
    
    items.push(newItem);
    saveItems(items);
    
    return NextResponse.json({ success: true, data: newItem }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to create item' }, { status: 500 });
  }
}

// PUT: Update item
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { _id, ...updates } = body;
    
    if (!_id) {
      return NextResponse.json({ success: false, error: 'Missing _id' }, { status: 400 });
    }
    
    const items = getItems();
    const index = items.findIndex((item: any) => item._id === _id);
    
    if (index === -1) {
      return NextResponse.json({ success: false, error: 'Item not found' }, { status: 404 });
    }
    
    items[index] = { ...items[index], ...updates };
    saveItems(items);
    
    return NextResponse.json({ success: true, data: items[index] });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update item' }, { status: 500 });
  }
}

// DELETE: Delete item
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ success: false, error: 'Missing id' }, { status: 400 });
    }
    
    const items = getItems();
    const filtered = items.filter((item: any) => item._id !== id);
    
    if (items.length === filtered.length) {
      return NextResponse.json({ success: false, error: 'Item not found' }, { status: 404 });
    }
    
    saveItems(filtered);
    
    return NextResponse.json({ success: true, message: 'Deleted successfully' });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to delete item' }, { status: 500 });
  }
}
