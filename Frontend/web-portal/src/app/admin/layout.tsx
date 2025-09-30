export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-background">
      <div className="flex flex-1 flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
