import React from 'react';
import { Activity, ShieldAlert, FileText, Target, Thermometer, Heart } from 'lucide-react';
import { motion } from 'motion/react';

export const MedicalSection = ({ parentData }: any) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-12">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
       <div className="bg-white p-12 rounded-[4rem] border border-brand-border shadow-2xl shadow-blue-500/5 flex items-center gap-10 relative overflow-hidden group hover:border-blue-500 transition-all">
          <div className="absolute right-0 bottom-0 opacity-[0.03] group-hover:scale-110 transition-transform"><Activity size={180} /></div>
          <div className="w-24 h-24 rounded-[2.5rem] bg-blue-50 text-blue-600 flex items-center justify-center border-2 border-white shadow-xl shrink-0 group-hover:rotate-12 transition-all"><Activity size={40} /></div>
          <div>
             <p className="text-[11px] font-black text-brand-muted uppercase tracking-[0.3em] mb-2">Bo'yi (O'sish)</p>
             <h4 className="text-6xl font-black text-blue-700 tracking-tighter">{parentData.height || '--'} <span className="text-xl font-bold opacity-40 uppercase">cm</span></h4>
             <div className="mt-4 flex items-center gap-2 text-emerald-500 text-[10px] font-black uppercase tracking-widest bg-emerald-50 w-fit px-3 py-1 rounded-lg">
                <Target size={12}/> Dinamika ijobiy
             </div>
          </div>
       </div>

       <div className="bg-white p-12 rounded-[4rem] border border-brand-border shadow-2xl shadow-rose-500/5 flex items-center gap-10 relative overflow-hidden group hover:border-rose-500 transition-all">
          <div className="absolute right-0 bottom-0 opacity-[0.03] group-hover:scale-110 transition-transform"><Heart size={180} /></div>
          <div className="w-24 h-24 rounded-[2.5rem] bg-rose-50 text-rose-600 flex items-center justify-center border-2 border-white shadow-xl shrink-0 group-hover:rotate-12 transition-all"><Heart size={40} /></div>
          <div>
             <p className="text-[11px] font-black text-brand-muted uppercase tracking-[0.3em] mb-2">Vazni (Og'irligi)</p>
             <h4 className="text-6xl font-black text-rose-700 tracking-tighter">{parentData.weight || '--'} <span className="text-xl font-bold opacity-40 uppercase">kg</span></h4>
             <div className="mt-4 flex items-center gap-2 text-emerald-500 text-[10px] font-black uppercase tracking-widest bg-emerald-50 w-fit px-3 py-1 rounded-lg">
                <Target size={12}/> Normal ko'rsatkich
             </div>
          </div>
       </div>
    </div>

    <div className="bg-amber-50 p-12 rounded-[4rem] border-2 border-amber-100 relative overflow-hidden shadow-xl shadow-amber-500/5 group">
       <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform"><ShieldAlert size={100} className="text-amber-600" /></div>
       <div className="relative z-10 space-y-6">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-amber-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/30"><ShieldAlert size={24} /></div>
             <h5 className="text-2xl font-black text-amber-950 tracking-tight">Allergiyalar va Maxsus parhez</h5>
          </div>
          <div className="bg-white/80 backdrop-blur-md p-8 rounded-[2.5rem] border border-amber-200/50 shadow-inner">
             <p className="text-lg font-black text-amber-900 leading-relaxed uppercase tracking-tight">
                {parentData.allergies || 'HECH QANDAY ALLERGIYA YOKI CHEKLOVLAR ANIQLANMAGAN'}
             </p>
          </div>
       </div>
    </div>

    <div className="bg-white p-12 rounded-[4rem] border border-brand-border shadow-sm group">
       <div className="flex items-center gap-4 mb-8">
          <div className="w-10 h-10 bg-brand-primary/10 text-brand-primary rounded-xl flex items-center justify-center"><FileText size={20} /></div>
          <h5 className="font-black text-xs uppercase tracking-[0.3em] text-brand-depth">Tibbiy ko'rik va shifokor tavsiyalari</h5>
       </div>
       <div className="bg-slate-50 p-10 rounded-[3rem] border-2 border-slate-100 group-hover:bg-white group-hover:border-brand-primary/20 transition-all">
          <p className="text-base font-bold text-brand-slate leading-loose italic">
             {parentData.medical_notes || 'Bolada jiddiy tibbiy cheklovlar yoki maxsus qaydlar aniqlanmagan. Oylik profilaktik tekshiruvlar rejali ravishda davom etmoqda. Sog\'lom o\'sish dinamikasi kuzatilmoqda.'}
          </p>
       </div>
    </div>
  </motion.div>
);
