import './globals.css';
import type { Metadata } from 'next';
import { AuthProvider } from '@/lib/auth';

export const metadata: Metadata = { title: 'Logistics Tracker', description: 'Delivery task management' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head><meta name="viewport" content="width=device-width, initial-scale=1" /></head>
      <body className="text-gray-900 antialiased"><AuthProvider>{children}</AuthProvider></body>
    </html>
  );
}
