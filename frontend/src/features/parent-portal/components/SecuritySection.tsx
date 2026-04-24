import React from 'react';
import { ShieldCheck, User, Key, Save, Fingerprint, Lock } from 'lucide-react';
import { motion } from 'motion/react';

export const SecuritySection = ({ credentials, setCredentials, isSaving, onUpdate }: any) => (
  <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, x: 0 }} className="space-y-12">
    <div className="p-12 bg-gradient-to-br from-brand-primary/10 to-brand-primary/5 border-2 border-brand-primary/10 rounded-[4rem] flex flex-col md:flex-row items-center gap-10 relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-20 rounded-full blur-3xl -mr-32 -mt-32"></div>
      <div className="w-24 h-24 bg-white rounded-[2.5rem] shadow-2xl flex items-center justify-center text-brand-primary border-4 border-brand-primary/10 shrink-0 group-hover:rotate-6 transition-all duration-700">
        <ShieldCheck size={48} />
      </div>
      <div className="text-center md:text-left space-y-2">
        <h4 className="text-3xl font-black text-brand-depth tracking-tighter uppercase leading-none">Xavfsizlik Boshqaruvi</h4>
        <p className="text-brand-muted text-[11px] font-black uppercase tracking-[0.3em] mt-2">Shaxsiy kabinetingizga kirish ma'lumotlarini boshqaring</p>
      </div>
    </div>

    <form onSubmit={onUpdate} className="space-y-12 max-w-4xl mx-auto">
       <div className="bg-white p-12 rounded-[4rem] border border-brand-border shadow-2xl shadow-slate-200/40 space-y-10 relative">
          <div className="flex items-center gap-4 mb-2">
             <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100"><Fingerprint size={20} className="text-brand-primary" /></div>
             <h5 className="font-black text-xs uppercase tracking-[0.2em] text-brand-depth">Sessiya Ma'lumotlari</h5>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black text-brand-muted uppercase tracking-[0.4em] ml-4">Tizim Logini (Username)</label>
            <div className="relative group">
              <User className="absolute left-8 top-1/2 -translate-y-1/2 text-brand-muted group-focus-within:text-brand-primary transition-colors" size={24} />
              <input 
                type="text" 
                value={credentials.login}
                onChange={(e) => setCredentials({...credentials, login: e.target.value})}
                className="w-full pl-20 pr-8 py-7 bg-slate-50 border-4 border-transparent focus:border-brand-primary focus:bg-white rounded-[2.5rem] font-black text-xl text-brand-depth outline-none transition-all shadow-inner"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-4">
             <div className="space-y-4">
                <label className="text-[10px] font-black text-brand-muted uppercase tracking-[0.4em] ml-4">Yangi Parol</label>
                <div className="relative group">
                  <Lock className="absolute left-8 top-1/2 -translate-y-1/2 text-brand-muted group-focus-within:text-brand-primary transition-colors" size={24} />
                  <input 
                    type="password" 
                    value={credentials.newPassword}
                    onChange={(e) => setCredentials({...credentials, newPassword: e.target.value})}
                    placeholder="••••••••"
                    className="w-full pl-20 pr-8 py-7 bg-slate-50 border-4 border-transparent focus:border-brand-primary focus:bg-white rounded-[2.5rem] font-black text-xl text-brand-depth outline-none transition-all shadow-inner"
                  />
                </div>
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-black text-brand-muted uppercase tracking-[0.4em] ml-4">Parolni Tasdiqlash</label>
                <div className="relative group">
                  <Key className="absolute left-8 top-1/2 -translate-y-1/2 text-brand-muted group-focus-within:text-brand-primary transition-colors" size={24} />
                  <input 
                    type="password" 
                    value={credentials.confirmPassword}
                    onChange={(e) => setCredentials({...credentials, confirmPassword: e.target.value})}
                    placeholder="••••••••"
                    className="w-full pl-20 pr-8 py-7 bg-slate-50 border-4 border-transparent focus:border-brand-primary focus:bg-white rounded-[2.5rem] font-black text-xl text-brand-depth outline-none transition-all shadow-inner"
                  />
                </div>
              </div>
          </div>
       </div>

       <div className="flex flex-col md:flex-row items-center gap-8 justify-center">
          <div className="bg-amber-50 px-8 py-4 rounded-2xl border border-amber-100 flex items-center gap-3">
             <AlertCircle size={18} className="text-amber-500" />
             <p className="text-[10px] font-bold text-amber-700 leading-tight">DIQQAT: Loginni o'zgartirsangiz, <br/>kelajakda o'sha login orqali kirishingiz kerak bo'ladi.</p>
          </div>
          <button 
            type="submit"
            disabled={isSaving}
            className="w-full md:w-auto flex items-center justify-center gap-4 px-20 py-7 bg-brand-depth text-white font-black rounded-[2.5rem] shadow-[0_30px_60px_rgba(0,0,0,0.2)] hover:bg-brand-primary transition-all disabled:opacity-50 uppercase text-xs tracking-[0.3em] active:scale-95 group"
          >
            {isSaving ? <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={24} className="group-hover:-translate-y-0.5 transition-transform" />}
            Ma'lumotlarni saqlash
          </button>
       </div>
    </form>
  </motion.div>
);
