import { NextRequest, NextResponse } from 'next/server';
import { getData, setData, initializeData } from '@/lib/db';
import { Product } from '@/lib/types';

// Initialize data on first request
let initialized = false;

async function ensureInitialized() {
  if (!initialized) {
    await initializeData();
    initialized = true;
  }
}

// GET /api/inventory - Get all products
export async function GET() {
  try {
    await ensureInitialized();
    const inventory = await getData<Product[]>('inventory') || [];
    return NextResponse.json({ success: true, data: inventory });
  } catch (error) {
    console.error('Error fetching inventory:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch inventory' },
      { status: 500 }
    );
  }
}

// POST /api/inventory - Add new product
export async function POST(request: NextRequest) {
  try {
    await ensureInitialized();
    const body = await request.json();
    
    const newProduct: Product = {
      id: Date.now().toString(),
      name: body.name,
      category: body.category,
      price: parseFloat(body.price),
      stock: parseInt(body.stock),
      size: body.size,
      color: body.color,
    };

    const inventory = await getData<Product[]>('inventory') || [];
    inventory.push(newProduct);
    await setData('inventory', inventory);

    return NextResponse.json({ success: true, data: newProduct });
  } catch (error) {
    console.error('Error adding product:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to add product' },
      { status: 500 }
    );
  }
}

// PUT /api/inventory - Update product
export async function PUT(request: NextRequest) {
  try {
    await ensureInitialized();
    const body = await request.json();
    
    const inventory = await getData<Product[]>('inventory') || [];
    const index = inventory.findIndex(p => p.id === body.id);
    
    if (index === -1) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    inventory[index] = {
      ...body,
      price: parseFloat(body.price),
      stock: parseInt(body.stock),
    };

    await setData('inventory', inventory);
    return NextResponse.json({ success: true, data: inventory[index] });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

// DELETE /api/inventory - Delete product
export async function DELETE(request: NextRequest) {
  try {
    await ensureInitialized();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Product ID is required' },
        { status: 400 }
      );
    }

    const inventory = await getData<Product[]>('inventory') || [];
    const filtered = inventory.filter(p => p.id !== id);
    
    if (filtered.length === inventory.length) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    await setData('inventory', filtered);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}
