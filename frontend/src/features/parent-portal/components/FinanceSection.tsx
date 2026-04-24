import React from 'react';
import { Wallet, CreditCard, ClipboardList, Download, CheckCircle2, TrendingUp, ArrowUpRight } from 'lucide-react';
import { motion } from 'motion/react';

export const FinanceSection = ({ data }: any) => (
  <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-10">
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Wallet Card */}
      <div className="lg:col-span-2 bg-brand-depth p-12 rounded-[4rem] text-white shadow-2xl relative overflow-hidden group">
         <div className="absolute top-0 right-0 w-80 h-80 bg-brand-primary/20 rounded-full blur-[100px] -mr-32 -mt-32"></div>
         <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px] -ml-32 -mb-32"></div>
         
         <div className="relative z-10 space-y-10">
            <div className="flex justify-between items-start">
               <div className="space-y-1">
                  <p className="text-[11px] font-black text-white/40 uppercase tracking-[0.4em]">Joriy Balans</p>
                  <h4 className="text-6xl font-black tracking-tighter">0.00 <span className="text-xl opacity-40 uppercase ml-2">UZS</span></h4>
               </div>
               <div className="w-16 h-16 rounded-[2rem] bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-md shadow-2xl">
                  <Wallet size={32} className="text-brand-primary" />
               </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-10">
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 border border-emerald-500/30">
                     <CheckCircle2 size={18} />
                  </div>
                  <p className="text-xs font-black uppercase tracking-widest text-emerald-400">Hisob to'liq yopilgan</p>
               </div>
               <div className="h-10 w-px bg-white/10 hidden md:block"></div>
               <div className="flex items-center gap-3 group/stat cursor-help">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/60 border border-white/10 group-hover/stat:border-brand-primary transition-all">
                     <TrendingUp size={18} className="group-hover/stat:text-brand-primary" />
                  </div>
                  <p className="text-xs font-black uppercase tracking-widest text-white/60">Keyingi to'lov: 1-may</p>
               </div>
            </div>
         </div>
      </div>

      {/* Quick Pay */}
      <div className="bg-brand-primary p-12 rounded-[4rem] text-white shadow-2xl flex flex-col justify-between items-center text-center group cursor-pointer hover:bg-brand-primary-dark transition-all active:scale-95 border-b-[8px] border-black/10">
         <div className="w-24 h-24 rounded-[3rem] bg-white/10 flex items-center justify-center border-4 border-white/5 shadow-2xl group-hover:rotate-12 transition-transform duration-500">
            <CreditCard size={48} />
         </div>
         <div className="space-y-2">
            <h5 className="text-2xl font-black uppercase tracking-tight">Onlayn To'lov</h5>
            <p className="text-xs font-bold opacity-60 uppercase tracking-widest">Istagan turdagi karta orqali</p>
         </div>
         <div className="w-full py-4 bg-black/10 rounded-2xl flex items-center justify-center gap-2 group-hover:bg-black/20 transition-all font-black text-[10px] uppercase tracking-[0.2em]">
            To'lovga o'tish <ArrowUpRight size={14} />
         </div>
      </div>
    </div>

    {/* Transaction History */}
    <div className="bg-white rounded-[4rem] border border-brand-border overflow-hidden shadow-2xl shadow-slate-200/50">
       <div className="p-10 border-b border-slate-50 flex items-center justify-between bg-slate-50/20">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 text-brand-primary flex items-center justify-center shadow-inner"><ClipboardList size={22} /></div>
             <h5 className="text-xl font-black text-brand-depth tracking-tight uppercase tracking-[0.1em]">To'lovlar Tarixi</h5>
          </div>
       </div>
       <div className="overflow-x-auto">
          <table className="w-full text-left">
             <thead>
                <tr className="bg-slate-50/50 text-[10px] font-black text-brand-muted uppercase tracking-[0.3em] border-b border-brand-border">
                   <th className="px-10 py-6">Operatsiya ID</th>
                   <th className="px-10 py-6">To'lov sanasi</th>
                   <th className="px-10 py-6">Kiritilgan summa</th>
                   <th className="px-10 py-6">Muvaffaqiyat</th>
                   <th className="px-10 py-6 text-right">Kvitansiya</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-slate-50">
                {data.payments.length === 0 ? (
                   <tr><td colSpan={5} className="p-32 text-center text-brand-muted font-bold italic text-xs uppercase tracking-widest opacity-40">Hozircha tranzaksiyalar qayd etilmagan</td></tr>
                ) : (
                   data.payments.map((p: any) => (
                     <tr key={p.id} className="hover:bg-slate-50/50 transition-all group/row">
                        <td className="px-10 py-8 font-mono text-xs font-black text-brand-primary bg-brand-primary/5 border-l-4 border-brand-primary">#{p.id.slice(0, 12).toUpperCase()}</td>
                        <td className="px-10 py-8 text-sm font-black text-brand-depth">{p.date}</td>
                        <td className="px-10 py-8 text-lg font-black text-brand-depth tracking-tight">{p.amount.toLocaleString()} <span className="text-[10px] opacity-40">UZS</span></td>
                        <td className="px-10 py-8">
                           <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100 w-fit">
                              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                              <span className="text-[10px] font-black uppercase tracking-widest">Tasdiqlandi</span>
                           </div>
                        </td>
                        <td className="px-10 py-8 text-right">
                           <button className="p-4 bg-white text-brand-depth hover:bg-brand-depth hover:text-white rounded-2xl transition-all shadow-xl border border-brand-border active:scale-90"><Download size={20} /></button>
                        </td>
                     </tr>
                   ))
                )}
             </tbody>
          </table>
       </div>
    </div>
  </motion.div>
);
