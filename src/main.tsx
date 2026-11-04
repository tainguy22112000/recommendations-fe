import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router-dom';
import { ThemeProvider } from 'next-themes';
import { Analytics } from '@vercel/analytics/react';

import { Toaster } from '@/components/ui/sonner';
import '@/i18n';
import { queryClient } from '@/lib/query-client';
import { router } from '@/router';
import './index.css';

const root = document.getElementById('root');
if (!root) {
  throw new Error('#root element is missing from index.html');
}

createRoot(root).render(
  <StrictMode>
    {/* R1 ships light only. The dark tokens exist but are unaudited until phase 8 —
        drop forcedTheme then and let defaultTheme="system" plus the Account toggle win. */}
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      forcedTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <Toaster />
        <Analytics />
      </QueryClientProvider>
    </ThemeProvider>
  </StrictMode>,
);
