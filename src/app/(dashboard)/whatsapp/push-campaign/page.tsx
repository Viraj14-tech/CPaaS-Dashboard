"use client";

import { useState } from "react";
import { Upload, File, Smartphone, Image as ImageIcon, Send, X, User, Shield } from "lucide-react";

export default function PushCampaignPage() {
  const [showModal, setShowModal] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowModal(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Push Campaign</h2>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Column 1: Import Audience */}
        <div className="card h-full flex flex-col">
          <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center space-x-2">
            <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">1</div>
            <h3 className="font-bold text-slate-800">Import Audience</h3>
          </div>
          <div className="p-6 flex-1">
            <p className="text-sm text-slate-500 mb-4">Upload your contact list or use smart data.</p>
            
            <div className="border-2 border-dashed border-slate-200 rounded-lg p-8 flex flex-col items-center justify-center text-center bg-slate-50 mb-6 cursor-pointer hover:bg-slate-100 transition-colors">
              <Upload className="w-8 h-8 text-slate-400 mb-3" />
              <p className="text-sm font-medium text-slate-700">Drag & drop your file here</p>
              <div className="mt-4 flex space-x-2">
                <button type="button" className="px-4 py-2 bg-primary text-white text-xs font-medium rounded hover:bg-primary-light">
                  Select Contact
                </button>
                <button type="button" className="px-4 py-2 bg-white border border-slate-200 text-slate-600 text-xs font-medium rounded hover:bg-slate-50">
                  Process
                </button>
              </div>
              <p className="text-xs text-slate-400 mt-3">Supported formats: xlsx, csv</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Mobile No *</label>
                <select className="w-full text-sm border border-slate-200 rounded p-2 bg-slate-50">
                  <option>Mob</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Use Country Code</label>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" className="rounded text-primary focus:ring-primary border-slate-300" defaultChecked />
                  <span className="text-sm text-slate-600">+91 India</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" className="rounded text-primary focus:ring-primary border-slate-300" defaultChecked />
                <span className="text-sm text-slate-600">Remove Duplicate Mobile Numbers</span>
              </div>
            </div>
          </div>
        </div>

        {/* Column 2: Campaign Details */}
        <div className="card h-full flex flex-col">
          <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center space-x-2">
            <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">2</div>
            <h3 className="font-bold text-slate-800">Campaign Details</h3>
          </div>
          <div className="p-6 flex-1 space-y-5">
            <p className="text-sm text-slate-500 mb-4">Configure your WhatsApp campaign settings.</p>
            
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Select WABA *</label>
              <select className="w-full text-sm border border-slate-200 rounded p-2 bg-white">
                <option>Makarand Toraskar</option>
              </select>
            </div>
            
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">WABA Number</label>
              <input type="text" className="w-full text-sm border border-slate-200 rounded p-2 bg-slate-50 text-slate-500" value="919076450027" readOnly />
            </div>
            
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Campaign Name *</label>
              <input type="text" className="w-full text-sm border border-slate-200 rounded p-2 bg-white" defaultValue="Slot 1 campaign" />
            </div>
            
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Select Template *</label>
              <select className="w-full text-sm border border-slate-200 rounded p-2 bg-white">
                <option>candidature_ita_e_voting_update_2026</option>
              </select>
            </div>
            
            <div className="border border-slate-200 rounded-lg p-4 bg-slate-50">
              <h4 className="text-xs font-medium text-slate-700 flex items-center mb-3">
                <ImageIcon className="w-4 h-4 mr-1.5" /> Media Attachment
              </h4>
              <div className="flex">
                <button type="button" className="px-3 py-1.5 bg-white border border-slate-200 rounded text-xs font-medium text-slate-600 flex items-center shadow-sm">
                  <ImageIcon className="w-3.5 h-3.5 mr-1" /> Image
                </button>
              </div>
              <p className="text-[10px] text-slate-400 mt-2">Formats: jpg, jpeg, png (Max 5MB)</p>
            </div>
          </div>
        </div>

        {/* Column 3: Template Preview */}
        <div className="card h-full flex flex-col">
          <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center space-x-2">
            <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">3</div>
            <h3 className="font-bold text-slate-800">Template Preview</h3>
          </div>
          <div className="p-6 flex-1 bg-[url('https://i.imgur.com/3q1Z9b8.png')] bg-cover bg-center">
            {/* WhatsApp Phone Mockup */}
            <div className="w-full max-w-sm mx-auto bg-[#efeae2] border-[8px] border-slate-800 rounded-[2rem] h-[500px] flex flex-col overflow-hidden shadow-xl relative">
              <div className="bg-[#075e54] text-white p-3 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-[#075e54]">
                    <User className="w-5 h-5" />
                  </div>
                  <span className="font-medium text-sm">Business Name</span>
                </div>
              </div>
              <div className="flex-1 p-3 overflow-y-auto">
                <div className="bg-white p-2 rounded-lg rounded-tl-none shadow-sm text-sm text-slate-800 max-w-[85%] relative mb-2">
                  <div className="w-full h-32 bg-slate-200 mb-2 rounded flex items-center justify-center text-slate-400">
                    <ImageIcon className="w-8 h-8" />
                  </div>
                  <p className="font-bold mb-1">CANDIDATE FOR JT. HON. SECRETARY</p>
                  <p className="mb-2">Dear {"{{1}}"},</p>
                  <p className="mb-2">This is an informational update regarding the upcoming elections.</p>
                  <p>Please use the button below to access the election portal.</p>
                  <div className="text-[10px] text-slate-400 text-right mt-1">10:42 AM</div>
                </div>
                <div className="bg-white p-2.5 rounded-lg shadow-sm text-sm text-[#00a884] font-medium text-center border border-slate-100 max-w-[85%] flex items-center justify-center">
                  <ExternalLink className="w-4 h-4 mr-1.5" /> Portal Link
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="col-span-1 lg:col-span-3 card p-4 flex justify-end space-x-3 bg-slate-50 border-t-0 rounded-t-none">
          <button type="button" className="px-5 py-2.5 bg-white border border-slate-200 text-slate-600 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors">
            Cancel
          </button>
          <button type="submit" className="px-5 py-2.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-light transition-colors flex items-center">
            Review Campaign <Send className="w-4 h-4 ml-2" />
          </button>
        </div>
      </form>

      {/* Access Required Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-slate-800 text-lg">Campaign Execution Access Required</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center text-amber-500 mb-4">
                <Shield className="w-6 h-6" />
              </div>
              <p className="text-slate-600 text-sm leading-relaxed mb-6">
                Campaign creation and execution are currently managed by the Turiya Infotech operations team. Please contact your account manager to activate campaign execution access.
              </p>
              <div className="flex space-x-3 justify-end">
                <button onClick={() => setShowModal(false)} className="px-4 py-2 bg-white border border-slate-200 text-slate-600 text-sm font-medium rounded-lg hover:bg-slate-50">
                  Close
                </button>
                <button onClick={() => setShowModal(false)} className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-light">
                  Contact Support
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ExternalLink(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
      <polyline points="15 3 21 3 21 9"></polyline>
      <line x1="10" y1="14" x2="21" y2="3"></line>
    </svg>
  );
}
