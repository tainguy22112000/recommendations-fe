import { Outlet } from 'react-router-dom';

import BottomNav from './BottomNav';

// Full-height column: scrolling content plus the bottom nav.
//
// `min-h-0` on the content area is load-bearing — without it a flex child with its own
// scroll container refuses to shrink and pushes the nav off-screen.
export default function AppShell() {
  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <div className="mx-auto flex min-h-0 w-full max-w-[480px] flex-1 flex-col">
        <Outlet />
      </div>
      <BottomNav />
    </div>
  );
}
