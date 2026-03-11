import { NextResponse } from 'next/server';
import { getData } from '@/lib/db';
import { Product, Sale, DashboardStats } from '@/lib/types';

// GET /api/stats - Get dashboard statistics
export async function GET() {
  try {
    const inventory = await getData<Product[]>('inventory') || [];
    const sales = await getData<Sale[]>('sales') || [];

    const stats: DashboardStats = {
      totalProducts: inventory.length,
      lowStockItems: inventory.filter(p => p.stock < 10).length,
      totalSales: sales.length,
      totalRevenue: sales.reduce((sum, sale) => sum + sale.total, 0),
    };

    return NextResponse.json({ success: true, data: stats });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
