import React from 'react';
import { Syringe, Calendar, CheckCircle2, Clock, ShieldCheck, Heart } from 'lucide-react';
import { motion } from 'motion/react';

export const VaccineSection = ({ data }: any) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-12">
    <div className="bg-sky-600 text-white p-16 rounded-[5rem] shadow-2xl relative overflow-hidden group">
       <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/10 rounded-full blur-[120px] -mr-40 -mt-40 group-hover:bg-white/20 transition-all duration-1000"></div>
       <div className="absolute bottom-0 left-0 w-80 h-80 bg-sky-400/20 rounded-full blur-[80px] -ml-20 -mb-20"></div>
       
       <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="space-y-4 text-center md:text-left">
             <div className="flex items-center justify-center md:justify-start gap-3">
                <div className="w-8 h-px bg-sky-300"></div>
                <p className="text-[10px] font-black uppercase tracking-[0.5em] text-sky-200">Sog'lom Kelajak</p>
             </div>
             <h4 className="text-5xl font-black tracking-tighter">Emlash Monitoringi</h4>
             <p className="text-lg font-bold text-sky-100/80 max-w-md uppercase tracking-widest text-xs">Rejali sog'lomlashtirish ishlari va immunizatsiya nazorati</p>
          </div>
          <div className="w-28 h-28 rounded-[3rem] bg-white/10 border-4 border-white/20 flex items-center justify-center backdrop-blur-xl shadow-2xl group-hover:rotate-12 transition-transform duration-700">
             <Syringe size={56} className="text-sky-300" />
          </div>
       </div>
    </div>

    <div className="bg-white rounded-[4rem] border border-brand-border overflow-hidden shadow-2xl shadow-slate-200/40 relative">
       <div className="p-10 border-b border-slate-50 flex items-center justify-between bg-slate-50/20">
          <div className="flex items-center gap-4">
             <ShieldCheck size={20} className="text-brand-primary" />
             <h5 className="font-black text-xs uppercase tracking-[0.3em] text-brand-depth">Milliy emlash kalendari bo'yicha holat</h5>
          </div>
          <Heart size={20} className="text-rose-400 animate-pulse" />
       </div>
       <div className="divide-y divide-slate-100">
          {data.vaccinations.length === 0 ? (
             <div className="p-40 text-center space-y-4">
                <Clock size={48} className="mx-auto text-slate-100" />
                <p className="text-brand-muted font-black uppercase text-[10px] tracking-[0.4em]">Emlash jadvali shakllantirilmoqda</p>
             </div>
          ) : (
             data.vaccinations.map((v:any) => (
               <div key={v.id} className="p-12 flex flex-col sm:flex-row items-center justify-between group hover:bg-sky-50/30 transition-all gap-8">
                  <div className="flex items-center gap-10">
                     <div className={`w-20 h-20 rounded-[2.5rem] flex items-center justify-center border-4 transition-all shadow-xl ${v.status === 'TAKEN' ? 'bg-emerald-50 border-white text-emerald-500' : 'bg-slate-50 border-white text-slate-300 group-hover:bg-white'}`}>
                        <Syringe size={36} />
                     </div>
                     <div className="space-y-2">
                        <h5 className="text-2xl font-black text-brand-depth tracking-tight leading-none">{v.vaccine_name}</h5>
                        <div className="flex flex-wrap gap-3">
                           <div className="flex items-center gap-2 text-[10px] font-black text-brand-muted uppercase bg-white border border-brand-border px-4 py-1.5 rounded-xl shadow-sm">
                              <Calendar size={14} className="text-brand-primary" /> Reja: {v.planned_date}
                           </div>
                           {v.status === 'TAKEN' && (
                              <div className="flex items-center gap-2 text-[10px] font-black text-emerald-600 uppercase bg-emerald-50 border border-emerald-100 px-4 py-1.5 rounded-xl shadow-sm">
                                 <CheckCircle2 size={14}/> Olingan: {v.taken_date}
                              </div>
                           )}
                        </div>
                     </div>
                  </div>
                  <div className={`px-10 py-5 rounded-[2rem] text-xs font-black uppercase tracking-[0.2em] shadow-2xl transition-all border-b-4 ${
                     v.status === 'TAKEN' 
                     ? 'bg-emerald-500 text-white border-emerald-700 shadow-emerald-500/20' 
                     : 'bg-brand-depth text-white border-black shadow-brand-depth/20'
                  }`}>
                     {v.status === 'TAKEN' ? 'Muvaffaqiyatli' : 'Kutilmoqda'}
                  </div>
               </div>
             ))
          )}
       </div>
    </div>
  </motion.div>
);
