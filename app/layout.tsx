import './globals.css';
import { Inter } from 'next/font/google';
import SessionProviderWrapper from '@/app/components/SessionProviderWrapper';
import WebSocketInitializer from '@/app/components/WebSocketInitializer';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'OpenDOCS',
  description: 'Plateforme de gestion de documents PDF avec IA',
  icons: {
    icon: '/favicon.png', // ✅ Ajoute ceci
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <SessionProviderWrapper>
          <WebSocketInitializer />
          <Toaster position="top-right" />
          {children}
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
