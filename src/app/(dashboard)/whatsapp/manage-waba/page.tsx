import { getSession } from "@/lib/session";
import { wabaStore } from "@/lib/store/waba";
import { redirect } from "next/navigation";
import { Users, CheckCircle, Shield, Phone, Activity, Eye } from "lucide-react";

export default async function ManageWabaPage() {
  const session = await getSession();
  if (!session || !session.clientId) {
    redirect('/login');
  }

  const wabaAccounts = wabaStore.findByClientId(session.clientId);
  const totalAccounts = wabaAccounts.length;
  const activeAccounts = wabaAccounts.filter(w => w.phoneStatus === 'CONNECTED').length;
  const highQuality = wabaAccounts.filter(w => w.quality === 'High Quality').length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800">WhatsApp Business Accounts</h2>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-6 flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mb-3 text-slate-500">
            <Users className="w-6 h-6" />
          </div>
          <p className="text-sm font-medium text-slate-500 mb-1">Total Accounts</p>
          <p className="text-3xl font-bold text-primary">{totalAccounts}</p>
        </div>
        <div className="card p-6 flex flex-col items-center justify-center text-center border-t-4 border-t-whatsapp">
          <div className="w-12 h-12 rounded-full bg-mint flex items-center justify-center mb-3 text-whatsapp">
            <CheckCircle className="w-6 h-6" />
          </div>
          <p className="text-sm font-medium text-slate-500 mb-1">Active Accounts</p>
          <p className="text-3xl font-bold text-slate-900">{activeAccounts}</p>
        </div>
        <div className="card p-6 flex flex-col items-center justify-center text-center border-t-4 border-t-emerald-400">
          <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center mb-3 text-emerald-500">
            <Shield className="w-6 h-6" />
          </div>
          <p className="text-sm font-medium text-slate-500 mb-1">High Quality</p>
          <p className="text-3xl font-bold text-slate-900">{highQuality}</p>
        </div>
      </div>

      {/* WABA Accounts */}
      <div className="space-y-6">
        {wabaAccounts.map((waba) => (
          <div key={waba.id} className="card overflow-hidden">
            <div className="bg-slate-50 border-b border-slate-100 p-4 px-6 flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-slate-800 text-lg">{waba.displayName}</span>
                {waba.verificationStatus === 'Verified' && (
                  <CheckCircle className="w-4 h-4 text-whatsapp" />
                )}
              </div>
              <div className="flex space-x-2">
                <button className="text-slate-400 hover:text-primary transition-colors p-1">
                  <Eye className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-6 gap-x-8">
              <div>
                <p className="text-xs text-slate-500 mb-1">WABA Mobile No.</p>
                <p className="font-medium text-slate-900 flex items-center">
                  <Phone className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
                  {waba.mobileNumber}
                </p>
              </div>
              
              <div>
                <p className="text-xs text-slate-500 mb-1">Created On</p>
                <p className="font-medium text-slate-900">{waba.createdOn}</p>
              </div>
              
              <div>
                <p className="text-xs text-slate-500 mb-1">Expiry Date</p>
                <p className="font-medium text-slate-900">{waba.expiryDate}</p>
              </div>
              
              <div>
                <p className="text-xs text-slate-500 mb-1">Verification Status</p>
                <p className="font-medium text-slate-900">{waba.verificationStatus}</p>
              </div>
              
              <div>
                <p className="text-xs text-slate-500 mb-1">Phone Status</p>
                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                  waba.phoneStatus === 'CONNECTED' ? 'bg-mint text-primary' : 'bg-red-50 text-red-600'
                }`}>
                  {waba.phoneStatus}
                </span>
              </div>
              
              <div>
                <p className="text-xs text-slate-500 mb-1">Quality</p>
                <div className="flex items-center">
                  <span className={`w-2 h-2 rounded-full mr-2 ${
                    waba.quality === 'High Quality' ? 'bg-whatsapp' : 
                    waba.quality === 'Medium Quality' ? 'bg-amber-400' : 'bg-red-500'
                  }`}></span>
                  <span className="font-medium text-slate-900">{waba.quality}</span>
                </div>
              </div>
              
              <div>
                <p className="text-xs text-slate-500 mb-1">Messaging Limit</p>
                <p className="font-medium text-slate-900">{waba.messagingLimit}</p>
              </div>
              
              <div className="col-span-1 md:col-span-2 lg:col-span-4 border-t border-slate-100 mt-2 pt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 bg-slate-50/50 -mx-6 px-6 -mb-6 pb-6">
                <div>
                  <p className="text-xs text-slate-500 mb-1">Business Name</p>
                  <p className="text-sm font-medium text-slate-700">{waba.businessName}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Business ID</p>
                  <p className="text-sm font-mono text-slate-700">{waba.businessId}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">WABA Account ID</p>
                  <p className="text-sm font-mono text-slate-700">{waba.wabaAccountId}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Phone Number ID</p>
                  <p className="text-sm font-mono text-slate-700">{waba.phoneNumberId}</p>
                </div>
              </div>
            </div>
          </div>
        ))}

        {wabaAccounts.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl border border-slate-100">
            <p className="text-slate-500">No WABA accounts found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
