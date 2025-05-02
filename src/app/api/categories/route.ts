import { NextRequest, NextResponse } from 'next/server';
import { TodoCategory } from '@/types';

// In-memory store (would be replaced with a database in a real app)
let categories: TodoCategory[] = [
  {
    id: 'work',
    name: 'Work',
    color: '#4F46E5', // Indigo
    icon: 'briefcase'
  },
  {
    id: 'personal',
    name: 'Personal',
    color: '#10B981', // Emerald
    icon: 'user'
  },
  {
    id: 'health',
    name: 'Health',
    color: '#EF4444', // Red
    icon: 'heart'
  },
  {
    id: 'finance',
    name: 'Finance',
    color: '#F59E0B', // Amber
    icon: 'dollar-sign'
  },
  {
    id: 'education',
    name: 'Education',
    color: '#8B5CF6', // Violet
    icon: 'book'
  },
  {
    id: 'shopping',
    name: 'Shopping',
    color: '#EC4899', // Pink
    icon: 'shopping-bag'
  },
  {
    id: 'uncategorized',
    name: 'Uncategorized',
    color: '#6B7280', // Gray
    icon: 'tag'
  }
];

// GET all categories
export async function GET() {
  try {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
    return NextResponse.json(categories);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

// POST a new category
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    if (!body.name) {
      return NextResponse.json(
        { error: 'Category name is required' },
        { status: 400 }
      );
    }
    
    // Generate an ID from the name if not provided
    const id = body.id || body.name.toLowerCase().replace(/\s+/g, '-');
    
    // Check if category with this ID already exists
    if (categories.some(category => category.id === id)) {
      return NextResponse.json(
        { error: 'Category with this ID already exists' },
        { status: 400 }
      );
    }
    
    const newCategory: TodoCategory = {
      id,
      name: body.name,
      color: body.color || '#6B7280', // Default gray
      icon: body.icon
    };
    
    categories.push(newCategory);
    
    return NextResponse.json(newCategory, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    );
  }
}

// PUT to update a category
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    
    if (!body.id) {
      return NextResponse.json(
        { error: 'Category ID is required' },
        { status: 400 }
      );
    }
    
    const categoryIndex = categories.findIndex(category => category.id === body.id);
    
    if (categoryIndex === -1) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }
    
    const updatedCategory = {
      ...categories[categoryIndex],
      ...body
    };
    
    categories[categoryIndex] = updatedCategory;
    
    return NextResponse.json(updatedCategory);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update category' },
      { status: 500 }
    );
  }
}

// DELETE a category
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Category ID is required' },
        { status: 400 }
      );
    }
    
    // Prevent deletion of default uncategorized category
    if (id === 'uncategorized') {
      return NextResponse.json(
        { error: 'Cannot delete the default uncategorized category' },
        { status: 400 }
      );
    }
    
    const categoryIndex = categories.findIndex(category => category.id === id);
    
    if (categoryIndex === -1) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }
    
    const deletedCategory = categories[categoryIndex];
    categories.splice(categoryIndex, 1);
    
    return NextResponse.json(deletedCategory);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete category' },
      { status: 500 }
    );
  }
} 