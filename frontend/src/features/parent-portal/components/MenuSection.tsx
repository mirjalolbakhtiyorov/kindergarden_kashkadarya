import React from 'react';
import { Apple, Clock, Flame, Zap, Droplets, Target } from 'lucide-react';
import { motion } from 'motion/react';

const MEAL_LABELS: Record<string, string> = {
  'BREAKFAST': 'Nonushta',
  'LUNCH': 'Tushlik',
  'TEA': 'Ikkinchi tushlik',
  'DINNER': 'Kechki ovqat'
};

const MEAL_TIMES: Record<string, string> = {
  'BREAKFAST': '08:30',
  'LUNCH': '12:30',
  'TEA': '16:00',
  'DINNER': '18:30'
};

export const MenuSection = ({ data }: any) => (
  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6 md:space-y-12">
    <div className="bg-emerald-50 p-6 md:p-12 rounded-[2rem] md:rounded-[4rem] border-2 border-emerald-100 flex flex-col md:flex-row items-center gap-6 md:gap-12 text-center md:text-left">
       <div className="w-24 h-24 md:w-32 md:h-32 bg-white rounded-[2rem] md:rounded-[2.5rem] flex items-center justify-center shadow-lg shrink-0 border-4 border-emerald-50">
          <Apple className="text-emerald-500" size={56} />
       </div>
       <div className="space-y-2">
          <h4 className="text-2xl md:text-4xl font-black text-emerald-900 tracking-tighter">Parhez Menyu</h4>
          <p className="text-emerald-700 text-xs md:text-sm font-bold uppercase tracking-widest max-w-2xl">
             100% tabiiy va yangi mahsulotlardan tayyorlangan.
          </p>
       </div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10">
       {data?.menu?.length > 0 ? data.menu.map((item: any, idx: number) => (
         <motion.div 
           key={idx} 
           className="bg-white border border-slate-100 rounded-[2rem] md:rounded-[3rem] p-6 md:p-10 shadow-sm hover:shadow-xl hover:border-brand-primary transition-all group"
         >
            <div className="flex justify-between items-center mb-6">
               <div className="px-4 py-2 bg-emerald-50 text-emerald-600 text-[9px] md:text-[10px] font-black uppercase tracking-widest rounded-xl border border-emerald-100">
                  {MEAL_LABELS[item.meal_type] || item.meal_type}
               </div>
               <div className="flex items-center gap-2 text-brand-muted font-black text-[9px] md:text-xs bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                  <Clock size={14} className="text-brand-primary"/> {MEAL_TIMES[item.meal_type] || '--:--'}
               </div>
            </div>

            <h5 className="text-xl md:text-2xl font-black text-brand-depth mb-3 leading-tight tracking-tight">
               {item.meal_name}
            </h5>
            <p className="text-[10px] md:text-xs font-bold text-brand-slate mb-6 bg-slate-50 p-3 rounded-lg border-l-4 border-emerald-300 italic">
               Tarkibi: {item.vitamins}
            </p>
            
            <div className="grid grid-cols-2 gap-3 md:gap-4 pt-6 border-t border-slate-100">
               {[
                  {icon: Flame, label: "Temir", value: `${item.iron} mg`, color: "orange"},
                  {icon: Zap, label: "Uglerod", value: `${item.carbohydrates} g`, color: "blue"},
               ].map(nut => (
                  <div key={nut.label} className="bg-slate-50 p-3 md:p-4 rounded-xl md:rounded-2xl flex items-center justify-between border border-transparent group-hover:border-slate-100">
                     <div className="flex items-center gap-2">
                        <div className={`w-7 h-7 rounded-lg bg-${nut.color}-100 text-${nut.color}-500 flex items-center justify-center`}><nut.icon size={14} /></div>
                        <span className="text-[8px] md:text-[10px] font-black text-brand-muted uppercase">{nut.label}</span>
                     </div>
                     <span className="text-[10px] md:text-sm font-black text-brand-depth">{nut.value}</span>
                  </div>
               ))}
               <div className="bg-brand-depth p-4 md:p-5 rounded-xl md:rounded-2xl flex items-center justify-between col-span-2 text-white shadow-lg group-hover:bg-brand-primary">
                  <div className="flex items-center gap-2 md:gap-3">
                     <Target size={16} className="opacity-40" />
                     <span className="text-[9px] md:text-[11px] font-black uppercase opacity-60">Quvvati</span>
                  </div>
                  <span className="text-lg md:text-2xl font-black tracking-tighter">{item.calories} <span className="text-xs opacity-40">kkal</span></span>
               </div>
            </div>
         </motion.div>
       )) : (
         <div className="col-span-1 lg:col-span-2 bg-white p-12 md:p-20 rounded-[2rem] md:rounded-[4rem] border-2 border-dashed border-brand-border flex flex-col items-center justify-center text-center space-y-4">
            <Apple size={32} md:size={48} className="text-brand-muted" />
            <p className="text-brand-muted font-black uppercase tracking-widest text-[10px] md:text-xs">Bugungi menyu kiritilmagan</p>
         </div>
       )}
    </div>
  </motion.div>
);
