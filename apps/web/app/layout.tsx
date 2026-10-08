import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Ethiopian Orthodox Tewahedo Digital Platform',
  description:
    'Free digital religious, cultural, and church-service platform preserving Ethiopian Orthodox Tewahedo heritage, Mezmur, literature, and church directory.',
  keywords: ['EOTC', 'Ethiopian Orthodox', 'Tewahedo', 'Mezmur', 'Ge\'ez', 'Amharic', 'Orthodox Books'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col antialiased selection:bg-eotc-gold selection:text-black">
        {children}
      </body>
    </html>
  );
}
