import { NextRequest, NextResponse } from 'next/server';
import { TodoItem } from '@/types/todo';

// In-memory store for todos (in a real app, this would be a database)
let todos: TodoItem[] = [
  { id: 1, text: 'Learn Next.js', completed: true },
  { id: 2, text: 'Build a Todo app', completed: false },
  { id: 3, text: 'Deploy to production', completed: false },
];

/**
 * GET /api/todos
 * Retrieve all todos
 */
export async function GET() {
  return NextResponse.json(todos);
}

/**
 * POST /api/todos
 * Create a new todo
 */
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Validate input
    if (!data.text || typeof data.text !== 'string' || data.text.trim() === '') {
      return NextResponse.json(
        { error: 'Todo text is required' },
        { status: 400 }
      );
    }
    
    const newTodo: TodoItem = {
      id: Date.now(),
      text: data.text.trim(),
      completed: false,
    };
    
    todos.push(newTodo);
    
    return NextResponse.json(newTodo, { status: 201 });
  } catch (error) {
    console.error('Error creating todo:', error);
    return NextResponse.json(
      { error: 'Failed to create todo' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/todos
 * Update a todo's status
 */
export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Validate input
    if (!data.id || typeof data.id !== 'number') {
      return NextResponse.json(
        { error: 'Valid todo ID is required' },
        { status: 400 }
      );
    }
    
    if (typeof data.completed !== 'boolean') {
      return NextResponse.json(
        { error: 'Completed status must be a boolean' },
        { status: 400 }
      );
    }
    
    const todoIndex = todos.findIndex(todo => todo.id === data.id);
    
    if (todoIndex === -1) {
      return NextResponse.json(
        { error: 'Todo not found' },
        { status: 404 }
      );
    }
    
    todos[todoIndex] = {
      ...todos[todoIndex],
      completed: data.completed,
    };
    
    return NextResponse.json(todos[todoIndex]);
  } catch (error) {
    console.error('Error updating todo:', error);
    return NextResponse.json(
      { error: 'Failed to update todo' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/todos
 * Delete a todo by ID
 */
export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const idParam = url.searchParams.get('id');
    
    if (!idParam) {
      return NextResponse.json(
        { error: 'Todo ID is required' },
        { status: 400 }
      );
    }
    
    const id = Number(idParam);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Todo ID must be a valid number' },
        { status: 400 }
      );
    }
    
    const initialLength = todos.length;
    todos = todos.filter(todo => todo.id !== id);
    
    if (todos.length === initialLength) {
      return NextResponse.json(
        { error: 'Todo not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting todo:', error);
    return NextResponse.json(
      { error: 'Failed to delete todo' },
      { status: 500 }
    );
  }
} 