'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';
import ChatWidget from './ChatWidget';

export default function LayoutWrapper({ children }) {
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith('/admin');

  return (
    <>
      {!isAdminPage && <Navbar />}
      <main className="min-h-screen">
        {children}
      </main>
      {!isAdminPage && <Footer />}
      {!isAdminPage && <ChatWidget />}
    </>
  );
}
