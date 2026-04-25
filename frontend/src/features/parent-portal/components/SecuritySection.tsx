import React from 'react';
import { ShieldCheck, User, Key, Save, Fingerprint, Lock, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';

export const SecuritySection = ({ credentials, setCredentials, isSaving, onUpdate }: any) => (
  <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, x: 0 }} className="space-y-8 md:space-y-12">
    <div className="p-8 md:p-12 bg-gradient-to-br from-brand-primary/10 to-brand-primary/5 border-2 border-brand-primary/10 rounded-[2rem] md:rounded-[4rem] flex flex-col md:flex-row items-center gap-6 md:gap-10 text-center md:text-left">
      <div className="w-20 h-20 md:w-24 md:h-24 bg-white rounded-2xl md:rounded-[2.5rem] shadow-lg flex items-center justify-center text-brand-primary border-4 border-brand-primary/10 shrink-0">
        <ShieldCheck size={40} md:size={48} />
      </div>
      <div className="space-y-2">
        <h4 className="text-2xl md:text-3xl font-black text-brand-depth tracking-tighter uppercase leading-none">Xavfsizlik</h4>
        <p className="text-brand-muted text-xs md:text-[11px] font-black uppercase tracking-widest mt-2">Kirish ma'lumotlarini boshqarish</p>
      </div>
    </div>

    <form onSubmit={onUpdate} className="space-y-8 md:space-y-12 max-w-4xl mx-auto">
       <div className="bg-white p-6 md:p-12 rounded-[2rem] md:rounded-[4rem] border border-brand-border shadow-sm space-y-6 md:space-y-10">
          <div className="space-y-3">
            <label className="text-[9px] md:text-[10px] font-black text-brand-muted uppercase tracking-[0.3em] ml-4">Login (Username)</label>
            <div className="relative">
              <User className="absolute left-6 md:left-8 top-1/2 -translate-y-1/2 text-brand-muted" size={20} md:size={24} />
              <input 
                type="text" 
                value={credentials.login}
                onChange={(e) => setCredentials({...credentials, login: e.target.value})}
                className="w-full pl-14 md:pl-20 pr-6 py-5 md:py-7 bg-slate-50 border-2 md:border-4 border-transparent focus:border-brand-primary focus:bg-white rounded-2xl md:rounded-[2.5rem] font-bold md:font-black text-base md:text-xl text-brand-depth outline-none transition-all shadow-inner"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 pt-4">
             <div className="space-y-3">
                <label className="text-[9px] md:text-[10px] font-black text-brand-muted uppercase tracking-[0.3em] ml-4">Yangi Parol</label>
                <div className="relative">
                  <Lock className="absolute left-6 md:left-8 top-1/2 -translate-y-1/2 text-brand-muted" size={20} md:size={24} />
                  <input 
                    type="password" 
                    value={credentials.newPassword}
                    onChange={(e) => setCredentials({...credentials, newPassword: e.target.value})}
                    placeholder="••••••••"
                    className="w-full pl-14 md:pl-20 pr-6 py-5 md:py-7 bg-slate-50 border-2 md:border-4 border-transparent focus:border-brand-primary focus:bg-white rounded-2xl md:rounded-[2.5rem] font-bold md:font-black text-base md:text-xl text-brand-depth outline-none transition-all shadow-inner"
                  />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[9px] md:text-[10px] font-black text-brand-muted uppercase tracking-[0.3em] ml-4">Parolni Tasdiqlang</label>
                <div className="relative">
                  <Key className="absolute left-6 md:left-8 top-1/2 -translate-y-1/2 text-brand-muted" size={20} md:size={24} />
                  <input 
                    type="password" 
                    value={credentials.confirmPassword}
                    onChange={(e) => setCredentials({...credentials, confirmPassword: e.target.value})}
                    placeholder="••••••••"
                    className="w-full pl-14 md:pl-20 pr-6 py-5 md:py-7 bg-slate-50 border-2 md:border-4 border-transparent focus:border-brand-primary focus:bg-white rounded-2xl md:rounded-[2.5rem] font-bold md:font-black text-base md:text-xl text-brand-depth outline-none transition-all shadow-inner"
                  />
                </div>
              </div>
          </div>
       </div>

       <div className="flex flex-col md:flex-row items-center gap-6 justify-center">
          <div className="bg-amber-50 px-6 py-3 rounded-xl border border-amber-100 flex items-center gap-3">
             <AlertCircle size={16} className="text-amber-500" />
             <p className="text-[9px] font-bold text-amber-700 leading-tight">DIQQAT: Login o'zgaradi!</p>
          </div>
          <button 
            type="submit"
            disabled={isSaving}
            className="w-full md:w-auto flex items-center justify-center gap-3 px-12 py-5 bg-brand-depth text-white font-black rounded-2xl shadow-lg hover:bg-brand-primary transition-all disabled:opacity-50 uppercase text-xs tracking-widest"
          >
            {isSaving ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={20} />}
            Saqlash
          </button>
       </div>
    </form>
  </motion.div>
);
