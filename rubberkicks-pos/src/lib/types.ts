export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  size: string;
  color: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Sale {
  id: string;
  date: string;
  items: CartItem[];
  total: number;
}

export interface DashboardStats {
  totalProducts: number;
  lowStockItems: number;
  totalSales: number;
  totalRevenue: number;
}
