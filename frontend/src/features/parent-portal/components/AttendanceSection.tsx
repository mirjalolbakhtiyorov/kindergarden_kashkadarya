import React, { useState } from 'react';
import { Calendar, UserCheck, ShieldAlert, AlertCircle, Clock, ChevronRight, CheckCircle2, XCircle, Download } from 'lucide-react';
import { motion } from 'motion/react';

export const AttendanceSection = ({ data }: any) => {
  const [tomorrowAttending, setTomorrowAttending] = useState(true);

  const stats = [
    { label: 'Kelgan', val: data?.attendance?.filter((a:any) => a.status === 'PRESENT').length || 0, icon: UserCheck, color: 'emerald' },
    { label: 'Sababli', val: data?.attendance?.filter((a:any) => a.status === 'ABSENT_SICK').length || 0, icon: ShieldAlert, color: 'amber' },
    { label: 'Kelmagan', val: data?.attendance?.filter((a:any) => a.status === 'ABSENT_OTHER').length || 0, icon: AlertCircle, color: 'rose' }
  ];

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6 md:space-y-10">
      {/* Tomorrow Planning */}
      <div className="bg-brand-depth p-6 md:p-12 rounded-[2rem] md:rounded-[4rem] text-white shadow-2xl relative overflow-hidden group border border-white/5">
         <div className="absolute top-0 right-0 w-64 md:w-80 h-64 md:h-80 bg-brand-primary/20 rounded-full blur-[80px] md:blur-[100px] -mr-32 -mt-32"></div>
         <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6 md:gap-10">
            <div className="space-y-2 text-center md:text-left">
               <p className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.4em] text-white/50">Rejalashtirish</p>
               <h4 className="text-xl md:text-3xl font-black tracking-tight">Ertaga bog'chaga boradimi?</h4>
            </div>
            
            <div className="flex bg-white/5 p-2 rounded-[1.5rem] md:rounded-[2.5rem] border border-white/10 backdrop-blur-xl">
               <button 
                 onClick={() => setTomorrowAttending(true)}
                 className={`flex items-center gap-2 px-6 py-3 md:px-10 md:py-5 rounded-[1.2rem] md:rounded-[2rem] font-black text-[10px] md:text-xs uppercase tracking-widest transition-all ${tomorrowAttending ? 'bg-emerald-500 text-white shadow-lg' : 'text-white/40 hover:text-white'}`}
               >
                  <CheckCircle2 size={16} md:size={20} /> Boradi
               </button>
               <button 
                 onClick={() => setTomorrowAttending(false)}
                 className={`flex items-center gap-2 px-6 py-3 md:px-10 md:py-5 rounded-[1.2rem] md:rounded-[2rem] font-black text-[10px] md:text-xs uppercase tracking-widest transition-all ${!tomorrowAttending ? 'bg-rose-500 text-white shadow-lg' : 'text-white/40 hover:text-white'}`}
               >
                  <XCircle size={16} md:size={20} /> Yo'q
               </button>
            </div>
         </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-3 md:gap-8">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-4 md:p-10 rounded-[1.5rem] md:rounded-[3.5rem] border border-brand-border shadow-sm text-center space-y-2 md:space-y-4 group hover:border-brand-primary transition-all">
             <div className={`w-10 h-10 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-${stat.color}-50 text-${stat.color}-500 flex items-center justify-center mx-auto shadow-sm group-hover:scale-110 transition-all`}>
                <stat.icon size={20} md:size={32} />
             </div>
             <div>
                <p className="text-[7px] md:text-[9px] font-black text-brand-muted uppercase tracking-widest">{stat.label}</p>
                <p className={`text-2xl md:text-6xl font-black text-${stat.color}-600 tracking-tighter`}>{stat.val}</p>
             </div>
          </div>
        ))}
      </div>

      {/* History List */}
      <div className="bg-white rounded-[2rem] md:rounded-[4rem] border border-brand-border overflow-hidden shadow-sm">
         <div className="p-6 md:p-12 border-b border-slate-50 flex items-center justify-between bg-slate-50/20">
            <div className="flex items-center gap-4">
               <div className="w-10 h-10 md:w-16 md:h-16 rounded-xl md:rounded-[2rem] bg-brand-primary text-white flex items-center justify-center shadow-lg shadow-brand-primary/30"><Calendar size={20} md:size={32} /></div>
               <div>
                  <h5 className="text-base md:text-3xl font-black text-brand-depth tracking-tighter uppercase leading-none">Jurnal</h5>
                  <p className="text-[8px] md:text-[10px] font-black text-brand-muted uppercase tracking-[0.3em] mt-1">Oxirgi qaydlar</p>
               </div>
            </div>
            <button className="p-3 md:px-8 md:py-4 bg-brand-depth text-white rounded-xl md:rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-brand-primary transition-all">
               <Download size={16} className="md:hidden" />
               <span className="hidden md:block">Yuklab olish</span>
            </button>
         </div>

         <div className="divide-y divide-slate-100">
            {data?.attendance?.length === 0 ? (
               <div className="p-20 text-center text-brand-muted uppercase text-[10px] font-black tracking-widest">Ma'lumot yo'q</div>
            ) : (
              data?.attendance?.map((a:any) => (
                 <div key={a.id} className="p-6 md:p-10 flex items-center justify-between hover:bg-slate-50/80 transition-all group">
                    <div className="flex items-center gap-4 md:gap-10">
                       <div className="text-center bg-white px-3 py-2 md:px-6 md:py-4 rounded-xl md:rounded-[2rem] border-2 border-slate-50 shadow-md">
                          <p className="text-[7px] md:text-[10px] font-black text-brand-primary uppercase mb-0.5">APREL</p>
                          <p className="text-lg md:text-3xl font-black text-brand-depth leading-none">{a.date.split('-')[2]}</p>
                       </div>
                       <div className="space-y-0.5">
                          <p className="text-sm md:text-lg font-black text-brand-depth tracking-tight">Bog'chaga keldi</p>
                          <p className="text-[8px] md:text-[10px] font-black text-brand-slate uppercase bg-slate-100 w-fit px-2 py-0.5 rounded-md">{a.date}</p>
                       </div>
                    </div>
                    <div className={`px-4 py-2 md:px-8 md:py-4 rounded-lg md:rounded-[1.5rem] font-black text-[9px] md:text-[11px] uppercase tracking-widest shadow-sm ${
                       a.status === 'PRESENT' ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
                    }`}>
                       {a.status === 'PRESENT' ? 'KELDI' : 'YO\'Q'}
                    </div>
                 </div>
              ))
            )}
         </div>
      </div>
    </motion.div>
  );
};
