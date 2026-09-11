"use client";

import { useState } from "react";
import { addClient, updateClient } from "@/app/actions/admin/clients";
import { X, Plus, Save } from "lucide-react";

export function CreateClientButton() {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const result = await addClient(formData);
    setLoading(false);
    
    if (result.error) {
      setError(result.error);
    } else {
      setOpen(false);
    }
  };

  return (
    <>
      <button onClick={() => setOpen(true)} className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center">
        <Plus className="w-4 h-4 mr-2" />
        Create Client
      </button>

      {open && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] flex flex-col">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-slate-800">Create New Client</h3>
              <button onClick={() => setOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto">
              {error && <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4 text-sm">{error}</div>}
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Company Name</label>
                  <input type="text" name="name" required className="w-full border border-slate-200 rounded p-2 text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Display Name</label>
                  <input type="text" name="displayName" required className="w-full border border-slate-200 rounded p-2 text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Contact Person</label>
                  <input type="text" name="contactPerson" required className="w-full border border-slate-200 rounded p-2 text-sm" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Phone</label>
                    <input type="text" name="phone" required className="w-full border border-slate-200 rounded p-2 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Email</label>
                    <input type="email" name="email" required className="w-full border border-slate-200 rounded p-2 text-sm" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Status</label>
                  <select name="status" className="w-full border border-slate-200 rounded p-2 text-sm">
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                
                <hr className="my-4 border-slate-100" />
                <h4 className="font-semibold text-slate-800 text-sm mb-3">Client Credentials</h4>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Username</label>
                    <input type="text" name="username" required className="w-full border border-slate-200 rounded p-2 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Password</label>
                    <input type="text" name="password" required className="w-full border border-slate-200 rounded p-2 text-sm" />
                  </div>
                </div>
              </div>
              
              <div className="mt-8 flex justify-end">
                <button type="button" onClick={() => setOpen(false)} className="px-4 py-2 mr-3 border border-slate-200 text-slate-600 rounded font-medium text-sm">Cancel</button>
                <button type="submit" disabled={loading} className="px-4 py-2 bg-slate-900 text-white rounded font-medium text-sm flex items-center">
                  {loading ? 'Saving...' : 'Create Client'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export function EditClientForm({ client, user }: { client: any, user: any }) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    
    try {
      const result = await updateClient(client.id, formData);
      setLoading(false);
      
      if (result.error) {
        setError(result.error);
      } else {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err: any) {
      setLoading(false);
      setError(err?.message || "An unexpected error occurred while saving.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">{error}</div>}
      {success && <div className="bg-emerald-50 text-emerald-600 p-3 rounded-md text-sm">Client updated successfully</div>}
      
      <div>
        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Company Name</label>
        <input type="text" name="name" defaultValue={client.name} required className="w-full border border-slate-200 rounded p-2 text-sm" />
      </div>
      <div>
        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Display Name</label>
        <input type="text" name="displayName" defaultValue={client.displayName} required className="w-full border border-slate-200 rounded p-2 text-sm" />
      </div>
      <div>
        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Contact Person</label>
        <input type="text" name="contactPerson" defaultValue={client.contactPerson} required className="w-full border border-slate-200 rounded p-2 text-sm" />
      </div>
      <div>
        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Email</label>
        <input type="email" name="email" defaultValue={client.email} required className="w-full border border-slate-200 rounded p-2 text-sm" />
      </div>
      <div>
        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Phone</label>
        <input type="text" name="phone" defaultValue={client.phone} required className="w-full border border-slate-200 rounded p-2 text-sm" />
      </div>
      <div>
        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Status</label>
        <select name="status" defaultValue={client.status} className="w-full border border-slate-200 rounded p-2 text-sm bg-white">
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <hr className="my-4 border-slate-100" />
      <h4 className="font-semibold text-slate-800 text-sm mb-3">Login Credentials</h4>
      
      <div>
        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Username</label>
        <input type="text" name="username" defaultValue={user?.username} className="w-full border border-slate-200 rounded p-2 text-sm" />
      </div>
      <div>
        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Reset Password (leave blank to keep current)</label>
        <input type="text" name="password" placeholder="New password" className="w-full border border-slate-200 rounded p-2 text-sm" />
      </div>

      <button type="submit" disabled={loading} className="w-full mt-4 bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm py-2 rounded shadow-sm flex items-center justify-center">
        <Save className="w-4 h-4 mr-2" /> {loading ? 'Saving...' : 'Save Details'}
      </button>
    </form>
  );
}
