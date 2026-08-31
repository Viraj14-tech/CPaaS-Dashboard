"use client";

import { useState } from "react";
import { Eye, EyeOff, Lock, User } from "lucide-react";
import { login } from "@/app/actions/auth";
import { useActionState } from "react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  
  // React 19 useActionState
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
    <div className="flex min-h-screen bg-mint/30">
      {/* Left side - Product Area (Dark Green) */}
      <div className="hidden lg:flex w-1/2 bg-primary flex-col justify-center items-center text-white p-12 relative overflow-hidden">
        <div className="z-10 max-w-md">
          <h1 className="text-4xl font-bold mb-4">CPaaS Platform</h1>
          <p className="text-xl text-mint opacity-90 mb-12">
            Connect. Communicate. Engage.
          </p>
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-primary-light/50 p-6 rounded-xl border border-white/10 backdrop-blur-sm flex flex-col items-center">
               <div className="bg-whatsapp p-3 rounded-full mb-3">
                 <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.1.824zm-3.423-14.416c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm.029 18.88c-1.161 0-2.305-.292-3.318-.844l-3.677.964 1.003-3.588c-.608-1.065-.928-2.294-.928-3.565 0-4.062 3.308-7.37 7.37-7.37s7.371 3.308 7.371 7.37c-.001 4.062-3.309 7.37-7.37 7.37z"/></svg>
               </div>
               <span className="font-semibold text-sm">WhatsApp</span>
               <span className="text-xs text-mint/70 mt-1">Rich Conversations</span>
            </div>
            <div className="bg-primary-light/50 p-6 rounded-xl border border-white/10 backdrop-blur-sm flex flex-col items-center justify-center">
              <span className="font-semibold text-sm">One Platform.</span>
              <span className="text-mint text-sm">Every Conversation.</span>
            </div>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-primary-light rounded-full mix-blend-multiply filter blur-3xl opacity-50"></div>
          <div className="absolute top-[80%] -right-[10%] w-[60%] h-[60%] bg-primary-light rounded-full mix-blend-multiply filter blur-3xl opacity-50"></div>
        </div>
      </div>

      {/* Right side - Login Form (White) */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-foreground">Turiya Infotech</h2>
            <p className="text-slate-500 mt-2">Client Reporting Portal</p>
          </div>

          <form action={formAction} className="space-y-6">
            {state?.error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-100">
                {state.error}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                User ID
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  name="userId"
                  className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-lg focus:ring-primary focus:border-primary bg-slate-50 outline-none transition-colors"
                  placeholder="Enter your user ID"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                PASSWORD
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className="block w-full pl-10 pr-10 py-3 border border-slate-200 rounded-lg focus:ring-primary focus:border-primary bg-slate-50 outline-none transition-colors"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-primary hover:bg-primary-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors mt-8"
            >
              Log In
            </button>
          </form>

          <div className="mt-12 text-center text-sm text-slate-500">
            Need help? Contact support:<br />
            <span className="font-medium">support@turiyainfotech.com</span>
          </div>
        </div>
      </div>
    </div>
  );
}
