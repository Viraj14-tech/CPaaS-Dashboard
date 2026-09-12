import { getSession } from "@/lib/session";
import { clientsStore } from "@/lib/store/clients";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Search, Edit } from "lucide-react";
import { CreateClientButton } from "@/components/admin/ClientForms";

export default async function AdminDashboard() {
  const session = await getSession();
  if (!session || session.role !== 'ADMIN') {
    redirect('/admin/login');
  }

  const clients = await clientsStore.getAll();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Client Management</h2>
          <p className="text-slate-500 text-sm mt-1">Manage client access, campaigns, and WABA connections.</p>
        </div>
        <CreateClientButton />
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
          <div className="relative w-64">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input type="text" placeholder="Search clients..." className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-md text-sm focus:ring-slate-900 focus:border-slate-900" />
          </div>
        </div>
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[11px] tracking-wider">
            <tr>
              <th className="px-6 py-3">Client</th>
              <th className="px-6 py-3">Contact</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Last Updated</th>
              <th className="px-6 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {clients.map(client => (
              <tr key={client.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-semibold text-slate-900">{client.name}</div>
                  <div className="text-xs text-slate-500 mt-0.5">ID: {client.id}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-slate-800">{client.contactPerson}</div>
                  <div className="text-xs text-slate-500">{client.email}</div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                    client.status === 'active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-600 border border-slate-200'
                  }`}>
                    {client.status.toUpperCase()}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-500">
                  {new Date(client.updatedAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-right">
                  <Link href={`/admin/clients/${client.id}`} className="inline-flex items-center text-sm text-slate-600 hover:text-slate-900 font-medium px-3 py-1.5 border border-slate-200 rounded-md hover:bg-slate-50">
                    <Edit className="w-3.5 h-3.5 mr-1.5" /> Manage
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
