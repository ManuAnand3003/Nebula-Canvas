import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { Inter, Caveat } from 'next/font/google';
import PwaLoader from '@/components/pwa-loader';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const caveat = Caveat({ subsets: ['latin'], variable: '--font-caveat' });

export const metadata: Metadata = {
  title: 'Nebula Desk',
  description: 'Notes, tasks, and drawings, all in one offline-first app.',
  manifest: '/manifest.json',
  icons: {
    icon: '/nebula-icon.jpg',
    apple: '/icons/icon-192x192.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta name="theme-color" content="#0B0F19" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png"></link>
  {/* Use generated favicon.ico (cache-busted) and fallbacks */}
  <link rel="icon" href="/favicon.ico?v=ce7a424d" />
  <link rel="icon" href="/nebula-icon.jpg" />
      </head>
      <body className={`${inter.variable} ${caveat.variable} font-body antialiased`}>
        {children}
        <Toaster />
        <PwaLoader />
      </body>
    </html>
  );
}
