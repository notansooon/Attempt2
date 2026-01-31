import type { Metadata } from 'next';
import './globals.css';
import { Navigation } from '@/components/Navigation';

export const metadata: Metadata = {
  title: 'Postpartum Navigator',
  description: 'Your supportive companion through the postpartum journey',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-calm-50">
        <div className="flex min-h-screen">
          <Navigation />
          <main className="flex-1 p-8 ml-64">
            <div className="max-w-5xl mx-auto">{children}</div>
          </main>
        </div>
      </body>
    </html>
  );
}
