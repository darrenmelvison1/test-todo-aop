import { NextRequest, NextResponse } from 'next/server';
import { TodoItem } from '@/types';
import { v4 as uuidv4 } from 'uuid';

// In-memory store (would be replaced with a database in a real app)
let todos: TodoItem[] = [
  {
    id: '1',
    text: 'Complete project proposal',
    completed: true,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    completedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    dueDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    category: 'work',
    priority: 'high',
    tags: ['project', 'documentation'],
    notes: 'Include all project requirements and timeline estimates',
    assignedTo: 'user1'
  },
  {
    id: '2',
    text: 'Schedule team meeting',
    completed: true,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    completedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    dueDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    category: 'work',
    priority: 'medium',
    tags: ['meeting', 'team'],
    notes: 'Discuss project timeline and assign tasks',
    assignedTo: 'user1'
  },
  {
    id: '3',
    text: 'Research new technologies',
    completed: false,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    completedAt: null,
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    category: 'work',
    priority: 'medium',
    tags: ['research', 'technology'],
    notes: 'Look into Next.js 15 features and how they can benefit our projects',
    assignedTo: 'user2'
  },
  {
    id: '4',
    text: 'Buy groceries',
    completed: false,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    completedAt: null,
    dueDate: new Date(Date.now()).toISOString(),
    category: 'personal',
    priority: 'low',
    tags: ['errands', 'shopping'],
    notes: 'Milk, eggs, bread, vegetables',
    assignedTo: null
  },
  {
    id: '5',
    text: 'Workout session',
    completed: true,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    completedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    dueDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    category: 'health',
    priority: 'medium',
    tags: ['exercise', 'health'],
    notes: '30 minutes cardio, 30 minutes strength training',
    assignedTo: null
  },
  {
    id: '6',
    text: 'Prepare presentation',
    completed: false,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    completedAt: null,
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    category: 'work',
    priority: 'high',
    tags: ['presentation', 'client'],
    notes: 'Focus on project results and future opportunities',
    assignedTo: 'user1'
  },
  {
    id: '7',
    text: 'Pay bills',
    completed: false,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    completedAt: null,
    dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
    category: 'finance',
    priority: 'high',
    tags: ['bills', 'finance'],
    notes: 'Electricity, internet, and water bills',
    assignedTo: null
  },
  {
    id: '8',
    text: 'Call parents',
    completed: false,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    completedAt: null,
    dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
    category: 'personal',
    priority: 'medium',
    tags: ['family', 'call'],
    notes: "Ask about dad's birthday plans",
    assignedTo: null
  }
];

// GET all todos or filtered todos
export async function GET(request: NextRequest) {
  try {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const { searchParams } = new URL(request.url);
    
    // Apply filters if provided
    let filteredTodos = [...todos];
    
    // Filter by completion status
    const completed = searchParams.get('completed');
    if (completed !== null) {
      const isCompleted = completed === 'true';
      filteredTodos = filteredTodos.filter(todo => todo.completed === isCompleted);
    }
    
    // Filter by category
    const category = searchParams.get('category');
    if (category) {
      filteredTodos = filteredTodos.filter(todo => todo.category === category);
    }
    
    // Filter by priority
    const priority = searchParams.get('priority');
    if (priority) {
      filteredTodos = filteredTodos.filter(todo => todo.priority === priority);
    }
    
    // Filter by assignee
    const assignedTo = searchParams.get('assignedTo');
    if (assignedTo) {
      filteredTodos = filteredTodos.filter(todo => todo.assignedTo === assignedTo);
    }
    
    // Search by text
    const search = searchParams.get('search');
    if (search) {
      const searchLower = search.toLowerCase();
      filteredTodos = filteredTodos.filter(todo => 
        todo.text.toLowerCase().includes(searchLower) || 
        todo.notes.toLowerCase().includes(searchLower)
      );
    }
    
    return NextResponse.json(filteredTodos);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch todos' },
      { status: 500 }
    );
  }
}

// POST a new todo
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    if (!body.text) {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      );
    }
    
    const newTodo: TodoItem = {
      id: uuidv4(),
      text: body.text,
      completed: body.completed || false,
      createdAt: new Date().toISOString(),
      completedAt: body.completed ? new Date().toISOString() : null,
      dueDate: body.dueDate || null,
      category: body.category || 'uncategorized',
      priority: body.priority || 'medium',
      tags: body.tags || [],
      notes: body.notes || '',
      assignedTo: body.assignedTo || null
    };
    
    todos.push(newTodo);
    
    return NextResponse.json(newTodo, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create todo' },
      { status: 500 }
    );
  }
}

// PUT to update a todo
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    
    if (!body.id) {
      return NextResponse.json(
        { error: 'Todo ID is required' },
        { status: 400 }
      );
    }
    
    const todoIndex = todos.findIndex(todo => todo.id === body.id);
    
    if (todoIndex === -1) {
      return NextResponse.json(
        { error: 'Todo not found' },
        { status: 404 }
      );
    }
    
    // Check if the todo's completed status is being updated
    const completedChanged = 
      body.completed !== undefined && 
      body.completed !== todos[todoIndex].completed;
    
    const updatedTodo = {
      ...todos[todoIndex],
      ...body,
      // If completed status changed to true, update completedAt
      completedAt: completedChanged && body.completed 
        ? new Date().toISOString() 
        : completedChanged && !body.completed 
          ? null 
          : todos[todoIndex].completedAt
    };
    
    todos[todoIndex] = updatedTodo;
    
    return NextResponse.json(updatedTodo);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update todo' },
      { status: 500 }
    );
  }
}

// DELETE a todo
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Todo ID is required' },
        { status: 400 }
      );
    }
    
    const todoIndex = todos.findIndex(todo => todo.id === id);
    
    if (todoIndex === -1) {
      return NextResponse.json(
        { error: 'Todo not found' },
        { status: 404 }
      );
    }
    
    const deletedTodo = todos[todoIndex];
    todos.splice(todoIndex, 1);
    
    return NextResponse.json(deletedTodo);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete todo' },
      { status: 500 }
    );
  }
} 