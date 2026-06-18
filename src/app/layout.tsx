import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'መቅደስ ባልትና | Mekedes Baltina - Authentic Ethiopian Foods & Spices',
  description: 'Mekedes Baltina (መቅደስ ባልትና) - Shop premium Ethiopian spices, berbere, mitmita, shiro, and traditional foods. Delivered fresh from Ethiopia to your doorstep. 100% authentic, natural ingredients.',
  keywords: 'Ethiopian food, berbere, mitmita, shiro, Ethiopian spices, mekedes baltina, መቅደስ ባልትና, mekedes.shop, Ethiopian grocery',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
  },
  themeColor: '#1e5631',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="am">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="format-detection" content="telephone=no" />
      </head>
      <body>{children}</body>
    </html>
  );
}
