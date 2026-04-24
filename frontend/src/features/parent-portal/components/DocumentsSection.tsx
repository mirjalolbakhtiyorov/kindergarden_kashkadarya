import React from 'react';
import { FileText, Download, ShieldCheck, Clock, FileSearch, Trash2, Eye } from 'lucide-react';
import { motion } from 'motion/react';

export const DocumentsSection = ({ data }: any) => (
  <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-12">
    <div className="bg-white rounded-[4rem] border-2 border-slate-50 shadow-[0_50px_100px_rgba(0,0,0,0.06)] overflow-hidden">
       <div className="p-16 border-b border-slate-50 flex flex-col md:flex-row items-center justify-between bg-slate-50/20 gap-10">
          <div className="flex items-center gap-8 text-center md:text-left">
             <div className="w-24 h-24 rounded-[2.5rem] bg-brand-primary text-white flex items-center justify-center shadow-[0_20px_40px_rgba(79,70,229,0.3)] border-4 border-white/20"><FileText size={48} /></div>
             <div>
                <h5 className="text-4xl font-black text-brand-depth tracking-tighter uppercase leading-none">Hujjatlar Arxivi</h5>
                <p className="text-[11px] font-black text-brand-muted uppercase tracking-[0.4em] mt-3 flex items-center justify-center md:justify-start gap-2">
                   <ShieldCheck size={14} className="text-emerald-500" /> Maxfiy va Xavfsiz Saqlash
                </p>
             </div>
          </div>
       </div>

       <div className="grid grid-cols-1 divide-y divide-slate-100">
          {data.documents.length === 0 ? (
             <div className="p-48 text-center space-y-8 group">
                <div className="w-32 h-32 bg-slate-50 rounded-full flex items-center justify-center mx-auto border-2 border-dashed border-slate-200 group-hover:scale-110 transition-transform">
                   <FileSearch size={56} className="text-slate-200" />
                </div>
                <p className="text-brand-muted font-black uppercase text-[12px] tracking-[0.5em] italic">Hozircha arxivda hujjatlar yo'q</p>
             </div>
          ) : (
             data.documents.map((doc:any) => (
               <div key={doc.id} className="p-12 flex flex-col md:flex-row items-center justify-between group hover:bg-slate-50/80 transition-all gap-10">
                  <div className="flex items-center gap-10 text-center md:text-left">
                     <div className="w-20 h-20 rounded-[2rem] bg-white flex items-center justify-center text-brand-primary border-2 border-slate-100 shadow-xl group-hover:scale-110 transition-all relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-brand-primary"></div>
                        <FileText size={32} />
                     </div>
                     <div>
                        <p className="font-black text-2xl text-brand-depth tracking-tight group-hover:text-brand-primary transition-colors leading-none">{doc.title}</p>
                        <div className="flex flex-wrap justify-center md:justify-start items-center gap-4 mt-4">
                           <span className="text-[10px] font-black text-brand-muted uppercase tracking-widest bg-slate-100 border border-slate-200 px-4 py-1.5 rounded-xl shadow-inner">PDF FORMAT</span>
                           <div className="flex items-center gap-1.5 text-[10px] font-black text-brand-slate uppercase tracking-widest">
                              <Clock size={14} className="text-brand-primary" /> Yuklangan: {doc.created_at.split(' ')[0]}
                           </div>
                        </div>
                     </div>
                  </div>
                  <div className="flex items-center gap-4">
                     <button className="p-5 bg-white text-brand-depth hover:bg-brand-primary hover:text-white rounded-[1.5rem] transition-all shadow-xl border border-slate-100 active:scale-95 group/view">
                        <Eye size={24} />
                     </button>
                     <button className="flex items-center gap-4 px-12 py-5 bg-brand-depth text-white rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:bg-brand-primary transition-all active:scale-95 group/dl">
                        <Download size={20} className="group-hover/dl:translate-y-0.5 transition-transform" /> Yuklab olish
                     </button>
                  </div>
               </div>
             ))
          )}
       </div>
    </div>
  </motion.div>
);
