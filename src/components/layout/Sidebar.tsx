"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home, 
  MessageSquare, 
  BarChart2, 
  Settings, 
  ChevronDown, 
  ChevronRight,
  Send,
  LogOut
} from "lucide-react";
import { useState } from "react";

export function Sidebar() {
  const pathname = usePathname();
  const [isWhatsappOpen, setIsWhatsappOpen] = useState(true);

  const isActive = (path: string) => pathname === path;
  
  return (
    <div className="w-64 bg-white border-r border-slate-200 h-screen flex flex-col">
      <div className="p-4 border-b border-slate-200">
        <h2 className="text-xl font-bold text-primary">Turiya Infotech</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-3">
          <Link 
            href="/dashboard"
            className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
              isActive('/dashboard') 
                ? 'bg-primary text-white' 
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Home className="w-5 h-5 mr-3" />
            Dashboard
          </Link>
          
          <div className="pt-2">
            <button 
              onClick={() => setIsWhatsappOpen(!isWhatsappOpen)}
              className="w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <div className="flex items-center">
                <MessageSquare className="w-5 h-5 mr-3 text-whatsapp" />
                WhatsApp
              </div>
              {isWhatsappOpen ? (
                <ChevronDown className="w-4 h-4 text-slate-400" />
              ) : (
                <ChevronRight className="w-4 h-4 text-slate-400" />
              )}
            </button>
            
            {isWhatsappOpen && (
              <div className="mt-1 space-y-1 pl-11">
                <Link 
                  href="/whatsapp/push-campaign"
                  className={`block px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActive('/whatsapp/push-campaign') 
                      ? 'text-primary bg-mint/50' 
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  Push Campaign
                </Link>
                <Link 
                  href="/whatsapp/report"
                  className={`block px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActive('/whatsapp/report') 
                      ? 'text-primary bg-mint/50' 
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  Report
                </Link>
                <Link 
                  href="/whatsapp/manage-waba"
                  className={`block px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActive('/whatsapp/manage-waba') 
                      ? 'text-primary bg-mint/50' 
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  Manage WABA
                </Link>
              </div>
            )}
          </div>
        </nav>
      </div>

      <div className="p-4 border-t border-slate-200">
        <a 
          href="/api/auth/logout"
          className="flex items-center px-3 py-2.5 text-sm font-medium text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <LogOut className="w-5 h-5 mr-3 text-slate-400" />
          Logout
        </a>
      </div>
    </div>
  );
}
