import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/app/globals.css';
import { ReactNode } from 'react';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Selectable Table Cells',
  description: 'Created using NextJS',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main className="flex h-screen flex-col items-center justify-between p-6 pt-24 max-w-5xl mx-auto">
          <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-2xl">
            <h1 className="fixed left-0 top-0 flex w-full text-center justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 px-4 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit">
              Cats Table with selectable cells
            </h1>
          </div>
          <div className="text-center justify-center grow flex flex-col w-full">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
