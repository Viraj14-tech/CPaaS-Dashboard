import { getSession } from "@/lib/session";
import { campaignsStore } from "@/lib/store/campaigns";
import { redirect } from "next/navigation";
import { Eye, Search, Filter, Download, Calendar } from "lucide-react";

export default async function ReportPage() {
  const session = await getSession();
  if (!session || !session.clientId) {
    redirect('/login');
  }

  const campaigns = campaignsStore.findByClientId(session.clientId);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Campaign Logs</h2>
        <div className="flex space-x-3">
          <button className="flex items-center space-x-2 text-sm text-slate-600 bg-white px-4 py-2 rounded-lg border border-slate-200 hover:bg-slate-50">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      <div className="card overflow-hidden">
        {/* Filters */}
        <div className="p-4 border-b border-slate-100 bg-white grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="relative col-span-2 md:col-span-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Calendar className="h-4 w-4 text-slate-400" />
            </div>
            <input type="text" placeholder="Created On" className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-md focus:ring-primary focus:border-primary" />
          </div>
          <div className="relative col-span-2 md:col-span-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <input type="text" placeholder="Campaign Name" className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-md focus:ring-primary focus:border-primary" />
          </div>
          <div className="col-span-1">
            <select className="w-full px-3 py-2 text-sm border border-slate-200 rounded-md focus:ring-primary focus:border-primary appearance-none bg-white">
              <option value="">Category</option>
              <option value="MARKETING">Marketing</option>
              <option value="UTILITY">Utility</option>
            </select>
          </div>
          <div className="col-span-1">
            <select className="w-full px-3 py-2 text-sm border border-slate-200 rounded-md focus:ring-primary focus:border-primary appearance-none bg-white">
              <option value="">Type</option>
              <option value="text">Text</option>
              <option value="image">Image</option>
              <option value="video">Video</option>
            </select>
          </div>
          <div className="col-span-1 flex space-x-2">
            <select className="w-full px-3 py-2 text-sm border border-slate-200 rounded-md focus:ring-primary focus:border-primary appearance-none bg-white">
              <option value="">Status</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
            </select>
            <button className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-md hover:bg-primary-light flex items-center justify-center">
              <Search className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold tracking-wider">
              <tr>
                <th className="px-4 py-3">S.No</th>
                <th className="px-4 py-3">Campaign Date</th>
                <th className="px-4 py-3">Campaign Name</th>
                <th className="px-4 py-3">Template Name</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Template Type</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-right">Total Audience</th>
                <th className="px-4 py-3 text-right">Sent</th>
                <th className="px-4 py-3 text-right">Delivered</th>
                <th className="px-4 py-3 text-right">Failed</th>
                <th className="px-4 py-3 text-right">Delivery %</th>
                <th className="px-4 py-3 text-right">Amount Spent</th>
                <th className="px-4 py-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {campaigns.map((camp, idx) => (
                <tr key={camp.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-3 text-slate-500">{idx + 1}</td>
                  <td className="px-4 py-3 text-slate-600">
                    {new Date(camp.campaignDate).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="px-4 py-3 font-medium text-slate-900">{camp.campaignName}</td>
                  <td className="px-4 py-3 text-slate-600">{camp.templateName}</td>
                  <td className="px-4 py-3 text-slate-600">{camp.category}</td>
                  <td className="px-4 py-3 text-slate-600">{camp.templateType}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-block px-2 py-0.5 text-[11px] font-semibold rounded-full ${
                      camp.status === 'completed' ? 'bg-mint text-primary border border-mint-border' : 
                      camp.status === 'failed' ? 'bg-red-50 text-red-600 border border-red-100' :
                      'bg-amber-50 text-amber-600 border border-amber-100'
                    }`}>
                      {camp.status.charAt(0).toUpperCase() + camp.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-slate-600">{camp.totalAudience.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right text-slate-600">{camp.sent.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right text-slate-600">{camp.delivered.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right text-slate-600">{camp.failed.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right font-medium text-emerald-600">
                    {camp.sent > 0 ? ((camp.delivered / camp.sent) * 100).toFixed(1) : 0}%
                  </td>
                  <td className="px-4 py-3 text-right text-slate-600">₹{camp.amountSpent.toLocaleString()}</td>
                  <td className="px-4 py-3 text-center">
                    <button className="text-slate-400 hover:text-primary transition-colors p-1" title="View Details">
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {campaigns.length === 0 && (
            <div className="text-center py-12">
              <p className="text-slate-500">No campaigns found.</p>
            </div>
          )}
        </div>
        
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs text-slate-500">
          <span>Showing 1 to {campaigns.length} of {campaigns.length} entries</span>
          <div className="flex space-x-1">
            <button className="px-2 py-1 border border-slate-200 rounded bg-white text-slate-400 cursor-not-allowed">Previous</button>
            <button className="px-2 py-1 border border-primary bg-primary text-white rounded">1</button>
            <button className="px-2 py-1 border border-slate-200 rounded bg-white text-slate-400 cursor-not-allowed">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
