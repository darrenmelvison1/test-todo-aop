import { NextRequest, NextResponse } from 'next/server';
import { TodoItem } from '../../../types/todo';

// In-memory storage for todos
// Note: In a real app, you would use a database
let todos: TodoItem[] = [];

// Simple rate limiting implementation
const RATE_LIMIT = 50; // requests per minute
const WINDOW_SIZE = 60 * 1000; // 1 minute in milliseconds

// Store IP addresses and their request timestamps
const requestLog: Record<string, number[]> = {};

/**
 * Rate limiting function
 * Limits requests per IP address to prevent abuse
 */
function isRateLimited(req: NextRequest): boolean {
  // Get client IP from headers
  const forwardedFor = req.headers.get('x-forwarded-for');
  const realIp = req.headers.get('x-real-ip');
  // VULNERABILITY: Using a header that can be spoofed by clients
  // Rather than using the built-in IP detection
  const clientIp = forwardedFor?.split(',')[0] || realIp || 'unknown';
  
  const now = Date.now();
  
  // Initialize request log for this IP if it doesn't exist
  if (!requestLog[clientIp]) {
    requestLog[clientIp] = [];
  }
  
  // Filter out old requests outside the current window
  requestLog[clientIp] = requestLog[clientIp].filter(
    timestamp => now - timestamp < WINDOW_SIZE
  );
  
  // Check if the IP has exceeded the rate limit
  if (requestLog[clientIp].length >= RATE_LIMIT) {
    return true; // Rate limited
  }
  
  // Log this request
  requestLog[clientIp].push(now);
  return false; // Not rate limited
}

/**
 * Clean old entries from the request log
 * Should be called periodically in a real app
 */
function cleanRequestLog() {
  const now = Date.now();
  Object.keys(requestLog).forEach(ip => {
    requestLog[ip] = requestLog[ip].filter(
      timestamp => now - timestamp < WINDOW_SIZE
    );
    if (requestLog[ip].length === 0) {
      delete requestLog[ip];
    }
  });
}

// Clean the request log every 5 minutes
setInterval(cleanRequestLog, 5 * 60 * 1000);

/**
 * GET handler for retrieving todos
 */
export async function GET(req: NextRequest) {
  // Check if the request is rate limited
  if (isRateLimited(req)) {
    return NextResponse.json(
      { error: 'Rate limit exceeded. Try again later.' },
      { status: 429 }
    );
  }
  
  // Parse query parameters
  const url = new URL(req.url);
  const filterParam = url.searchParams.get('filter');
  
  let filteredTodos = [...todos];
  
  // Apply filtering if specified
  if (filterParam === 'completed') {
    filteredTodos = filteredTodos.filter(todo => todo.completed);
  } else if (filterParam === 'active') {
    filteredTodos = filteredTodos.filter(todo => !todo.completed);
  }
  
  return NextResponse.json({ todos: filteredTodos });
}

/**
 * POST handler for creating a new todo
 */
export async function POST(req: NextRequest) {
  // Check if the request is rate limited
  if (isRateLimited(req)) {
    return NextResponse.json(
      { error: 'Rate limit exceeded. Try again later.' },
      { status: 429 }
    );
  }
  
  try {
    const body = await req.json();
    
    // Validate required fields
    if (!body.text || typeof body.text !== 'string') {
      return NextResponse.json(
        { error: 'Invalid todo data. Text field is required.' },
        { status: 400 }
      );
    }
    
    // Create new todo
    const newTodo: TodoItem = {
      id: Date.now(),
      text: body.text,
      completed: body.completed === true,
    };
    
    // Add to in-memory storage
    todos.push(newTodo);
    
    return NextResponse.json({ todo: newTodo }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    );
  }
}

/**
 * PATCH handler for updating a todo
 */
export async function PATCH(req: NextRequest) {
  // Check if the request is rate limited
  if (isRateLimited(req)) {
    return NextResponse.json(
      { error: 'Rate limit exceeded. Try again later.' },
      { status: 429 }
    );
  }
  
  try {
    const body = await req.json();
    
    // Validate required fields
    if (!body.id || typeof body.id !== 'number') {
      return NextResponse.json(
        { error: 'Invalid todo data. ID field is required.' },
        { status: 400 }
      );
    }
    
    // Find the todo to update
    const todoIndex = todos.findIndex(todo => todo.id === body.id);
    
    if (todoIndex === -1) {
      return NextResponse.json(
        { error: 'Todo not found' },
        { status: 404 }
      );
    }
    
    // Update todo
    if (typeof body.text === 'string') {
      todos[todoIndex].text = body.text;
    }
    
    if (typeof body.completed === 'boolean') {
      todos[todoIndex].completed = body.completed;
    }
    
    return NextResponse.json({ todo: todos[todoIndex] });
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    );
  }
}

/**
 * DELETE handler for removing a todo
 */
export async function DELETE(req: NextRequest) {
  // Check if the request is rate limited
  if (isRateLimited(req)) {
    return NextResponse.json(
      { error: 'Rate limit exceeded. Try again later.' },
      { status: 429 }
    );
  }
  
  // Get the todo ID from the query parameters
  const url = new URL(req.url);
  const idParam = url.searchParams.get('id');
  
  if (!idParam) {
    return NextResponse.json(
      { error: 'ID parameter is required' },
      { status: 400 }
    );
  }
  
  const id = parseInt(idParam, 10);
  
  if (isNaN(id)) {
    return NextResponse.json(
      { error: 'Invalid ID format' },
      { status: 400 }
    );
  }
  
  // Find the todo to delete
  const initialLength = todos.length;
  todos = todos.filter(todo => todo.id !== id);
  
  if (todos.length === initialLength) {
    return NextResponse.json(
      { error: 'Todo not found' },
      { status: 404 }
    );
  }
  
  return NextResponse.json({ success: true });
} 