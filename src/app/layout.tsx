import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Happy Birthday, Shadow Khadija! 🎂✨',
  description: 'A magical birthday surprise adventure for Shadow Khadija 🎂✨',
  openGraph: {
    title: 'Happy Birthday, Shadow Khadija! 🎂',
    description: 'A magical birthday surprise adventure 🎂✨',
    type: 'website',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full overflow-hidden">{children}</body>
    </html>
  );
}
