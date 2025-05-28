import Sidebar from '@/app/components/Sidebar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex bg-[#f9fafb] min-h-screen font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col">{children}</div>
    </div>
  );
}
