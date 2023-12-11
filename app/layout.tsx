import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Notification-panel',
  description: 'Real time notification',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
