import { getSession } from "@/lib/session";
import { clientsStore } from "@/lib/store/clients";

export async function Header() {
  const session = await getSession();
  
  if (!session || !session.clientId) {
    return null;
  }
  
  const client = await clientsStore.findById(session.clientId);
  if (!client) {
    return null;
  }
  
  const initial = client.name.charAt(0).toUpperCase();

  return (
    <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-6">
      <div className="flex items-center">
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold mr-3">
          {initial}
        </div>
        <div>
          <h1 className="text-lg font-bold text-slate-800 leading-tight">{client.name}</h1>
          <div className="flex items-center text-xs text-slate-500">
            <span className={`inline-block w-2 h-2 rounded-full mr-1.5 ${client.status === 'active' ? 'bg-whatsapp' : 'bg-red-500'}`}></span>
            {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
            <span className="mx-2">•</span>
            Last updated: {new Date(client.updatedAt).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-4 text-sm text-slate-600">
        <div>
          <span className="text-slate-400 mr-1">Contact:</span>
          <span>{client.email}</span>
        </div>
      </div>
    </header>
  );
}
