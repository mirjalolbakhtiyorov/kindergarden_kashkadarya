import React, { useState } from 'react';
import { 
  ShieldCheck, 
  FileText, 
  Plus, 
  Search, 
  Filter, 
  ChevronRight, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle,
  Clock,
  Download,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AuditRecord, InspectionType, ChecklistResult, Severity } from '../../types';
import { MOCK_CHECKLISTS, INITIAL_AUDITS } from '../../constants/mockData';

const InspectorView: React.FC = () => {
  const [audits, setAudits] = useState<AuditRecord[]>(INITIAL_AUDITS);
  const [viewMode, setViewMode] = useState<'LIST' | 'CREATE'>('LIST');
  const [selectedType, setSelectedType] = useState<InspectionType>('KITCHEN');
  const [tempResults, setTempResults] = useState<Record<string, ChecklistResult>>({});

  const handleCreateAudit = () => {
    const newAudit: AuditRecord = {
      inspection_id: `AUD-${Math.floor(Math.random() * 1000)}`,
      inspection_type: selectedType,
      checklist_items: MOCK_CHECKLISTS[selectedType].map((q, i) => ({
        id: `${i}`,
        question: q,
        result: tempResults[i] || 'OK'
      })),
      overall_result: Object.values(tempResults).includes('ISSUE') ? 'WARNING' : 'PASS',
      severity: 'LOW',
      notes: 'Yangi audit o\'tkazildi.',
      attachments: [],
      created_by: 'Inspektor Mirjalol',
      created_at: new Date().toLocaleString(),
      status: 'OPEN'
    };
    setAudits([newAudit, ...audits]);
    setViewMode('LIST');
    setTempResults({});
  };

  const getSeverityColor = (sev: Severity) => {
    switch (sev) {
      case 'LOW': return 'bg-blue-50 text-blue-600';
      case 'MEDIUM': return 'bg-amber-50 text-amber-600';
      case 'HIGH': return 'bg-orange-50 text-orange-600';
      case 'CRITICAL': return 'bg-red-50 text-red-600';
      default: return 'bg-slate-50 text-slate-600';
    }
  };

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-700">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-brand-depth tracking-tight">Audit & Inspeksiya</h2>
          <p className="text-brand-muted text-sm font-medium uppercase tracking-widest mt-1">Sifat nazorati va muvofiqlik monitoringi</p>
        </div>
        <div className="flex gap-4">
           {viewMode === 'LIST' ? (
             <button 
               onClick={() => setViewMode('CREATE')}
               className="bg-brand-primary text-white font-black px-8 py-3 rounded-2xl shadow-xl shadow-brand-primary/20 hover:shadow-2xl hover:-translate-y-0.5 transition-all flex items-center gap-2"
             >
               <Plus size={20} /> YANGI INSPEKSIYA
             </button>
           ) : (
             <button 
               onClick={() => setViewMode('LIST')}
               className="bg-white text-brand-depth border-2 border-slate-100 font-black px-8 py-3 rounded-2xl hover:bg-slate-50 transition-all"
             >
               ORQAGA
             </button>
           )}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {viewMode === 'LIST' ? (
          <motion.div 
            key="list"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
                <p className="text-[10px] font-black text-brand-muted uppercase tracking-widest mb-2">Jami auditlar</p>
                <h3 className="text-3xl font-black text-brand-depth">{audits.length}</h3>
              </div>
              <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
                <p className="text-[10px] font-black text-brand-muted uppercase tracking-widest mb-2">Aniqlangan kamchiliklar</p>
                <h3 className="text-3xl font-black text-amber-500">12</h3>
              </div>
              <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
                <p className="text-[10px] font-black text-brand-muted uppercase tracking-widest mb-2">Yopilgan holatlar</p>
                <h3 className="text-3xl font-black text-emerald-500">85%</h3>
              </div>
              <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
                <p className="text-[10px] font-black text-brand-muted uppercase tracking-widest mb-2">Sifat indeksi</p>
                <h3 className="text-3xl font-black text-brand-primary">4.8/5.0</h3>
              </div>
            </div>

            <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
              <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                <h4 className="font-black text-brand-depth text-lg">Inspeksiya tarixi</h4>
                <div className="flex gap-3">
                   <div className="relative">
                     <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted" size={16} />
                     <input type="text" placeholder="Qidirish..." className="pl-11 pr-4 py-2.5 bg-brand-ghost rounded-xl text-sm font-bold w-64 outline-none focus:ring-2 focus:ring-brand-primary/10 transition-all" />
                   </div>
                   <button className="p-2.5 bg-brand-ghost rounded-xl text-brand-muted hover:text-brand-primary transition-colors"><Filter size={20} /></button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50/50 text-[10px] font-black text-brand-muted uppercase tracking-widest border-b border-slate-100">
                      <th className="px-10 py-5">Identifikator</th>
                      <th className="px-10 py-5">Kategoriya</th>
                      <th className="px-10 py-5">Natija</th>
                      <th className="px-10 py-5">Sana</th>
                      <th className="px-10 py-5">Holat</th>
                      <th className="px-10 py-5 text-right">Amallar</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {audits.map((a) => (
                      <tr key={a.inspection_id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="px-10 py-6">
                           <div className="flex items-center gap-3">
                             <div className="w-10 h-10 bg-brand-ghost rounded-xl flex items-center justify-center text-brand-primary">
                               <ShieldCheck size={20} />
                             </div>
                             <span className="font-black text-brand-depth text-sm">#{a.inspection_id}</span>
                           </div>
                        </td>
                        <td className="px-10 py-6">
                           <span className="px-3 py-1 bg-slate-100 text-[10px] font-black text-slate-600 rounded-full uppercase tracking-widest">{a.inspection_type}</span>
                        </td>
                        <td className="px-10 py-6">
                           <div className="flex items-center gap-2">
                             {a.overall_result === 'PASS' && <CheckCircle2 size={16} className="text-emerald-500" />}
                             {a.overall_result === 'FAIL' && <XCircle size={16} className="text-red-500" />}
                             {a.overall_result === 'WARNING' && <AlertTriangle size={16} className="text-amber-500" />}
                             <span className={`text-[11px] font-black uppercase ${a.overall_result === 'PASS' ? 'text-emerald-600' : a.overall_result === 'FAIL' ? 'text-red-600' : 'text-amber-600'}`}>
                                {a.overall_result === 'PASS' ? 'Muammosiz' : a.overall_result === 'FAIL' ? 'Kritik xato' : 'Ogohlantirish'}
                             </span>
                           </div>
                        </td>
                        <td className="px-10 py-6 text-sm font-bold text-brand-muted">{a.created_at}</td>
                        <td className="px-10 py-6">
                           <div className="flex items-center gap-2">
                             <div className={`w-2 h-2 rounded-full ${a.status === 'OPEN' ? 'bg-amber-500 animate-pulse' : 'bg-slate-300'}`}></div>
                             <span className="text-[10px] font-black text-brand-muted uppercase">{a.status === 'OPEN' ? 'Ochiq' : 'Yopilgan'}</span>
                           </div>
                        </td>
                        <td className="px-10 py-6 text-right">
                           <button className="p-2 text-brand-muted hover:text-brand-primary hover:bg-brand-primary/5 rounded-lg transition-all"><ChevronRight size={20} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="create"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-10"
          >
            <div className="col-span-1 lg:col-span-4 space-y-6">
               <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm space-y-8">
                  <div>
                    <h4 className="text-xl font-black text-brand-depth">Inpeksiya turi</h4>
                    <p className="text-brand-muted text-[10px] font-bold uppercase tracking-widest mt-1">Audit obyektini tanlang</p>
                  </div>
                  <div className="space-y-3">
                    {(['KITCHEN', 'WAREHOUSE', 'HYGIENE', 'SAMPLE'] as InspectionType[]).map(type => (
                      <button 
                        key={type}
                        onClick={() => setSelectedType(type)}
                        className={`w-full p-4 rounded-2xl flex items-center justify-between border-2 transition-all group ${
                          selectedType === type ? 'border-brand-primary bg-brand-primary/5' : 'border-transparent bg-brand-ghost hover:border-slate-200'
                        }`}
                      >
                         <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                              selectedType === type ? 'bg-brand-primary text-white' : 'bg-white text-brand-muted group-hover:text-brand-primary shadow-sm'
                            }`}>
                               {type === 'KITCHEN' && <ShieldCheck size={20} />}
                               {type === 'WAREHOUSE' && <FileText size={20} />}
                               {type === 'HYGIENE' && <ShieldCheck size={20} />}
                               {type === 'SAMPLE' && <FileText size={20} />}
                            </div>
                            <span className={`font-black text-sm uppercase tracking-wider ${
                              selectedType === type ? 'text-brand-primary' : 'text-brand-muted'
                            }`}>{type}</span>
                         </div>
                         {selectedType === type && <CheckCircle2 size={18} className="text-brand-primary" />}
                      </button>
                    ))}
                  </div>
               </div>

               <div className="bg-brand-depth p-8 rounded-[40px] text-white shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/20 rounded-full blur-3xl -mr-16 -mt-16"></div>
                  <h4 className="text-lg font-black relative z-10 flex items-center gap-2 uppercase tracking-wide">
                    <Info size={20} className="text-brand-primary" />
                    Yo'riqnoma
                  </h4>
                  <p className="text-white/60 text-xs font-medium mt-4 leading-relaxed relative z-10 italic">
                    Har bir bandni diqqat bilan tekshiring. Kamchilik aniqlansa "MUAMMO" tugmasini bosing va qisqacha izoh qoldiring.
                  </p>
               </div>
            </div>

            <div className="col-span-1 lg:col-span-8 bg-white rounded-[48px] border border-slate-100 shadow-sm p-10 flex flex-col">
               <div className="flex items-center justify-between mb-10">
                  <h4 className="text-2xl font-black text-brand-depth tracking-tight">Tekshiruv varaqa</h4>
                  <div className="px-4 py-1.5 bg-brand-primary/10 text-brand-primary text-[10px] font-black rounded-full uppercase tracking-widest border border-brand-primary/10">
                    {selectedType} Inspeksiya
                  </div>
               </div>

               <div className="flex-1 space-y-4">
                  {MOCK_CHECKLISTS[selectedType].map((q, i) => (
                    <div key={i} className="p-6 bg-brand-ghost rounded-3xl border border-transparent hover:border-slate-200 transition-all group">
                       <div className="flex items-start justify-between gap-6">
                          <p className="font-bold text-brand-depth leading-relaxed flex-1">{i + 1}. {q}</p>
                          <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-slate-100">
                             <button 
                               onClick={() => setTempResults({...tempResults, [i]: 'OK'})}
                               className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                 (tempResults[i] || 'OK') === 'OK' ? 'bg-emerald-500 text-white shadow-lg' : 'text-emerald-500 hover:bg-emerald-50'
                               }`}
                             >
                               OK
                             </button>
                             <button 
                               onClick={() => setTempResults({...tempResults, [i]: 'ISSUE'})}
                               className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                 tempResults[i] === 'ISSUE' ? 'bg-red-500 text-white shadow-lg' : 'text-red-500 hover:bg-red-50'
                               }`}
                             >
                               MUAMMO
                             </button>
                          </div>
                       </div>
                    </div>
                  ))}
               </div>

               <div className="mt-10 pt-10 border-t border-slate-100 flex items-center justify-between">
                  <p className="text-brand-muted text-[10px] font-black uppercase tracking-widest italic">Oxirgi qadam: Natijalarni tasdiqlash</p>
                  <button 
                    onClick={handleCreateAudit}
                    className="flex items-center gap-3 px-10 py-4 bg-brand-primary text-white font-black rounded-2xl shadow-xl shadow-brand-primary/20 hover:shadow-2xl hover:-translate-y-1 active:translate-y-0 transition-all"
                  >
                    HISOBOTNI TASDIQLASH <CheckCircle2 size={20} />
                  </button>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default InspectorView;
