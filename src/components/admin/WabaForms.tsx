"use client";

import { useState } from "react";
import { addWaba, updateWaba } from "@/app/actions/admin/waba";
import { X, Plus, Edit } from "lucide-react";

export function WabaModal({ client, waba, onClose }: { client: any, waba?: any, onClose: () => void }) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isEdit = !!waba;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    
    let result;
    if (isEdit) {
      result = await updateWaba(waba.id, formData);
    } else {
      result = await addWaba(client.id, formData);
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
          <h3 className="font-bold text-slate-800">{isEdit ? 'Edit WABA' : 'Add WABA'}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto">
          {error && <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4 text-sm">{error}</div>}
          
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Display Name</label>
              <input type="text" name="displayName" defaultValue={waba?.displayName} required className="w-full border border-slate-200 rounded p-2 text-sm" />
            </div>
            
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Mobile Number</label>
              <input type="text" name="mobileNumber" defaultValue={waba?.mobileNumber} required className="w-full border border-slate-200 rounded p-2 text-sm" />
            </div>
            
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Messaging Limit</label>
              <input type="text" name="messagingLimit" defaultValue={waba?.messagingLimit || "2000"} required className="w-full border border-slate-200 rounded p-2 text-sm" />
            </div>
            
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Created On</label>
              <input type="text" name="createdOn" defaultValue={waba?.createdOn || new Date().toLocaleDateString('en-GB')} required className="w-full border border-slate-200 rounded p-2 text-sm" />
            </div>
            
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Expiry Date</label>
              <input type="text" name="expiryDate" defaultValue={waba?.expiryDate} required className="w-full border border-slate-200 rounded p-2 text-sm" />
            </div>
            
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Verification Status</label>
              <select name="verificationStatus" defaultValue={waba?.verificationStatus || "Verified"} className="w-full border border-slate-200 rounded p-2 text-sm bg-white">
                <option value="Verified">Verified</option>
                <option value="Unverified">Unverified</option>
              </select>
            </div>
            
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Phone Status</label>
              <select name="phoneStatus" defaultValue={waba?.phoneStatus || "CONNECTED"} className="w-full border border-slate-200 rounded p-2 text-sm bg-white">
                <option value="CONNECTED">CONNECTED</option>
                <option value="DISCONNECTED">DISCONNECTED</option>
              </select>
            </div>
            
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Quality</label>
              <select name="quality" defaultValue={waba?.quality || "High Quality"} className="w-full border border-slate-200 rounded p-2 text-sm bg-white">
                <option value="High Quality">High Quality</option>
                <option value="Medium Quality">Medium Quality</option>
                <option value="Low Quality">Low Quality</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Insights</label>
              <select name="insights" defaultValue={waba?.insights || "Disabled"} className="w-full border border-slate-200 rounded p-2 text-sm bg-white">
                <option value="Enabled">Enabled</option>
                <option value="Disabled">Disabled</option>
              </select>
            </div>

            <div className="col-span-2">
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Business Name</label>
              <input type="text" name="businessName" defaultValue={waba?.businessName} required className="w-full border border-slate-200 rounded p-2 text-sm" />
            </div>

            <div className="col-span-2">
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Business ID</label>
              <input type="text" name="businessId" defaultValue={waba?.businessId} required className="w-full border border-slate-200 rounded p-2 text-sm font-mono" />
            </div>

            <div className="col-span-2">
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">WABA Account ID</label>
              <input type="text" name="wabaAccountId" defaultValue={waba?.wabaAccountId} required className="w-full border border-slate-200 rounded p-2 text-sm font-mono" />
            </div>

            <div className="col-span-2">
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Phone Number ID</label>
              <input type="text" name="phoneNumberId" defaultValue={waba?.phoneNumberId} required className="w-full border border-slate-200 rounded p-2 text-sm font-mono" />
            </div>
          </div>
          
          <div className="mt-8 flex justify-end">
            <button type="button" onClick={onClose} className="px-4 py-2 mr-3 border border-slate-200 text-slate-600 rounded font-medium text-sm">Cancel</button>
            <button type="submit" disabled={loading} className="px-4 py-2 bg-slate-900 text-white rounded font-medium text-sm flex items-center">
              {loading ? 'Saving...' : 'Save WABA'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function WabaListActions({ client, wabas }: { client: any, wabas: any[] }) {
  const [showAdd, setShowAdd] = useState(false);
  const [editWaba, setEditWaba] = useState<any>(null);

  return (
    <>
      <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
        <h3 className="font-bold text-slate-800">WABA Accounts</h3>
        <button onClick={() => setShowAdd(true)} className="bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 px-3 py-1.5 rounded text-xs font-medium flex items-center shadow-sm">
          <Plus className="w-3.5 h-3.5 mr-1" /> Add WABA
        </button>
      </div>
      
      {showAdd && <WabaModal client={client} onClose={() => setShowAdd(false)} />}
      {editWaba && <WabaModal client={client} waba={editWaba} onClose={() => setEditWaba(null)} />}

      <div className="p-4 grid grid-cols-1 gap-4">
        {wabas.map(waba => (
          <div key={waba.id} className="border border-slate-200 rounded-lg p-4 bg-slate-50 flex justify-between items-center">
            <div>
              <h4 className="font-bold text-slate-800 text-sm">{waba.displayName}</h4>
              <p className="text-xs text-slate-500 mt-1">Number: {waba.mobileNumber} • Quality: {waba.quality}</p>
            </div>
            <button onClick={() => setEditWaba(waba)} className="text-indigo-600 hover:text-indigo-800 text-xs font-medium bg-white border border-slate-200 px-3 py-1.5 rounded shadow-sm">Edit details</button>
          </div>
        ))}
        {wabas.length === 0 && (
          <div className="p-6 text-center text-slate-500 text-sm">No WABA accounts found.</div>
        )}
      </div>
    </>
  );
}
