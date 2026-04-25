import React from 'react';
import { ShieldCheck, UserCheck, Smartphone, Trash2, Contact } from 'lucide-react';
import { motion } from 'motion/react';

export const PickupSection = ({ data }: any) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6 md:space-y-12">
     <div className="flex flex-col sm:flex-row justify-between items-center bg-white p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] border-2 border-slate-50 shadow-sm gap-6">
        <div className="text-center sm:text-left">
           <h4 className="text-2xl md:text-3xl font-black text-brand-depth tracking-tighter leading-none">Ishonchli Vakillar</h4>
           <p className="text-brand-muted text-xs font-bold uppercase tracking-widest mt-2 flex items-center justify-center sm:justify-start gap-2">
              <ShieldCheck size={16} className="text-emerald-500" /> Faqat ruxsat etilgan shaxslar
           </p>
        </div>
        <button className="w-full sm:w-auto px-8 py-4 bg-brand-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg hover:scale-105 transition-all flex items-center justify-center gap-3">
           <UserCheck size={20} /> Yangi vakil
        </button>
     </div>
     <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10">
        {data?.authorizedPickups?.map((v:any) => (
           <div key={v.id} className="bg-white p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] border border-brand-border shadow-sm flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl md:rounded-[2.5rem] bg-slate-50 border-4 border-white shadow-md flex items-center justify-center overflow-hidden shrink-0 relative">
                 {v.photo_url ? (
                    <img src={v.photo_url} alt={v.full_name} className="w-full h-full object-cover" />
                 ) : (
                    <div className="text-brand-muted flex flex-col items-center">
                       <Contact size={40} md:size={48} className="opacity-20" />
                       <p className="text-[8px] font-black mt-2">RASM</p>
                    </div>
                 )}
              </div>
              <div className="flex-1 space-y-3">
                 <div>
                    <p className="text-[10px] md:text-[11px] font-black text-brand-primary uppercase tracking-widest mb-1">{v.relation}</p>
                    <p className="text-xl md:text-2xl font-black text-brand-depth tracking-tighter leading-none">{v.full_name}</p>
                 </div>
                 <div className="flex items-center justify-center sm:justify-start gap-2 text-sm font-bold text-brand-depth pt-1">
                    <Smartphone size={16} className="text-brand-muted" /> {v.phone}
                 </div>
                 <div className="pt-3 flex justify-center sm:justify-start">
                    <button className="px-5 py-2 bg-rose-50 text-rose-500 rounded-lg font-black text-[9px] uppercase tracking-widest border border-rose-100 hover:bg-rose-500 hover:text-white transition-all shadow-sm">
                       <Trash2 size={12} className="inline mr-1.5"/> O'chirish
                    </button>
                 </div>
              </div>
           </div>
        ))}
     </div>
  </motion.div>
);
