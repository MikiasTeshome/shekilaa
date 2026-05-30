import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'የባህላዊ ጥፋቄ | Habesha Market - Authentic Ethiopian Foods & Spices',
  description: 'Shop premium Ethiopian spices, berbere, mitmita, shiro, and traditional foods. Delivered fresh from Ethiopia to your doorstep. 100% authentic, natural ingredients.',
  keywords: 'Ethiopian food, berbere, mitmita, shiro, Ethiopian spices, habesha market, Ethiopian grocery',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="am">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>{children}</body>
    </html>
  );
}
