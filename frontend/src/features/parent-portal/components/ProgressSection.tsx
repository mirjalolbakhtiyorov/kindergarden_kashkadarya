import React from 'react';
import { Star, MessageSquare, Target, Zap, Award, Sparkles, TrendingUp } from 'lucide-react';
import { motion } from 'motion/react';

export const ProgressSection = ({ data }: any) => (
  <motion.div initial={{ opacity: 0, scale: 1.05 }} animate={{ opacity: 1, scale: 1 }} className="space-y-12">
    {/* Hero Statistics */}
    <div className="bg-gradient-to-br from-amber-400 via-orange-400 to-rose-500 p-16 rounded-[5rem] text-white shadow-[0_50px_100px_rgba(251,191,36,0.2)] relative overflow-hidden flex flex-col lg:flex-row justify-between items-center gap-12">
       <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
       <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-white/10 rounded-full blur-[100px]"></div>
       
       <div className="relative z-10 text-center lg:text-left space-y-4">
          <div className="flex items-center justify-center lg:justify-start gap-3">
             <div className="w-10 h-px bg-white/40"></div>
             <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/70">O'zlashtirish Rejasi</p>
          </div>
          <h4 className="text-5xl md:text-7xl font-black tracking-tighter leading-none">A'lo Natijalar</h4>
          <p className="text-lg font-bold text-white/80 max-w-md">Farzandingizning har bir kichik yutug'i — bizning katta umumiy g'alabamiz!</p>
       </div>

       <div className="relative z-10 flex items-center gap-8 bg-white/10 p-10 rounded-[4rem] border border-white/20 backdrop-blur-2xl shadow-2xl">
          <div className="w-24 h-24 rounded-[2rem] bg-white text-amber-500 flex items-center justify-center shadow-xl animate-pulse-slow">
             <Award size={48} />
          </div>
          <div className="text-center lg:text-left">
             <p className="text-[11px] font-black uppercase tracking-[0.3em] text-white/50">Umumiy Reyting</p>
             <p className="text-7xl font-black tracking-tighter mt-1">4.9</p>
             <div className="flex gap-1 mt-2 justify-center lg:justify-start">
                {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="white" className="text-white" />)}
             </div>
          </div>
       </div>
    </div>

    {/* Details Grid */}
    <div className="grid grid-cols-1 gap-10">
       <div className="flex items-center gap-4 px-6">
          <Target size={24} className="text-brand-primary" />
          <h5 className="text-xl font-black text-brand-depth tracking-tight uppercase tracking-[0.1em]">Oylik O'zlashtirish Qaydlari</h5>
       </div>

       {data.progressReports.length === 0 ? (
          <div className="bg-white p-40 rounded-[5rem] border-4 border-dashed border-slate-100 text-center space-y-6">
             <Sparkles size={60} className="mx-auto text-slate-200" />
             <p className="text-brand-muted font-black uppercase text-xs tracking-[0.4em]">Hozircha hisobotlar kiritilmadi</p>
          </div>
       ) : (
         data.progressReports.map((r:any) => (
           <motion.div 
             whileHover={{ y: -10 }}
             key={r.id} 
             className="bg-white p-12 rounded-[4rem] border border-brand-border shadow-2xl shadow-slate-200/30 relative overflow-hidden group"
           >
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
              
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10 mb-12">
                 <div className="flex items-center gap-6">
                    <div className="w-20 h-20 rounded-[2rem] bg-amber-50 text-amber-500 flex items-center justify-center border-2 border-amber-100 shadow-xl group-hover:rotate-6 transition-all">
                       <Zap size={36} fill="currentColor" />
                    </div>
                    <div>
                       <h5 className="text-3xl font-black text-brand-depth tracking-tighter">{r.subject}</h5>
                       <p className="text-[11px] font-black text-brand-muted uppercase tracking-[0.3em] mt-1.5 flex items-center gap-2">
                          <TrendingUp size={14} className="text-brand-primary" /> {r.date} • Rasmiy Baholash
                       </p>
                    </div>
                 </div>
                 <div className="flex flex-col items-center gap-3 p-6 bg-slate-50 rounded-[2.5rem] border border-slate-100 shadow-inner min-w-[200px]">
                    <p className="text-[9px] font-black text-brand-muted uppercase tracking-widest">O'zlashtirish darajasi</p>
                    <div className="flex gap-2 text-amber-400">
                       {[...Array(5)].map((_, i) => (
                         <Star key={i} size={28} fill={i < r.rating ? '#fbbf24' : 'none'} className={i < r.rating ? 'text-amber-400 drop-shadow-md' : 'text-slate-200'} />
                       ))}
                    </div>
                 </div>
              </div>

              <div className="bg-brand-ghost p-10 rounded-[3rem] border-2 border-brand-border relative group-hover:bg-white group-hover:border-brand-primary/30 transition-all">
                 <MessageSquare className="absolute -top-6 -left-6 text-brand-primary opacity-20 w-16 h-16" />
                 <p className="text-lg font-bold text-brand-depth leading-relaxed italic relative z-10 text-center lg:text-left">
                    "{r.comment}"
                 </p>
              </div>

              <div className="mt-10 pt-8 border-t border-slate-50 flex justify-center lg:justify-start items-center gap-3">
                 <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                 <p className="text-[10px] font-black text-brand-muted uppercase tracking-[0.2em]">Tarbiyachi tomonidan tasdiqlangan va muhrlangan</p>
              </div>
           </motion.div>
         ))
       )}
    </div>
  </motion.div>
);
