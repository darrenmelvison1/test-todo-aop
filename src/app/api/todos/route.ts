import { NextResponse } from 'next/server';
import { TodoItem } from '../../../types/todo';

// This would be replaced with actual database calls in a real app
const sampleTodos: TodoItem[] = [
  {
    id: '1',
    text: 'Review project requirements',
    completed: true,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    completedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    category: 'Work',
    priority: 'high',
    estimatedTime: 60,
    actualTime: 45,
  },
  {
    id: '2',
    text: 'Setup development environment',
    completed: true,
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    completedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    category: 'Work',
    priority: 'medium',
    estimatedTime: 30,
    actualTime: 40,
  },
  {
    id: '3',
    text: 'Create component structure',
    completed: true,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    completedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    category: 'Work',
    priority: 'medium',
    estimatedTime: 90,
    actualTime: 100,
  },
  {
    id: '4',
    text: 'Implement API integration',
    completed: true,
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    completedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    category: 'Work',
    priority: 'high',
    estimatedTime: 120,
    actualTime: 90,
  },
  {
    id: '5',
    text: 'Write unit tests',
    completed: true,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    category: 'Work',
    priority: 'medium',
    estimatedTime: 60,
    actualTime: 75,
  },
  {
    id: '6',
    text: 'Fix styling issues',
    completed: true,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    category: 'Work',
    priority: 'low',
    estimatedTime: 45,
    actualTime: 30,
  },
  {
    id: '7',
    text: 'Document code',
    completed: false,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    completedAt: null,
    category: 'Work',
    priority: 'low',
    estimatedTime: 60,
    actualTime: null,
  },
  {
    id: '8',
    text: 'Buy groceries',
    completed: true,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    completedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    category: 'Personal',
    priority: 'medium',
    estimatedTime: 45,
    actualTime: 50,
  },
  {
    id: '9',
    text: 'Call mom',
    completed: true,
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    completedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    category: 'Personal',
    priority: 'high',
    estimatedTime: 30,
    actualTime: 45,
  },
  {
    id: '10',
    text: 'Schedule dentist appointment',
    completed: false,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    completedAt: null,
    category: 'Health',
    priority: 'medium',
    estimatedTime: 15,
    actualTime: null,
  },
  {
    id: '11',
    text: 'Go for a run',
    completed: true,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    category: 'Health',
    priority: 'medium',
    estimatedTime: 40,
    actualTime: 45,
  },
  {
    id: '12',
    text: 'Read book chapter',
    completed: false,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    completedAt: null,
    category: 'Personal',
    priority: 'low',
    estimatedTime: 60,
    actualTime: null,
  },
  {
    id: '13',
    text: 'Plan weekend trip',
    completed: false,
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    completedAt: null,
    category: 'Personal',
    priority: 'low',
    estimatedTime: 90,
    actualTime: null,
  },
  {
    id: '14',
    text: 'Prepare presentation',
    completed: true,
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    completedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    category: 'Work',
    priority: 'high',
    estimatedTime: 120,
    actualTime: 150,
  },
  {
    id: '15',
    text: 'Pay bills',
    completed: true,
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    completedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    category: 'Finance',
    priority: 'high',
    estimatedTime: 30,
    actualTime: 20,
  },
];

export async function GET() {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return NextResponse.json(sampleTodos);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    if (!body.text) {
      return new NextResponse(
        JSON.stringify({ message: 'Text is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // In a real app, we would save to database and get the ID from there
    const newTodo: TodoItem = {
      id: Math.random().toString(36).substring(2, 9),
      text: body.text,
      completed: false,
      createdAt: new Date().toISOString(),
      completedAt: null,
      category: body.category || 'Uncategorized',
      priority: body.priority || 'medium',
      estimatedTime: body.estimatedTime || null,
      actualTime: null,
    };
    
    // This would push to the database in a real app
    // sampleTodos.push(newTodo);
    
    return NextResponse.json(newTodo, { status: 201 });
  } catch (error) {
    console.error('Error creating todo:', error);
    return new NextResponse(
      JSON.stringify({ message: 'Internal Server Error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
} 