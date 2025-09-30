import { AppSidebar } from '@/components/layout/app-sidebar';
import { AppHeader } from '@/components/layout/app-header';
import { SidebarProvider } from '@/components/ui/sidebar';
import { TrackingProvider } from '@/context/tracking-provider';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <TrackingProvider>
        <div className="flex h-screen bg-background">
          <AppSidebar />
          <div className="flex flex-1 flex-col overflow-hidden">
            <AppHeader />
            <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-8">
              {children}
            </main>
          </div>
        </div>
      </TrackingProvider>
    </SidebarProvider>
  );
}
