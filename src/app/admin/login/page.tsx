"use client";

import { useState } from "react";
import { Eye, EyeOff, Lock, User, ShieldAlert } from "lucide-react";
import { login } from "@/app/actions/auth";
import { useActionState } from "react";

export default function AdminLoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  
  const [state, formAction, isPending] = useActionState(
    async (prevState: any, formData: FormData) => {
      const result = await login(formData);
      if (result?.error) {
        return result;
      }
      return prevState;
    },
    null
  );

  return (
    <div className="flex min-h-screen bg-slate-100 items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
        <div className="bg-slate-900 p-6 flex items-center justify-center border-b border-slate-800">
          <ShieldAlert className="w-6 h-6 text-emerald-400 mr-2" />
          <h2 className="text-xl font-bold text-white">Turiya Admin Portal</h2>
        </div>
        
        <div className="p-8">
          <form action={formAction} className="space-y-6">
            {state?.error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-100">
                {state.error}
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Admin ID</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  name="userId"
                  className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-lg focus:ring-slate-900 focus:border-slate-900 bg-slate-50"
                  placeholder="Enter admin ID"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className="block w-full pl-10 pr-10 py-3 border border-slate-200 rounded-lg focus:ring-slate-900 focus:border-slate-900 bg-slate-50"
                  placeholder="Enter password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-lg shadow text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 transition-colors mt-8"
              disabled={isPending}
            >
              {isPending ? 'Authenticating...' : 'Secure Login'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
