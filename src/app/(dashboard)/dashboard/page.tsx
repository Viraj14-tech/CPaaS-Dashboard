import { getSession } from "@/lib/session";
import { campaignsStore } from "@/lib/store/campaigns";
import { redirect } from "next/navigation";
import { Users, Send, CheckCircle, XCircle, Percent, IndianRupee, ArrowRight, Calendar } from "lucide-react";
import Link from "next/link";
import { MessagePerformanceChart, SpendChart } from "@/components/dashboard/Charts";

export default async function DashboardPage() {
  const session = await getSession();
  if (!session || !session.clientId) {
    redirect('/login');
  }

  const campaigns = campaignsStore.findByClientId(session.clientId);

  // Calculations
  const totalAudience = campaigns.reduce((sum, c) => sum + c.totalAudience, 0);
  const totalSent = campaigns.reduce((sum, c) => sum + c.sent, 0);
  const totalDelivered = campaigns.reduce((sum, c) => sum + c.delivered, 0);
  const totalFailed = campaigns.reduce((sum, c) => sum + c.failed, 0);
  const totalSpent = campaigns.reduce((sum, c) => sum + c.amountSpent, 0);
  
  const deliveryRate = totalSent > 0 ? ((totalDelivered / totalSent) * 100).toFixed(1) : "0.0";
  const costPerSent = totalSent > 0 ? (totalSpent / totalSent).toFixed(2) : "0.00";
  const costPerDelivered = totalDelivered > 0 ? (totalSpent / totalDelivered).toFixed(2) : "0.00";

  // Format data for charts (last 7 campaigns or so)
  const chartData = [...campaigns].reverse().slice(-10).map(c => {
    const date = new Date(c.campaignDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
    return {
      name: date,
      sent: c.sent,
      delivered: c.delivered,
      failed: c.failed,
      amount: c.amountSpent,
      campaignName: c.campaignName
    };
  });

  const recentCampaigns = campaigns.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Date Filter (Dummy for MVP) */}
      <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
        <h2 className="text-xl font-bold text-slate-800">Campaign Overview</h2>
        <div className="flex items-center space-x-2 text-sm text-slate-600 bg-slate-50 px-3 py-2 rounded-lg border border-slate-200">
          <Calendar className="w-4 h-4" />
          <span>All Time</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard title="Total Audience" value={totalAudience.toLocaleString()} icon={<Users className="text-primary" />} />
        <KpiCard title="Total Sent" value={totalSent.toLocaleString()} icon={<Send className="text-blue-500" />} />
        <KpiCard title="Delivered" value={totalDelivered.toLocaleString()} icon={<CheckCircle className="text-whatsapp" />} />
        <KpiCard title="Failed" value={totalFailed.toLocaleString()} icon={<XCircle className="text-red-500" />} />
        
        <KpiCard title="Delivery Rate" value={`${deliveryRate}%`} icon={<Percent className="text-emerald-500" />} />
        <KpiCard title="Amount Spent" value={`₹${totalSpent.toLocaleString()}`} icon={<IndianRupee className="text-amber-500" />} />
        <KpiCard title="Cost / Sent" value={`₹${costPerSent}`} icon={<IndianRupee className="text-slate-400" />} />
        <KpiCard title="Cost / Delivered" value={`₹${costPerDelivered}`} icon={<IndianRupee className="text-slate-400" />} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-2">Message Performance</h3>
          <p className="text-sm text-slate-500 mb-4">Sent, delivered and failed metrics over recent campaigns.</p>
          <MessagePerformanceChart data={chartData} />
        </div>
        <div className="card p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-2">Spend Trend</h3>
          <p className="text-sm text-slate-500 mb-4">Amount spent in INR across recent campaigns.</p>
          <SpendChart data={chartData} />
        </div>
      </div>

      {/* Recent Campaigns */}
      <div className="card overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h3 className="text-lg font-bold text-slate-800">Recent Campaigns</h3>
          <Link href="/whatsapp/report" className="text-primary text-sm font-medium flex items-center hover:underline">
            View All Reports <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 uppercase text-xs font-semibold">
              <tr>
                <th className="px-6 py-4">Campaign Name</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-right">Audience</th>
                <th className="px-6 py-4 text-right">Sent</th>
                <th className="px-6 py-4 text-right">Delivered</th>
                <th className="px-6 py-4 text-right">Delivery %</th>
                <th className="px-6 py-4 text-right">Spend</th>
                <th className="px-6 py-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentCampaigns.map((camp) => (
                <tr key={camp.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900">{camp.campaignName}</td>
                  <td className="px-6 py-4 text-slate-500">
                    {new Date(camp.campaignDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-6 py-4 text-right text-slate-600">{camp.totalAudience.toLocaleString()}</td>
                  <td className="px-6 py-4 text-right text-slate-600">{camp.sent.toLocaleString()}</td>
                  <td className="px-6 py-4 text-right text-slate-600">{camp.delivered.toLocaleString()}</td>
                  <td className="px-6 py-4 text-right font-medium text-emerald-600">
                    {camp.sent > 0 ? ((camp.delivered / camp.sent) * 100).toFixed(1) : 0}%
                  </td>
                  <td className="px-6 py-4 text-right text-slate-600">₹{camp.amountSpent.toLocaleString()}</td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-block px-2.5 py-1 text-xs font-medium rounded-full bg-mint text-primary">
                      {camp.status.charAt(0).toUpperCase() + camp.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function KpiCard({ title, value, icon }: { title: string; value: string | number; icon: React.ReactNode }) {
  return (
    <div className="card p-5 flex items-center">
      <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mr-4">
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <p className="text-2xl font-bold text-slate-900 mt-0.5">{value}</p>
      </div>
    </div>
  );
}
