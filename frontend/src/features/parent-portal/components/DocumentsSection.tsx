import React from 'react';
import { FileText, ShieldCheck, Download, Clock } from 'lucide-react';
import { motion } from 'motion/react';

export const DocumentsSection = ({ data }: any) => (
  <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6 md:space-y-12">
     <div className="bg-white rounded-[2rem] md:rounded-[4rem] border-2 border-slate-50 shadow-sm overflow-hidden">
        <div className="p-8 md:p-12 border-b border-slate-50 flex flex-col md:flex-row items-center justify-between bg-slate-50/20 gap-6">
           <div className="flex items-center gap-4 text-center md:text-left">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl md:rounded-[2.5rem] bg-brand-primary text-white flex items-center justify-center shadow-lg border-4 border-white/20 shrink-0">
                 <FileText size={32} md:size={40} />
              </div>
              <div>
                 <h5 className="text-xl md:text-3xl font-black text-brand-depth tracking-tighter uppercase leading-none">Hujjatlar</h5>
                 <p className="text-[9px] md:text-[11px] font-black text-brand-muted uppercase tracking-widest mt-1 flex items-center justify-center md:justify-start gap-2">
                    <ShieldCheck size={14} className="text-emerald-500" /> Maxfiy Arxiv
                 </p>
              </div>
           </div>
        </div>
        <div className="divide-y divide-slate-100">
           {data?.documents?.length > 0 ? data.documents.map((doc:any) => (
              <div key={doc.id} className="p-6 md:p-10 flex flex-col md:flex-row items-center justify-between group hover:bg-slate-50/80 transition-all gap-6">
                 <div className="flex items-center gap-4 text-center md:text-left">
                    <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-white flex items-center justify-center text-brand-primary border-2 border-slate-100 shadow-md shrink-0">
                       <FileText size={24} md:size={32} />
                    </div>
                    <div>
                       <p className="font-bold md:font-black text-sm md:text-xl text-brand-depth tracking-tight group-hover:text-brand-primary transition-colors leading-none">{doc.title}</p>
                       <div className="flex items-center justify-center md:justify-start gap-2 mt-2">
                          <div className="flex items-center gap-1.5 text-[8px] md:text-[10px] font-black text-brand-slate uppercase tracking-widest">
                             <Clock size={12} className="text-brand-primary" /> {doc.created_at}
                          </div>
                       </div>
                    </div>
                 </div>
                 <button className="w-full md:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-brand-depth text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg hover:bg-brand-primary transition-all active:scale-95 shrink-0">
                    <Download size={16} /> 
                    <span className="hidden sm:inline">Yuklab olish</span>
                 </button>
              </div>
           )) : (
             <div className="p-12 md:p-20 text-center text-brand-muted font-black uppercase tracking-widest text-[10px]">Hujjatlar mavjud emas</div>
           )}
        </div>
     </div>
  </motion.div>
);
