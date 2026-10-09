import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Ethiopian Orthodox Tewahedo Digital Platform | ብሔራዊ ዲጂታል መድረክ',
  description:
    'Free digital religious, cultural, and ecclesiastical platform preserving Ethiopian Orthodox Tewahedo heritage, Mezmur, literature, and church directory.',
  keywords: ['EOTC', 'Ethiopian Orthodox', 'Tewahedo', 'Mezmur', 'Ge\'ez', 'Amharic', 'Orthodox Books'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col antialiased bg-[#F0F0F0] text-[#191919]">
        {children}
      </body>
    </html>
  );
}
