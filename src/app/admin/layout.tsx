import { getSession } from "@/lib/session";
import { LogOut, Settings, Users, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { headers } from "next/headers";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  
  // Quick way to know if we are on the login page
  const headersList = await headers();
  const pathname = headersList.get("x-invoke-path") || "";
  
  if (!session || session.role !== 'ADMIN') {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-slate-900 text-white h-16 flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center space-x-2">
          <Settings className="w-5 h-5 text-emerald-400" />
          <h1 className="font-bold text-lg">Turiya Admin Console</h1>
        </div>
        <div className="flex items-center space-x-6 text-sm text-slate-300">
          <Link href="/admin" className="hover:text-white flex items-center"><Users className="w-4 h-4 mr-1.5" /> Clients</Link>
          <a href="/api/auth/logout" className="hover:text-white flex items-center"><LogOut className="w-4 h-4 mr-1.5" /> Logout</a>
        </div>
      </header>
      <main className="flex-1 p-6 max-w-7xl w-full mx-auto">
        {children}
      </main>
    </div>
  );
}
