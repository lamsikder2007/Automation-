import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'AI Commerce Automation SaaS',
  description: 'Multi-tenant e-commerce AI customer support and sales automation connecting Facebook Messenger, Google Sheets, Google Drive, and Google Calendar.',
  openGraph: {
    title: 'AI Commerce Automation SaaS',
    description: 'Multi-tenant e-commerce AI customer support and sales automation connecting Facebook Messenger, Google Sheets, Google Drive, and Google Calendar.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Commerce Automation SaaS',
    description: 'Multi-tenant e-commerce AI customer support and sales automation connecting Facebook Messenger, Google Sheets, Google Drive, and Google Calendar.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
