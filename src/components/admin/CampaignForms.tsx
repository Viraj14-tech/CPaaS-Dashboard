"use client";

import { useState } from "react";
import { addCampaign, updateCampaign, deleteCampaign } from "@/app/actions/admin/campaigns";
import { X, Plus, Edit, Trash2 } from "lucide-react";

export function CampaignModal({ client, campaign, onClose }: { client: any, campaign?: any, onClose: () => void }) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isEdit = !!campaign;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    
    let result;
    if (isEdit) {
      result = await updateCampaign(campaign.id, formData);
    } else {
      result = await addCampaign(client.id, formData);
    }
    
    setLoading(false);
    
    if (result.error) {
      setError(result.error);
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h3 className="font-bold text-slate-800">{isEdit ? 'Edit Campaign' : 'Add Campaign'}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto">
          {error && <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4 text-sm">{error}</div>}
          
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Campaign Name</label>
              <input type="text" name="campaignName" defaultValue={campaign?.campaignName} required className="w-full border border-slate-200 rounded p-2 text-sm" />
            </div>
            
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Date</label>
              <input type="datetime-local" name="campaignDate" defaultValue={campaign?.campaignDate ? new Date(campaign.campaignDate).toISOString().slice(0, 16) : ""} required className="w-full border border-slate-200 rounded p-2 text-sm" />
            </div>
            
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Template Name</label>
              <input type="text" name="templateName" defaultValue={campaign?.templateName} required className="w-full border border-slate-200 rounded p-2 text-sm" />
            </div>
            
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Category</label>
              <select name="category" defaultValue={campaign?.category} className="w-full border border-slate-200 rounded p-2 text-sm">
                <option value="MARKETING">Marketing</option>
                <option value="UTILITY">Utility</option>
              </select>
            </div>
            
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Template Type</label>
              <select name="templateType" defaultValue={campaign?.templateType} className="w-full border border-slate-200 rounded p-2 text-sm">
                <option value="text">Text</option>
                <option value="image">Image</option>
                <option value="video">Video</option>
                <option value="document">Document</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Status</label>
              <select name="status" defaultValue={campaign?.status} className="w-full border border-slate-200 rounded p-2 text-sm">
                <option value="completed">Completed</option>
                <option value="scheduled">Scheduled</option>
                <option value="failed">Failed</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>

          <hr className="my-6 border-slate-100" />
          <h4 className="font-semibold text-slate-800 text-sm mb-4">Metrics</h4>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Total Audience</label>
              <input type="number" name="totalAudience" defaultValue={campaign?.totalAudience || 0} required min="0" className="w-full border border-slate-200 rounded p-2 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Sent</label>
              <input type="number" name="sent" defaultValue={campaign?.sent || 0} required min="0" className="w-full border border-slate-200 rounded p-2 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Delivered</label>
              <input type="number" name="delivered" defaultValue={campaign?.delivered || 0} required min="0" className="w-full border border-slate-200 rounded p-2 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Failed</label>
              <input type="number" name="failed" defaultValue={campaign?.failed || 0} required min="0" className="w-full border border-slate-200 rounded p-2 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Read (Optional)</label>
              <input type="number" name="read" defaultValue={campaign?.read || 0} min="0" className="w-full border border-slate-200 rounded p-2 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Amount Spent (₹)</label>
              <input type="number" step="0.01" name="amountSpent" defaultValue={campaign?.amountSpent || 0} required min="0" className="w-full border border-slate-200 rounded p-2 text-sm" />
            </div>
          </div>
          
          <div className="mt-8 flex justify-end">
            <button type="button" onClick={onClose} className="px-4 py-2 mr-3 border border-slate-200 text-slate-600 rounded font-medium text-sm">Cancel</button>
            <button type="submit" disabled={loading} className="px-4 py-2 bg-slate-900 text-white rounded font-medium text-sm flex items-center">
              {loading ? 'Saving...' : 'Save Campaign'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function DeleteCampaignButton({ id }: { id: string }) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this campaign?")) {
      setLoading(true);
      await deleteCampaign(id);
      setLoading(false);
    }
  };

  return (
    <button onClick={handleDelete} disabled={loading} className="text-red-600 hover:text-red-800 text-xs font-medium ml-3">
      {loading ? '...' : <Trash2 className="w-4 h-4" />}
    </button>
  );
}

import { BulkCampaignModal } from "./BulkCampaignModal";

export function CampaignListActions({ client, campaigns }: { client: any, campaigns: any[] }) {
  const [showAdd, setShowAdd] = useState(false);
  const [showBulkAdd, setShowBulkAdd] = useState(false);
  const [editCamp, setEditCamp] = useState<any>(null);

  return (
    <>
      <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
        <h3 className="font-bold text-slate-800">Campaign Data</h3>
        <div className="flex space-x-2">
          <button onClick={() => setShowBulkAdd(true)} className="bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 px-3 py-1.5 rounded text-xs font-medium flex items-center shadow-sm">
            Bulk Add Campaigns
          </button>
          <button onClick={() => setShowAdd(true)} className="bg-slate-900 text-white hover:bg-slate-800 px-3 py-1.5 rounded text-xs font-medium flex items-center shadow-sm">
            <Plus className="w-3.5 h-3.5 mr-1" /> Add Campaign
          </button>
        </div>
      </div>
      
      {showAdd && <CampaignModal client={client} onClose={() => setShowAdd(false)} />}
      {editCamp && <CampaignModal client={client} campaign={editCamp} onClose={() => setEditCamp(null)} />}
      {showBulkAdd && <BulkCampaignModal client={client} campaigns={campaigns} onClose={() => setShowBulkAdd(false)} />}

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px] font-bold tracking-wider">
            <tr>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3 text-right">Audience</th>
              <th className="px-4 py-3 text-right">Sent</th>
              <th className="px-4 py-3 text-right">Delivered</th>
              <th className="px-4 py-3 text-center">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {campaigns.map(camp => (
              <tr key={camp.id} className="hover:bg-slate-50">
                <td className="px-4 py-3 text-slate-500">
                  {new Date(camp.campaignDate).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 font-medium text-slate-800">{camp.campaignName}</td>
                <td className="px-4 py-3 text-right text-slate-600">{camp.totalAudience.toLocaleString()}</td>
                <td className="px-4 py-3 text-right text-slate-600">{camp.sent.toLocaleString()}</td>
                <td className="px-4 py-3 text-right text-slate-600">{camp.delivered.toLocaleString()}</td>
                <td className="px-4 py-3 text-center">
                  <span className={`inline-block px-2 py-0.5 text-[10px] font-bold rounded bg-slate-100 text-slate-600`}>
                    {camp.status.toUpperCase()}
                  </span>
                </td>
                <td className="px-4 py-3 text-right flex items-center justify-end">
                  <button onClick={() => setEditCamp(camp)} className="text-indigo-600 hover:text-indigo-800 text-xs font-medium flex items-center">
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <DeleteCampaignButton id={camp.id} />
                </td>
              </tr>
            ))}
            {campaigns.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-slate-500">No campaigns found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
