"use client";

import { useState } from "react";
import { Eye, EyeOff, Lock, User, MessageSquare, MessageCircle, Bot, Phone, Mail } from "lucide-react";
import { login } from "@/app/actions/auth";
import { useActionState } from "react";

export default function LoginPage() {
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
    <div className="min-h-screen bg-[#b2c8bc] flex items-center justify-center p-4 md:p-6 lg:p-8 font-sans">
      <div className="w-full max-w-[1300px] h-auto min-h-[650px] lg:h-[86vh] lg:max-h-[850px] bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] flex flex-col lg:flex-row overflow-hidden">
        
        {/* Left side - Product Area (Dark Green) */}
        <div className="w-full lg:w-[59%] bg-[#0D2A1D] relative p-8 lg:p-14 flex flex-col justify-between overflow-hidden text-white min-h-[500px]">
          
          {/* Top Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-start w-full relative z-10 space-y-4 sm:space-y-0">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-white tracking-tight">CPaaS Platform</h1>
              <p className="text-[#8ba396] text-sm mt-1.5 font-medium">Connect. Communicate. Engage.</p>
            </div>
            <div className="sm:text-right">
              <p className="text-lg font-bold">One Platform.</p>
              <p className="text-lg font-bold">Every <span className="text-[#3edc71]">Conversation.</span></p>
            </div>
          </div>

          {/* Central Illustration */}
          <div className="flex-1 flex items-center justify-center relative my-12 lg:my-0">
            {/* Orbit Circle Container */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[260px] h-[260px] sm:w-[320px] sm:h-[320px] rounded-full border-[1.5px] border-[#2a4537] border-dashed">
              
              {/* Center Pill */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-full px-8 py-3.5 shadow-[0_0_40px_rgba(62,220,113,0.3)] z-10 flex items-center justify-center">
                <span className="text-[#0D2A1D] font-bold text-xl tracking-wide">CPaaS</span>
              </div>

              {/* Top: WhatsApp */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-[24px] flex flex-col items-center w-32 text-center">
                <div className="w-12 h-12 bg-[#48d86a] rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(72,216,106,0.3)] mb-2.5">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.1.824zm-3.423-14.416c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm.029 18.88c-1.161 0-2.305-.292-3.318-.844l-3.677.964 1.003-3.588c-.608-1.065-.928-2.294-.928-3.565 0-4.062 3.308-7.37 7.37-7.37s7.371 3.308 7.371 7.37c-.001 4.062-3.309 7.37-7.37 7.37z"/></svg>
                </div>
                <p className="text-xs font-bold text-white tracking-wide">WhatsApp</p>
                <p className="text-[10px] text-[#8ba396] mt-0.5">Rich Conversations</p>
              </div>

              {/* Left: SMS */}
              <div className="absolute top-1/2 left-0 -translate-x-1/2 -mt-[24px] flex flex-col items-center w-32 text-center">
                <div className="w-12 h-12 bg-[#5fcb80] rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(95,203,128,0.2)] mb-2.5">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <p className="text-xs font-bold text-white tracking-wide">SMS</p>
                <p className="text-[10px] text-[#8ba396] mt-0.5">Instant & Reliable</p>
              </div>

              {/* Right: RCS */}
              <div className="absolute top-1/2 right-0 translate-x-1/2 -mt-[24px] flex flex-col items-center w-32 text-center">
                <div className="w-12 h-12 bg-[#3b82f6] rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.3)] mb-2.5">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <p className="text-xs font-bold text-white tracking-wide">RCS</p>
                <p className="text-[10px] text-[#8ba396] mt-0.5">Branded. Verified.</p>
              </div>

              {/* Bottom: AI Bots */}
              <div className="absolute top-[100%] left-1/2 -translate-x-1/2 -mt-[24px] flex flex-col items-center w-32 text-center">
                <div className="w-12 h-12 bg-[#38bdf8] rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(56,189,248,0.3)] mb-2.5">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <p className="text-xs font-bold text-white tracking-wide">AI Bots</p>
                <p className="text-[10px] text-[#8ba396] mt-0.5">Smart. Instant. 24/7</p>
              </div>
            </div>
          </div>
          
          <div className="hidden lg:block h-8"></div>
        </div>

        {/* Right side - Login Form (White/Light Grey) */}
        <div className="w-full lg:w-[41%] bg-[#FAF9FB] relative p-8 lg:p-12 flex flex-col justify-between">
          
          <div className="flex-1 flex flex-col items-center justify-center max-w-[380px] mx-auto w-full">
            {/* Logo Area */}
            <div className="mb-3 w-full flex justify-center">
              <img src="/turiya-logo.jpg" alt="Turiya Infotech" className="h-16 md:h-20 object-contain" />
            </div>
            
            <h2 className="text-[26px] md:text-[30px] font-bold text-[#0D2A1D] mb-10 tracking-tight">Turiya Infotech</h2>
            
            {/* Form */}
            <form action={formAction} className="w-full space-y-6">
              {state?.error && (
                <div className="bg-red-50 text-red-700 p-3.5 rounded-xl text-sm border border-red-100 w-full text-center font-medium shadow-sm">
                  {state.error}
                </div>
              )}
              
              <div>
                <label className="block text-[11px] uppercase tracking-[0.08em] font-semibold text-[#8B95A5] mb-2.5 pl-1">
                  User ID
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="h-4 w-4 text-[#A0AAB8]" />
                  </div>
                  <input
                    type="text"
                    name="userId"
                    className="block w-full pl-11 pr-4 py-3.5 md:py-4 border border-transparent rounded-xl focus:border-[#0D2A1D] focus:ring-1 focus:ring-[#0D2A1D] bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)] outline-none text-sm transition-all text-[#0D2A1D] font-medium placeholder:text-[#A0AAB8] placeholder:font-normal"
                    placeholder="Enter your user ID"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-[0.08em] font-semibold text-[#8B95A5] mb-2.5 pl-1">
                  PASSWORD
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-[#A0AAB8]" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    className="block w-full pl-11 pr-11 py-3.5 md:py-4 border border-transparent rounded-xl focus:border-[#0D2A1D] focus:ring-1 focus:ring-[#0D2A1D] bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)] outline-none text-sm transition-all text-[#0D2A1D] font-medium placeholder:text-[#A0AAB8] placeholder:font-normal"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#A0AAB8] hover:text-[#0D2A1D] transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="w-full flex justify-center py-4 px-4 rounded-xl shadow-md text-[15px] font-semibold text-white bg-[#0D2A1D] hover:bg-[#153D2A] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0D2A1D] transition-all mt-6 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isPending ? 'Logging In...' : 'Log In'}
              </button>
            </form>
          </div>

          {/* Footer Area */}
          <div className="mt-12 pt-6 border-t border-[#E5E7EB] w-full text-center">
            <p className="text-[11px] font-semibold text-[#8B95A5] mb-3">Need help? Contact support:</p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-6 text-[12px] font-medium text-[#5E6B7D]">
              <div className="flex items-center">
                <Phone className="w-3.5 h-3.5 mr-1.5 opacity-80" />
                7020262435
              </div>
              <div className="flex items-center">
                <Mail className="w-3.5 h-3.5 mr-1.5 opacity-80" />
                aditya@turiyainfotech.com
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
