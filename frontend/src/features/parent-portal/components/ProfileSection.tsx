import React from 'react';
import { User, MapPin, Users, Smartphone, Briefcase, Fingerprint, Baby, Target, Heart } from 'lucide-react';
import { motion } from 'motion/react';

export const ProfileSection = ({ parentData }: any) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
      {/* Child Details */}
      <div className="space-y-8">
        <h4 className="flex items-center gap-3 text-sm font-black text-brand-depth uppercase tracking-[0.3em] px-2">
          <div className="w-2 h-2 bg-brand-primary rounded-full animate-pulse"></div>
          Bolaning Shaxsiy Ma'lumotlari
        </h4>
        <div className="space-y-5">
           {[
             { label: 'To\'liq ism-familiyasi', val: parentData.childName, icon: User },
             { label: 'Tug\'ilganlik guvohnomasi', val: parentData.childBirthCertificate, icon: Target },
             { label: 'Doimiy yashash manzili', val: parentData.address, icon: MapPin },
           ].map((item, i) => (
             <div key={i} className="bg-white p-7 rounded-[2.5rem] border border-brand-border shadow-sm hover:shadow-xl transition-all group overflow-hidden relative">
                <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                   <item.icon size={60} />
                </div>
                <p className="text-[10px] font-black text-brand-muted uppercase tracking-widest mb-1">{item.label}</p>
                <p className="text-base font-black text-brand-depth relative z-10">{item.val || '--'}</p>
             </div>
           ))}
           <div className="bg-gradient-to-br from-brand-primary to-brand-primary-dark p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group">
              <div className="absolute -right-4 -bottom-4 opacity-20 group-hover:scale-110 transition-transform duration-700">
                 <Target size={100} />
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60 mb-2">Hozirgi Guruhi</p>
              <p className="text-3xl font-black tracking-tight">{parentData.childGroup || '3-guruh (Shaffoflar)'}</p>
           </div>
        </div>
      </div>

      {/* Parent Details */}
      <div className="space-y-8">
        <h4 className="flex items-center gap-3 text-sm font-black text-brand-depth uppercase tracking-[0.3em] px-2">
          <div className="w-2 h-2 bg-rose-500 rounded-full"></div>
          Ota-ona Ma'lumotlari
        </h4>
        <div className="space-y-6">
           {[
             { role: 'Otasi', name: parentData.fatherName, work: parentData.fatherWorkplace, phone: parentData.fatherPhone, pass: parentData.fatherPassport, color: 'brand-primary' },
             { role: 'Onasi', name: parentData.motherName, work: parentData.motherWorkplace, phone: parentData.motherPhone, pass: parentData.motherPassport, color: 'rose-500' },
           ].map((p, i) => (
             <div key={i} className="bg-white p-8 rounded-[3rem] border border-brand-border shadow-sm space-y-6 relative overflow-hidden group hover:shadow-2xl transition-all">
                <div className={`absolute top-0 left-0 w-2 h-full bg-${p.color === 'brand-primary' ? 'brand-primary' : 'rose-500'}`}></div>
                <div className="flex justify-between items-start">
                   <div>
                      <p className={`text-[10px] font-black text-${p.color === 'brand-primary' ? 'brand-primary' : 'rose-500'} uppercase tracking-[0.2em]`}>{p.role}ning ma'lumotlari</p>
                      <h5 className="text-2xl font-black text-brand-depth mt-1 tracking-tight">{p.name}</h5>
                   </div>
                   <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-brand-muted"><User size={24} /></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100 flex items-center gap-3">
                      <Briefcase size={16} className="text-brand-muted" />
                      <div>
                         <p className="text-[8px] font-black text-brand-muted uppercase">Ishlash joyi</p>
                         <p className="text-xs font-bold text-brand-depth">{p.work || 'Kiritilmagan'}</p>
                      </div>
                   </div>
                   <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100 flex items-center gap-3">
                      <Smartphone size={16} className="text-brand-muted" />
                      <div>
                         <p className="text-[8px] font-black text-brand-muted uppercase">Telefon</p>
                         <p className="text-xs font-bold text-brand-depth">{p.phone}</p>
                      </div>
                   </div>
                   <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100 flex items-center gap-3 col-span-2">
                      <Fingerprint size={16} className="text-brand-muted" />
                      <div>
                         <p className="text-[8px] font-black text-brand-muted uppercase">Passport ma'lumotlari</p>
                         <p className="text-xs font-bold text-brand-depth uppercase tracking-widest">{p.pass || '--'}</p>
                      </div>
                   </div>
                </div>
             </div>
           ))}
        </div>
      </div>
    </div>
  </motion.div>
);
