import { NextRequest, NextResponse } from 'next/server';
import { User } from '@/types';

// In-memory store (would be replaced with a database in a real app)
let users: User[] = [
  {
    id: 'user1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    role: 'admin',
    preferences: {
      theme: 'light',
      notifications: true,
      defaultView: 'list',
      defaultCategory: 'work',
      defaultPriority: 'medium'
    }
  },
  {
    id: 'user2',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
    role: 'user',
    preferences: {
      theme: 'dark',
      notifications: true,
      defaultView: 'kanban'
    }
  },
  {
    id: 'user3',
    name: 'Mike Johnson',
    email: 'mike.johnson@example.com',
    avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
    role: 'user',
    preferences: {
      theme: 'system',
      notifications: false,
      defaultView: 'calendar',
      defaultCategory: 'personal'
    }
  }
];

// GET all users
export async function GET(request: NextRequest) {
  try {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role');
    
    if (role) {
      return NextResponse.json(users.filter(user => user.role === role));
    }
    
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

// GET user by ID
export async function GET_BY_ID(id: string) {
  // This is a utility function for internal API use, not exposed as an endpoint
  return users.find(user => user.id === id) || null;
}

// POST a new user
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.name || !body.email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      );
    }
    
    // Check if email is already in use
    if (users.some(user => user.email === body.email)) {
      return NextResponse.json(
        { error: 'Email is already in use' },
        { status: 400 }
      );
    }
    
    // Generate ID based on name if not provided
    const id = body.id || `user${users.length + 1}`;
    
    const newUser: User = {
      id,
      name: body.name,
      email: body.email,
      avatar: body.avatar,
      role: body.role || 'user',
      preferences: body.preferences || {
        theme: 'system',
        notifications: true,
        defaultView: 'list'
      }
    };
    
    users.push(newUser);
    
    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}

// PUT to update a user
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    
    if (!body.id) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }
    
    const userIndex = users.findIndex(user => user.id === body.id);
    
    if (userIndex === -1) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    // Check if email is being changed and already exists
    if (
      body.email && 
      body.email !== users[userIndex].email && 
      users.some(user => user.email === body.email)
    ) {
      return NextResponse.json(
        { error: 'Email is already in use' },
        { status: 400 }
      );
    }
    
    // Handle preferences update (merge instead of replace)
    let updatedPreferences = users[userIndex].preferences;
    if (body.preferences) {
      updatedPreferences = {
        ...updatedPreferences,
        ...body.preferences
      };
    }
    
    const updatedUser = {
      ...users[userIndex],
      ...body,
      preferences: updatedPreferences
    };
    
    users[userIndex] = updatedUser;
    
    return NextResponse.json(updatedUser);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  }
}

// DELETE a user
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }
    
    const userIndex = users.findIndex(user => user.id === id);
    
    if (userIndex === -1) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    const deletedUser = users[userIndex];
    users.splice(userIndex, 1);
    
    return NextResponse.json(deletedUser);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    );
  }
} 