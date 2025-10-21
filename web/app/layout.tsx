import './globals.css';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Providers } from '@/src/app/providers';
import { ServiceWorkerRegistration } from '@/src/components/service-worker-registration';

export const metadata: Metadata = {
  title: 'eFactura AO',
  description: 'PWA para emissão e submissão de faturas à AGT',
  manifest: '/manifest.json',
  themeColor: '#111827',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt">
      <body>
        <Providers>
          {children}
          <ServiceWorkerRegistration />
        </Providers>
      </body>
    </html>
  );
}
