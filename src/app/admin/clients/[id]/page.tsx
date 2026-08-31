import { getSession } from "@/lib/session";
import { clientsStore } from "@/lib/store/clients";
import { campaignsStore } from "@/lib/store/campaigns";
import { wabaStore } from "@/lib/store/waba";
import { usersStore } from "@/lib/store/users";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { EditClientForm } from "@/components/admin/ClientForms";
import { CampaignListActions } from "@/components/admin/CampaignForms";
import { WabaListActions } from "@/components/admin/WabaForms";

export default async function AdminClientDetail({ params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session || session.role !== 'ADMIN') {
    redirect('/admin/login');
  }

  // Next 16+ requires awaiting params
  const id = (await params).id;
  const client = clientsStore.findById(id);

  if (!client) {
    return <div className="p-6 text-center text-slate-500">Client not found.</div>;
  }

  const user = usersStore.findByClientId(client.id);
  const campaigns = campaignsStore.findByClientId(client.id);
  const wabaAccounts = wabaStore.findByClientId(client.id);

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center space-x-4 mb-2">
        <Link href="/admin" className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-500 hover:text-slate-900 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h2 className="text-2xl font-bold text-slate-800 flex items-center">
          {client.name}
          <span className="ml-3 px-2.5 py-1 text-xs font-medium rounded-full bg-slate-100 text-slate-600 border border-slate-200">
            {client.id}
          </span>
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Client Profile */}
        <div className="card bg-white p-6 col-span-1 border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-4 pb-2 border-b border-slate-100">Client Details</h3>
          <EditClientForm client={client} user={user} />
        </div>

        {/* WABA & Campaigns */}
        <div className="col-span-1 lg:col-span-2 space-y-6">
          
          {/* Campaigns */}
          <div className="card bg-white border border-slate-200 overflow-hidden">
            <CampaignListActions client={client} campaigns={campaigns} />
          </div>

          {/* WABA */}
          <div className="card bg-white border border-slate-200 overflow-hidden">
            <WabaListActions client={client} wabas={wabaAccounts} />
          </div>

        </div>
      </div>
    </div>
  );
}
