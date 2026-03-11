import { NextRequest, NextResponse } from 'next/server';
import { getData, setData } from '@/lib/db';
import { Product, Sale, CartItem } from '@/lib/types';

// GET /api/sales - Get all sales
export async function GET() {
  try {
    const sales = await getData<Sale[]>('sales') || [];
    return NextResponse.json({ success: true, data: sales });
  } catch (error) {
    console.error('Error fetching sales:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch sales' },
      { status: 500 }
    );
  }
}

// POST /api/sales - Create new sale
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items } = body;

    if (!items || items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Cart is empty' },
        { status: 400 }
      );
    }

    // Calculate total
    const total = items.reduce(
      (sum: number, item: CartItem) => sum + item.price * item.quantity,
      0
    );

    // Create sale record
    const sale: Sale = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      items,
      total,
    };

    // Update inventory stock
    const inventory = await getData<Product[]>('inventory') || [];
    const updatedInventory = inventory.map(product => {
      const cartItem = items.find((item: CartItem) => item.id === product.id);
      if (cartItem) {
        return {
          ...product,
          stock: product.stock - cartItem.quantity,
        };
      }
      return product;
    });

    // Save updated inventory
    await setData('inventory', updatedInventory);

    // Save sale
    const sales = await getData<Sale[]>('sales') || [];
    sales.unshift(sale);
    await setData('sales', sales);

    return NextResponse.json({ success: true, data: sale });
  } catch (error) {
    console.error('Error creating sale:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create sale' },
      { status: 500 }
    );
  }
}
