import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'RubberKicks POS - Inventory & Sales Management',
  description: 'Complete point of sale and inventory management system for rubber shoe shops',
  keywords: 'POS, inventory management, sales, rubber shoes, retail',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
