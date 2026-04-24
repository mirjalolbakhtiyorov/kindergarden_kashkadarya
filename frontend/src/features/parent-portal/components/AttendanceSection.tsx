import React, { useState } from 'react';
import { Calendar, UserCheck, ShieldAlert, AlertCircle, Clock, ChevronRight, CheckCircle2, XCircle } from 'lucide-react';
import { motion } from 'motion/react';

export const AttendanceSection = ({ data }: any) => {
  const [tomorrowAttending, setTomorrowAttending] = useState(true);

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-10">
      {/* Tomorrow Planning - Premium Block */}
      <div className="bg-brand-depth p-12 rounded-[4rem] text-white shadow-2xl relative overflow-hidden group border border-white/5">
         <div className="absolute top-0 right-0 w-80 h-80 bg-brand-primary/20 rounded-full blur-[100px] -mr-32 -mt-32 group-hover:bg-brand-primary/30 transition-all duration-1000"></div>
         <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-10">
            <div className="space-y-3 text-center md:text-left">
               <div className="flex items-center justify-center md:justify-start gap-3">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/50">Ertangi kun rejasi</p>
               </div>
               <h4 className="text-4xl font-black tracking-tighter">Farzandingiz ertaga bog'chaga boradimi?</h4>
               <p className="text-sm font-bold text-white/40 uppercase tracking-widest">Sana: 25-Aprel, 2026</p>
            </div>
            
            <div className="flex bg-white/5 p-3 rounded-[2.5rem] border border-white/10 backdrop-blur-xl">
               <button 
                 onClick={() => setTomorrowAttending(true)}
                 className={`flex items-center gap-3 px-10 py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest transition-all ${tomorrowAttending ? 'bg-emerald-500 text-white shadow-xl shadow-emerald-500/20 scale-105' : 'text-white/40 hover:text-white'}`}
               >
                  <CheckCircle2 size={20} /> Boradi
               </button>
               <button 
                 onClick={() => setTomorrowAttending(false)}
                 className={`flex items-center gap-3 px-10 py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest transition-all ${!tomorrowAttending ? 'bg-rose-500 text-white shadow-xl shadow-rose-500/20 scale-105' : 'text-white/40 hover:text-white'}`}
               >
                  <XCircle size={20} /> Bormaydi
               </button>
            </div>
         </div>
         <div className="mt-8 pt-8 border-t border-white/5 relative z-10">
            <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] text-center md:text-left">
               DIQQAT: Ertangi kun uchun ma'lumotni soat 20:00 gacha tasdiqlashingizni so'raymiz.
            </p>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { label: 'Kelgan kunlar', val: data.attendance.filter((a:any) => a.status === 'PRESENT').length, icon: UserCheck, color: 'emerald', label_uz: 'KUNLAR' },
          { label: 'Sababli (Kasal)', val: data.attendance.filter((a:any) => a.status === 'ABSENT_SICK').length, icon: ShieldAlert, color: 'amber', label_uz: 'KUNLAR' },
          { label: 'O\'tkazib yuborgan', val: data.attendance.filter((a:any) => a.status === 'ABSENT_OTHER').length, icon: AlertCircle, color: 'rose', label_uz: 'KUNLAR' }
        ].map((stat, i) => (
          <div key={i} className={`bg-white p-10 rounded-[3.5rem] border border-brand-border shadow-xl text-center space-y-4 group hover:border-brand-primary transition-all`}>
             <div className={`w-16 h-16 rounded-2xl bg-${stat.color}-50 text-${stat.color}-500 flex items-center justify-center mx-auto shadow-sm group-hover:scale-110 transition-all`}><stat.icon size={32} /></div>
             <div>
                <p className="text-[9px] font-black text-brand-muted uppercase tracking-widest">{stat.label}</p>
                <p className={`text-6xl font-black text-${stat.color}-600 tracking-tighter mt-1`}>{stat.val}</p>
                <p className="text-[9px] font-black text-brand-muted uppercase mt-1 tracking-widest">{stat.label_uz}</p>
             </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-[4rem] border border-brand-border overflow-hidden shadow-2xl">
         <div className="p-12 border-b border-slate-50 flex flex-col md:flex-row justify-between items-center gap-10 bg-slate-50/20">
            <div className="flex items-center gap-5">
               <div className="w-16 h-16 rounded-[2rem] bg-brand-primary text-white flex items-center justify-center shadow-2xl shadow-brand-primary/30"><Calendar size={32} /></div>
               <div>
                  <h5 className="text-3xl font-black text-brand-depth tracking-tighter uppercase">Davomat Jurnali</h5>
                  <p className="text-[10px] font-black text-brand-muted uppercase tracking-[0.3em] mt-1.5">Real vaqt rejimidagi ko'rsatkichlar</p>
               </div>
            </div>
            <button className="px-10 py-5 bg-brand-depth text-white rounded-3xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:bg-brand-primary transition-all active:scale-95">Hisobotni yuklab olish</button>
         </div>

         <div className="grid grid-cols-1 divide-y divide-slate-100">
            {data.attendance.length === 0 ? (
               <div className="p-40 text-center space-y-6">
                  <Calendar size={64} className="mx-auto text-slate-100" />
                  <p className="text-brand-muted font-black uppercase text-[11px] tracking-[0.4em]">Davomat ma'lumotlari kutilmoqda</p>
               </div>
            ) : (
              data.attendance.map((a:any) => (
                 <div key={a.id} className="p-10 flex items-center justify-between hover:bg-slate-50/80 transition-all group">
                    <div className="flex items-center gap-10">
                       <div className="text-center bg-white px-6 py-4 rounded-[2rem] border-2 border-slate-50 shadow-xl group-hover:scale-105 transition-all">
                          <p className="text-[10px] font-black text-brand-primary uppercase tracking-[0.2em] mb-1">APREL</p>
                          <p className="text-3xl font-black text-brand-depth leading-none">{a.date.split('-')[2]}</p>
                       </div>
                       <div className="space-y-1">
                          <p className="text-lg font-black text-brand-depth tracking-tight flex items-center gap-2">Bog'chaga kelganligi <ChevronRight size={16} className="text-brand-muted" /></p>
                          <p className="text-[10px] font-black text-brand-slate uppercase tracking-widest bg-slate-100 w-fit px-3 py-1 rounded-lg">{a.date}</p>
                       </div>
                    </div>
                    <div className="flex items-center gap-8">
                       {a.reason && (
                          <div className="hidden lg:flex items-center gap-3 bg-rose-50 px-5 py-3 rounded-2xl border border-rose-100">
                             <ShieldAlert size={16} className="text-rose-500" />
                             <p className="text-xs font-bold text-rose-700 italic">{a.reason}</p>
                          </div>
                       )}
                       <div className={`px-8 py-4 rounded-[1.5rem] border-2 font-black text-[11px] uppercase tracking-[0.2em] shadow-sm ${
                          a.status === 'PRESENT' 
                          ? 'bg-emerald-500 text-white border-emerald-400' 
                          : 'bg-rose-500 text-white border-rose-400'
                       }`}>
                          {a.status === 'PRESENT' ? 'KELDI' : 'KELMADI'}
                       </div>
                    </div>
                 </div>
              ))
            )}
         </div>
      </div>
    </motion.div>
  );
};
