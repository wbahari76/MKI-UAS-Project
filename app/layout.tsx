import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/contexts/AuthContext';
import { SocketProvider } from '@/contexts/SocketContext';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://jalavive.org'),
  title: 'JALA VIVE - Connected Communities. Sustained Lives.',
  description: 'A social impact platform that bridges organizations with volunteers in one collaborative ecosystem. Create impact, join causes, and transform communities together.',
  keywords: ['volunteer', 'social impact', 'community', 'NGO', 'non-profit', 'charity', 'Indonesia'],
  authors: [{ name: 'JALA VIVE Team' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://jalavive.org',
    siteName: 'JALA VIVE',
    title: 'JALA VIVE - Connected Communities. Sustained Lives.',
    description: 'A social impact platform that bridges organizations with volunteers in one collaborative ecosystem.',
    images: [
      {
        url: 'https://images.pexels.com/photos/6646916/pexels-photo-6646916.jpeg?auto=compress&cs=tinysrgb&w=1200',
        width: 1200,
        height: 630,
        alt: 'JALA VIVE - Volunteer Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JALA VIVE - Connected Communities. Sustained Lives.',
    description: 'A social impact platform that bridges organizations with volunteers.',
    images: ['https://images.pexels.com/photos/6646916/pexels-photo-6646916.jpeg?auto=compress&cs=tinysrgb&w=1200'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <AuthProvider>
          <SocketProvider>
            {children}
            <Toaster position="top-right" richColors closeButton />
          </SocketProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
