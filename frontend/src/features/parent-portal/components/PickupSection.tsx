import React from 'react';
import { UserCheck, Smartphone, Trash2, ShieldCheck, Heart, MapPin, Contact } from 'lucide-react';
import { motion } from 'motion/react';

export const PickupSection = ({ data }: any) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-12">
    <div className="flex flex-col md:flex-row justify-between items-center bg-white p-12 rounded-[4rem] border-2 border-slate-50 shadow-xl gap-10">
       <div className="space-y-2 text-center md:text-left">
          <h4 className="text-4xl font-black text-brand-depth tracking-tighter leading-none">Ishonchli Vakillar</h4>
          <p className="text-brand-muted text-xs font-bold uppercase tracking-[0.3em] mt-3 flex items-center justify-center md:justify-start gap-2">
             <ShieldCheck size={16} className="text-emerald-500" /> Faqat ruxsat etilgan shaxslar
          </p>
       </div>
       <button className="px-12 py-6 bg-brand-primary text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] shadow-[0_20px_40px_rgba(79,70,229,0.3)] hover:scale-105 active:scale-95 transition-all flex items-center gap-4">
          <UserCheck size={24} /> Yangi vakil qo'shish
       </button>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
       {data.authorizedPickups.length === 0 ? (
          <div className="col-span-2 bg-white p-40 rounded-[5rem] border-4 border-brand-border border-dashed text-center space-y-6">
             <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto"><UserCheck size={48} className="text-slate-200" /></div>
             <p className="text-brand-muted font-black uppercase text-[12px] tracking-[0.5em] italic">Hozircha ishonchli vakillar belgilanmagan</p>
          </div>
       ) : (
          data.authorizedPickups.map((v:any) => (
             <motion.div 
               whileHover={{ y: -10 }}
               key={v.id} 
               className="bg-white p-12 rounded-[4rem] border border-brand-border shadow-[0_40px_100px_rgba(0,0,0,0.05)] flex flex-col sm:flex-row items-center gap-10 hover:shadow-2xl transition-all relative overflow-hidden group"
             >
                <div className="absolute top-0 right-0 w-40 h-40 bg-brand-primary/5 rounded-full -mr-20 -mt-20 group-hover:scale-125 transition-transform duration-1000"></div>
                
                <div className="w-36 h-36 rounded-[2.5rem] bg-slate-50 border-8 border-white shadow-2xl flex items-center justify-center overflow-hidden shrink-0 relative">
                   {v.photo_url ? (
                      <img src={v.photo_url} alt="" className="w-full h-full object-cover" />
                   ) : (
                      <div className="text-brand-muted flex flex-col items-center">
                         <Contact size={48} className="opacity-20" />
                         <p className="text-[8px] font-black mt-2">PHOTO ID</p>
                      </div>
                   )}
                   <div className="absolute top-2 right-2 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white shadow-lg"></div>
                </div>

                <div className="flex-1 space-y-6 text-center sm:text-left">
                   <div>
                      <p className="text-[11px] font-black text-brand-primary uppercase tracking-[0.4em] mb-2">{v.relation}</p>
                      <p className="text-3xl font-black text-brand-depth tracking-tighter leading-none">{v.full_name}</p>
                   </div>
                   <div className="space-y-3 pt-2">
                      <div className="flex items-center justify-center sm:justify-start gap-3 text-sm font-black text-brand-depth">
                         <Smartphone size={18} className="text-brand-primary" /> {v.phone}
                      </div>
                      <div className="flex items-center justify-center sm:justify-start gap-3 text-[10px] font-black text-brand-muted uppercase tracking-widest">
                         <MapPin size={14} className="text-slate-300" /> Shaxsni tasdiqlovchi ma'lumotlar
                      </div>
                   </div>
                   <div className="pt-4 flex justify-center sm:justify-start">
                      <button className="px-6 py-3 bg-rose-50 text-rose-500 rounded-xl font-black text-[9px] uppercase tracking-[0.2em] border border-rose-100 hover:bg-rose-500 hover:text-white transition-all shadow-sm">
                         <Trash2 size={12} className="inline mr-2"/> Vakolatni bekor qilish
                      </button>
                   </div>
                </div>
             </motion.div>
          ))
       )}
    </div>

    <div className="bg-brand-depth p-12 rounded-[4rem] text-white/80 shadow-2xl relative overflow-hidden">
       <div className="absolute top-0 right-0 p-12 opacity-5"><Heart size={150} /></div>
       <div className="relative z-10 flex flex-col lg:flex-row items-center gap-10">
          <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center border border-white/10 shrink-0"><ShieldCheck size={32} className="text-brand-primary" /></div>
          <div>
             <h5 className="text-xl font-black text-white tracking-tight mb-2">Xavfsizlik yo'riqnomasi</h5>
             <p className="text-sm font-bold leading-relaxed max-w-3xl">
                Bolani olib ketishga ruxsat etilgan yangi shaxslarni qo'shishdan avval ularning passport ma'lumotlarini taqdim etishingizni so'raymiz. Har bir shaxs bog'cha kirish qismida yuzidan identifikatsiya qilinadi.
             </p>
          </div>
       </div>
    </div>
  </motion.div>
);
