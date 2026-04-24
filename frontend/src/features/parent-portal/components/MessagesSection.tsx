import React from 'react';
import { MessageSquare, Target, Send, ChevronRight, Zap, Clock, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';

export const MessagesSection = () => (
  <motion.div initial={{ opacity: 0, scale: 1.02 }} animate={{ opacity: 1, scale: 1 }} className="h-full flex flex-col space-y-12">
    <div className="bg-white border-4 border-brand-border rounded-[4.5rem] p-16 shadow-[0_60px_120px_rgba(0,0,0,0.06)] h-[700px] flex flex-col relative overflow-hidden group">
       <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.02] pointer-events-none"></div>
       <div className="absolute top-0 right-0 w-80 h-80 bg-brand-primary/5 rounded-full blur-[100px] -mr-40 -mt-40 transition-all duration-1000 group-hover:bg-brand-primary/10"></div>
       
       <div className="flex-1 flex flex-col items-center justify-center text-center space-y-10 relative z-10">
          <div className="relative">
             <div className="w-32 h-32 bg-brand-primary/10 rounded-[3rem] flex items-center justify-center border-2 border-brand-primary/20 animate-bounce-slow">
                <MessageSquare size={64} className="text-brand-primary opacity-60" />
             </div>
             <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-emerald-500 rounded-2xl flex items-center justify-center border-4 border-white shadow-xl">
                <ShieldCheck size={20} className="text-white" />
             </div>
          </div>
          
          <div className="space-y-4">
             <h4 className="text-4xl font-black text-brand-depth uppercase tracking-[0.1em]">Sifatli Muloqot Markazi</h4>
             <p className="text-base font-bold leading-relaxed max-w-lg text-brand-slate mx-auto">
                Guruh rahbari (tarbiyachi) yoki bog'cha ma'muriyati bilan bevosita va xavfsiz bog'laning. Bizning mutaxassislar har qanday savolingizga tezkor javob berishadi.
             </p>
          </div>

          <div className="flex flex-wrap justify-center gap-6">
             <div className="flex items-center gap-3 bg-slate-50 px-6 py-3 rounded-2xl border border-slate-100 shadow-inner">
                <Clock size={16} className="text-brand-primary" />
                <span className="text-[10px] font-black text-brand-muted uppercase tracking-widest">O'rtacha javob vaqti: 15 daqiqa</span>
             </div>
             <div className="flex items-center gap-3 bg-slate-50 px-6 py-3 rounded-2xl border border-slate-100 shadow-inner">
                <Zap size={16} className="text-amber-500" />
                <span className="text-[10px] font-black text-brand-muted uppercase tracking-widest">Tezkor Muloqot Faol</span>
             </div>
          </div>
       </div>

       <div className="flex flex-col sm:flex-row gap-6 border-t-2 border-slate-50 pt-16 relative z-10">
          <div className="relative flex-1">
             <input 
               className="w-full bg-slate-50 border-4 border-transparent focus:border-brand-primary focus:bg-white rounded-[2.5rem] px-12 py-7 outline-none font-black text-lg text-brand-depth placeholder:text-brand-muted shadow-2xl transition-all shadow-inner" 
               placeholder="Savolingiz yoki taklifingizni yozing..." 
             />
             <div className="absolute left-6 top-1/2 -translate-y-1/2 opacity-20"><Send size={24} /></div>
          </div>
          <button className="bg-brand-depth text-white px-16 py-7 rounded-[2.5rem] font-black text-xs uppercase tracking-[0.4em] shadow-2xl hover:bg-brand-primary transition-all active:scale-95 flex items-center justify-center gap-4 group/btn">
             YUBORISH <ChevronRight size={20} className="group-hover/btn:translate-x-2 transition-transform" />
          </button>
       </div>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
       <div className="bg-white p-10 rounded-[3.5rem] border border-brand-border shadow-sm flex items-center gap-8 group hover:shadow-xl transition-all">
          <div className="w-16 h-16 rounded-2xl bg-brand-primary/5 flex items-center justify-center text-brand-primary group-hover:scale-110 transition-transform"><Target size={32} /></div>
          <div>
             <h6 className="font-black text-brand-depth uppercase text-xs tracking-widest">Ma'muriyat bilan bog'lanish</h6>
             <p className="text-[10px] font-bold text-brand-slate mt-1 italic">+998 71 200 00 00</p>
          </div>
       </div>
       <div className="bg-white p-10 rounded-[3.5rem] border border-brand-border shadow-sm flex items-center gap-8 group hover:shadow-xl transition-all">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform"><Zap size={32} /></div>
          <div>
             <h6 className="font-black text-brand-depth uppercase text-xs tracking-widest">Tizim bo'yicha yordam</h6>
             <p className="text-[10px] font-bold text-brand-slate mt-1 italic">support@kinderflow.uz</p>
          </div>
       </div>
    </div>
  </motion.div>
);
