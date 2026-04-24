import React from 'react';
import { Apple, Clock, Flame, Zap, Droplets, Target, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';

export const MenuSection = () => (
  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-12">
    <div className="bg-emerald-50 p-12 rounded-[5rem] border-2 border-emerald-100 flex flex-col lg:flex-row items-center gap-12 relative overflow-hidden">
       <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-200/20 rounded-full blur-[100px] -mr-48 -mt-48"></div>
       <div className="w-32 h-32 bg-white rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-emerald-500/20 shrink-0 border-4 border-emerald-50 animate-bounce-slow">
          <Apple className="text-emerald-500" size={64} />
       </div>
       <div className="text-center lg:text-left space-y-4">
          <h4 className="text-4xl font-black text-emerald-900 tracking-tighter">Premium Parhez Menyu</h4>
          <p className="text-emerald-700 text-sm font-bold uppercase tracking-[0.2em] leading-relaxed max-w-2xl">
             Bizning barcha taomlarimiz professional dietologlar tomonidan bolaning yoshi va fiziologik ehtiyojlaridan kelib chiqib shakllantirilgan. 100% tabiiy va yangi mahsulotlar.
          </p>
       </div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
       {[
         { type: 'Nonushta', time: '08:30', meal: 'Sutli bo\'tqa, sariyog\'li non va ko\'k choy', iron: '2.8mg', carbs: '48g', vitamins: 'A, D, B12', cals: '340' },
         { type: 'Tushlik', time: '12:30', meal: 'Mastava, Mo\'shxo\'rda va yangi yopilgan non', iron: '5.4mg', carbs: '65g', vitamins: 'C, E, K', cals: '580' },
         { type: 'Ikkinchi tushlik', time: '16:00', meal: 'Mevali assorti, pechenye va sharbat', iron: '1.5mg', carbs: '35g', vitamins: 'B6, C, A', cals: '230' },
         { type: 'Kechki ovqat', time: '18:30', meal: 'Bug\'da pishgan kotlet, guruch va kefir', iron: '4.9mg', carbs: '42g', vitamins: 'Zinc, Mg, B6', cals: '420' }
       ].map((item, idx) => (
         <motion.div 
           whileHover={{ scale: 1.02 }}
           key={idx} 
           className="bg-white border-2 border-slate-50 rounded-[4rem] p-12 shadow-[0_40px_80px_rgba(0,0,0,0.05)] hover:border-brand-primary transition-all group relative overflow-hidden"
         >
            <div className="absolute top-0 left-0 w-2 h-full bg-emerald-500 opacity-20 group-hover:opacity-100 transition-opacity"></div>
            
            <div className="flex justify-between items-center mb-10">
               <div className="px-6 py-2 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-[0.3em] rounded-2xl border border-emerald-100">{item.type}</div>
               <div className="flex items-center gap-3 text-brand-muted font-black text-xs bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
                  <Clock size={16} className="text-brand-primary"/> {item.time}
               </div>
            </div>

            <h5 className="text-3xl font-black text-brand-depth mb-10 leading-tight tracking-tight group-hover:text-brand-primary transition-colors">{item.meal}</h5>
            
            <div className="grid grid-cols-2 gap-6 pt-10 border-t border-slate-100">
               <div className="bg-slate-50 p-5 rounded-3xl flex items-center justify-between group-hover:bg-white transition-colors border border-transparent group-hover:border-slate-100">
                  <div className="flex items-center gap-3">
                     <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-500 flex items-center justify-center"><Flame size={16} /></div>
                     <span className="text-[10px] font-black text-brand-muted uppercase">Temir</span>
                  </div>
                  <span className="text-sm font-black text-brand-depth">{item.iron}</span>
               </div>
               <div className="bg-slate-50 p-5 rounded-3xl flex items-center justify-between group-hover:bg-white transition-colors border border-transparent group-hover:border-slate-100">
                  <div className="flex items-center gap-3">
                     <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-500 flex items-center justify-center"><Zap size={16} /></div>
                     <span className="text-[10px] font-black text-brand-muted uppercase">Uglerod</span>
                  </div>
                  <span className="text-sm font-black text-brand-depth">{item.carbs}</span>
               </div>
               <div className="bg-slate-50 p-5 rounded-3xl flex items-center justify-between col-span-2 group-hover:bg-white transition-colors border border-transparent group-hover:border-slate-100">
                  <div className="flex items-center gap-3">
                     <div className="w-8 h-8 rounded-lg bg-brand-primary/10 text-brand-primary flex items-center justify-center"><Droplets size={16} /></div>
                     <span className="text-[10px] font-black text-brand-muted uppercase">Vitamin Kompleksi</span>
                  </div>
                  <span className="text-sm font-black text-brand-primary tracking-widest">{item.vitamins}</span>
               </div>
               <div className="bg-brand-depth p-6 rounded-[2rem] flex items-center justify-between col-span-2 text-white shadow-2xl shadow-brand-depth/30 group-hover:bg-brand-primary transition-colors">
                  <div className="flex items-center gap-3">
                     <Target size={20} className="opacity-40" />
                     <span className="text-[11px] font-black uppercase tracking-[0.2em] opacity-60">Energetik Quvvat</span>
                  </div>
                  <span className="text-2xl font-black tracking-tighter">{item.cals} <span className="text-xs opacity-40">kkal</span></span>
               </div>
            </div>
         </motion.div>
       ))}
    </div>
  </motion.div>
);
