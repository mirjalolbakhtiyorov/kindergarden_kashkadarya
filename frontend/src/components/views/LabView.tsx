import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Database, 
  Archive, 
  FlaskConical, 
  AlertOctagon, 
  AlertTriangle, 
  Clock, 
  Beaker, 
  Utensils, 
  ShieldCheck, 
  Info, 
  ChevronRight, 
  Download, 
  FileText,
  CheckCircle2
} from 'lucide-react';
import { motion } from 'motion/react';
import { LabSample, KitchenTask, LabRiskLevel, LabSampleStatus } from '../../types';

interface LabViewProps {
  samples: LabSample[];
  setSamples: React.Dispatch<React.SetStateAction<LabSample[]>>;
  kitchenTasks: KitchenTask[];
}

const LabView: React.FC<LabViewProps> = ({ samples, setSamples, kitchenTasks }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSample, setNewSample] = useState<Partial<LabSample>>({
    storage_duration: 72,
    risk_level: 'NORMAL',
    status: 'COLLECTED'
  });
  const [labChecklist, setLabChecklist] = useState<Record<number, boolean>>({});
  const [newSampleNutrition, setNewSampleNutrition] = useState<LabSample['nutrition']>({
    vitamins: '', starch: '', carbs: '', proteins: '', fats: '', calories: '', weight: ''
  });
  const [selectedSample, setSelectedSample] = useState<LabSample | null>(null);
  const [isEditingNutrition, setIsEditingNutrition] = useState(false);
  const [tempNutrition, setTempNutrition] = useState<LabSample['nutrition']>({
    vitamins: '', starch: '', carbs: '', proteins: '', fats: '', calories: '', weight: ''
  });

  const updateNutrition = () => {
    if (!selectedSample) return;
    setSamples(prev => prev.map(s => 
      s.sample_id === selectedSample.sample_id 
        ? { ...s, nutrition: tempNutrition } 
        : s
    ));
    setSelectedSample({ ...selectedSample, nutrition: tempNutrition });
    setIsEditingNutrition(false);
  };

  const LAB_CHECKLIST_ITEMS = [
    'Namuna 72 soatlik steril idishga olindi',
    'Harorat +4°C darajadan o‘tmadi',
    'Laboratoriya jurnali to‘ldirildi',
    'Oshpaz va laboratoriya imzosi qayd etildi'
  ];

  const allLabChecksDone = LAB_CHECKLIST_ITEMS.every((_, i) => labChecklist[i]);

  const stats = useMemo(() => {
    const pendingSampling = kitchenTasks.filter(t => (t.status === 'TAYYOR' || t.status === 'SUZISHGA_TAYYOR') && !samples.find(s => s.dish_id === t.id));
    return {
      total: samples.length,
      pending: samples.filter(s => s.status === 'COLLECTED' || s.status === 'STORED').length,
      critical: samples.filter(s => s.risk_level === 'CRITICAL').length,
      samplingNeeded: pendingSampling.length
    };
  }, [samples, kitchenTasks]);

  const getRiskBadge = (risk: LabRiskLevel) => {
    switch (risk) {
      case 'NORMAL': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'WARNING': return 'bg-amber-50 text-brand-amber border-amber-100';
      case 'CRITICAL': return 'bg-rose-50 text-rose-600 border-rose-100 animate-pulse';
    }
  };

  const getStatusIcon = (status: LabSampleStatus) => {
    switch (status) {
      case 'COLLECTED': return <Database size={16} />;
      case 'STORED': return <Archive size={16} />;
      case 'TESTED': return <FlaskConical size={16} />;
      case 'CRITICAL': return <AlertOctagon size={16} />;
    }
  };

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-brand-depth tracking-tight">Laboratoriya Nazorati</h2>
          <p className="text-brand-muted text-xs font-bold uppercase tracking-widest mt-1">Sinamalar xavfsizligi va laborator tahlillar monitoringi</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-brand-depth text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 shadow-xl hover:scale-105 transition-all w-full md:w-auto justify-center"
        >
          <Plus size={18} /> Yangi Sinama
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-brand-border shadow-sm">
          <p className="text-brand-muted text-[10px] font-bold uppercase tracking-widest mb-1">Jami sinamalar</p>
          <div className="flex items-end gap-2">
            <h3 className="text-3xl font-black text-brand-depth">{stats.total}</h3>
            <span className="text-[10px] font-bold text-brand-muted mb-1">donada</span>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-brand-border shadow-sm border-l-4 border-l-amber-500">
          <p className="text-brand-muted text-[10px] font-bold uppercase tracking-widest mb-1">Kutilmoqda (Pending)</p>
          <h3 className="text-3xl font-black text-brand-amber">{stats.pending}</h3>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-brand-border shadow-sm border-l-4 border-l-rose-500">
          <p className="text-brand-muted text-[10px] font-bold uppercase tracking-widest mb-1">Kritik natijalar</p>
          <h3 className="text-3xl font-black text-rose-500">{stats.critical}</h3>
        </div>
        <div className={`p-6 rounded-3xl shadow-lg transition-all ${stats.samplingNeeded > 0 ? 'bg-amber-600 text-white animate-pulse' : 'bg-brand-depth text-white'}`}>
          <p className={`${stats.samplingNeeded > 0 ? 'text-white/80' : 'text-white/60'} text-[10px] font-bold uppercase tracking-widest mb-1`}>
            {stats.samplingNeeded > 0 ? 'NAMUNA OLINISHI KERAK' : 'Saqlash standarti'}
          </p>
          <div className="flex items-center gap-2">
            {stats.samplingNeeded > 0 ? <AlertTriangle size={20} /> : <Clock size={20} className="text-brand-primary" />}
            <h3 className="text-2xl font-black">
              {stats.samplingNeeded > 0 ? `${stats.samplingNeeded} ta taom` : '72 Soat'}
            </h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 bg-white rounded-[40px] border border-brand-border shadow-sm overflow-hidden flex flex-col">
          <div className="p-8 border-b border-slate-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50/30">
             <h4 className="font-black text-brand-depth uppercase text-sm tracking-widest flex items-center gap-2">
                <FlaskConical size={18} className="text-brand-primary" /> Sinamalar Jurnali
             </h4>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[700px]">
              <thead>
                <tr className="bg-slate-50/50 text-[10px] text-brand-muted uppercase font-bold tracking-widest border-b border-slate-100">
                  <th className="px-8 py-5">ID / Taom Nomi</th>
                  <th className="px-8 py-5">Partiya No.</th>
                  <th className="px-8 py-5">Status</th>
                  <th className="px-8 py-5">Xavf</th>
                  <th className="px-8 py-5 text-right">Amallar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {samples.map(sample => (
                  <tr key={sample.sample_id} className="group hover:bg-slate-50/80 transition-all cursor-pointer" onClick={() => setSelectedSample(sample)}>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${sample.risk_level === 'CRITICAL' ? 'bg-rose-100 text-rose-600' : 'bg-slate-100 text-slate-500'}`}>
                          <Beaker size={20} />
                        </div>
                        <div>
                          <p className="text-sm font-black text-brand-depth leading-tight">{sample.dish_name}</p>
                          <p className="text-[10px] text-brand-muted font-bold tracking-widest uppercase">{sample.sample_id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <code className="text-[10px] font-mono bg-slate-100 px-2 py-1 rounded text-slate-600 uppercase">{sample.batch_reference}</code>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2 text-[10px] font-black uppercase text-brand-muted">
                        {getStatusIcon(sample.status)}
                        {sample.status}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`px-3 py-1.5 rounded-xl border text-[9px] font-black uppercase tracking-wide ${getRiskBadge(sample.risk_level)}`}>
                        {sample.risk_level}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                       <button className="p-2 hover:bg-white rounded-lg transition-colors text-slate-400 hover:text-brand-primary">
                          <ChevronRight size={20} />
                       </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
           <div className="bg-white p-8 rounded-[40px] border border-brand-border shadow-sm space-y-6">
              <h4 className="font-black text-brand-depth uppercase text-xs tracking-widest flex items-center gap-2">
                 <Utensils size={18} className="text-orange-500" /> Navbatda (Namuna)
              </h4>
              <div className="space-y-4">
                 {kitchenTasks.filter(t => (t.status === 'TAYYOR' || t.status === 'SUZISHGA_TAYYOR') && !samples.find(s => s.dish_id === t.id)).length === 0 ? (
                   <div className="text-center py-10 opacity-30">
                      <ShieldCheck size={40} className="mx-auto text-emerald-500 mb-4" />
                      <p className="text-xs font-black uppercase tracking-widest">Barchasi joyida</p>
                   </div>
                 ) : (
                   kitchenTasks.filter(t => (t.status === 'TAYYOR' || t.status === 'SUZISHGA_TAYYOR') && !samples.find(s => s.dish_id === t.id)).map(task => (
                    <div key={task.id} className="p-5 bg-orange-50 rounded-[32px] border border-orange-100 group hover:scale-[1.02] transition-all cursor-pointer" onClick={() => {
                        setNewSample(prev => ({ ...prev, dish_id: task.id, dish_name: task.mealName }));
                        setShowAddModal(true);
                    }}>
                       <div className="flex justify-between items-start mb-3">
                          <span className="text-[10px] font-black bg-white px-3 py-1 rounded-full text-orange-600 shadow-sm">{task.mealType}</span>
                       </div>
                       <h5 className="font-black text-brand-depth text-sm mb-1">{task.mealName}</h5>
                       <p className="text-[10px] text-orange-600/60 font-black uppercase tracking-widest flex items-center gap-2">
                          <Plus size={12} /> Namuna oling
                       </p>
                    </div>
                   ))
                 )}
              </div>
           </div>

           <div className="bg-brand-depth p-8 rounded-[40px] text-white relative overflow-hidden shadow-xl">
              <h4 className="text-[10px] font-black uppercase tracking-widest mb-4 opacity-50 relative z-10">Sanitariya Normasi</h4>
              <p className="text-sm font-bold leading-relaxed relative z-10">
                Har bir taomdan kamida 100g namuna olinishi va 72 soat saqlanishi shart.
              </p>
              <div className="mt-6 flex items-center gap-4 relative z-10 border-t border-white/10 pt-6">
                 <div className="p-3 bg-white/10 rounded-2xl"><Info size={20} className="text-brand-primary" /></div>
                 <span className="text-[10px] font-black uppercase tracking-widest">To'liq reglament</span>
              </div>
           </div>
        </div>
      </div>

      {stats.critical > 0 && (
        <motion.div initial={{ y: 50 }} animate={{ y: 0 }} className="bg-rose-600 text-white p-6 rounded-[32px] shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6 border-4 border-rose-500/20">
          <div className="flex items-center gap-6">
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center animate-pulse shrink-0"><AlertOctagon size={32} /></div>
            <div>
               <h4 className="text-xl font-black uppercase tracking-tighter">DIQQAT: KRITIK HOLAT!</h4>
               <p className="text-sm opacity-90 font-bold leading-tight">Zudlik bilan taom berishni to'xtating va barcha partiyalarni tekshiring.</p>
            </div>
          </div>
          <button className="bg-white text-rose-600 px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl whitespace-nowrap">ARALASHISH</button>
        </motion.div>
      )}

      {selectedSample && (
        <div className="fixed inset-0 bg-brand-depth/80 backdrop-blur-xl flex items-center justify-center z-[150] p-4 lg:p-12 animate-in fade-in duration-300">
           <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col border border-brand-border">
              <div className="p-8 md:p-10 space-y-8 overflow-y-auto">
                 <div className="flex justify-between items-start">
                    <div>
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border mb-4 inline-block ${getRiskBadge(selectedSample.risk_level)}`}>
                        {selectedSample.risk_level}
                      </span>
                      <h3 className="text-3xl font-black text-brand-depth leading-tight">{selectedSample.dish_name}</h3>
                      <p className="text-[10px] text-brand-muted font-black uppercase tracking-widest mt-1 italic italic text-amber-600">Laboratoriya xulosasi: {selectedSample.lab_result}</p>
                    </div>
                    <button onClick={() => { setSelectedSample(null); setIsEditingNutrition(false); }} className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center shadow-lg hover:bg-rose-50 hover:text-rose-500 transition-all text-2xl font-black">&times;</button>
                 </div>

                 <div className="grid grid-cols-2 gap-6 p-6 bg-brand-ghost rounded-3xl">
                    <div>
                       <p className="text-[10px] text-brand-muted font-black uppercase mb-1">Partiya ID</p>
                       <p className="font-mono font-black text-xs text-brand-depth">{selectedSample.batch_reference}</p>
                    </div>
                    <div>
                       <p className="text-[10px] text-brand-muted font-black uppercase mb-1">Vaqt</p>
                       <p className="font-black text-xs text-brand-depth">{new Date(selectedSample.timestamp).toLocaleString()}</p>
                    </div>
                 </div>

                 <div className="space-y-6">
                    <div className="flex items-center justify-between border-b-2 border-slate-50 pb-2">
                       <h5 className="text-[11px] font-black text-brand-depth uppercase tracking-widest flex items-center gap-2">
                          <Database size={16} className="text-brand-primary" /> Ozuqaviy Tarkib
                       </h5>
                       {!isEditingNutrition && (
                          <button onClick={() => { setTempNutrition(selectedSample.nutrition || { vitamins: '', starch: '', carbs: '', proteins: '', fats: '', calories: '', weight: '' }); setIsEditingNutrition(true); }} className="text-[10px] font-black text-brand-primary uppercase hover:underline">Tahrirlash</button>
                       )}
                    </div>

                    {isEditingNutrition ? (
                       <div className="grid grid-cols-3 gap-4">
                          {['weight', 'starch', 'carbs', 'proteins', 'fats', 'calories'].map(key => (
                             <div key={key}>
                                <label className="text-[9px] font-black text-brand-muted uppercase ml-1">{key}</label>
                                <input className="w-full bg-slate-50 border-2 border-transparent focus:border-brand-primary rounded-xl px-4 py-3 text-xs font-black outline-none" value={(tempNutrition as any)[key] || ''} onChange={e => setTempNutrition(prev => ({...prev!, [key]: e.target.value}))} />
                             </div>
                          ))}
                          <div className="col-span-3 flex gap-2 pt-4">
                             <button onClick={updateNutrition} className="flex-1 bg-brand-primary text-white py-4 rounded-xl text-[10px] font-black uppercase tracking-widest">Saqlash</button>
                             <button onClick={() => setIsEditingNutrition(false)} className="flex-1 bg-slate-100 text-brand-muted py-4 rounded-xl text-[10px] font-black uppercase tracking-widest">Bekorga</button>
                          </div>
                       </div>
                    ) : (
                       <div className="grid grid-cols-3 gap-6 text-center">
                          {Object.entries(selectedSample.nutrition || {}).filter(([k]) => k !== 'vitamins').map(([key, val]) => (
                             <div key={key} className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <p className="text-[9px] font-black text-brand-muted uppercase mb-1">{key}</p>
                                <p className="text-sm font-black text-brand-depth">{val}</p>
                             </div>
                          ))}
                       </div>
                    )}
                 </div>

                 <div className="flex gap-4">
                    <button className="flex-1 bg-brand-ghost border-2 border-brand-primary/10 py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2">
                       <Download size={18} /> PDF Eksport
                    </button>
                    <button onClick={() => { setSelectedSample(null); setIsEditingNutrition(false); }} className="flex-1 bg-brand-depth text-white py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest">Yopish</button>
                 </div>
              </div>
           </motion.div>
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 bg-brand-depth/80 backdrop-blur-xl flex items-center justify-center z-[150] p-4 animate-in fade-in duration-300">
           <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white w-full max-w-2xl rounded-[40px] p-8 md:p-12 shadow-2xl relative overflow-y-auto max-h-[90vh] scrollbar-hidden">
             <div className="flex justify-between items-start mb-10">
               <div>
                  <h3 className="text-3xl font-black text-brand-depth">Yangi Sinama Qabul</h3>
                  <p className="text-xs text-brand-muted uppercase font-bold tracking-widest mt-1">Reglament asosida namunani ro'yxatdan o'tkazing</p>
               </div>
               <button onClick={() => setShowAddModal(false)} className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center shadow-lg hover:bg-rose-50 hover:text-rose-500 transition-all text-2xl font-black">&times;</button>
             </div>

             <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-brand-muted uppercase tracking-widest ml-1">Taom Nomi</label>
                    <input className="w-full bg-slate-50 border-2 border-transparent focus:border-brand-primary rounded-2xl p-4 font-black outline-none" placeholder="Moshxo'rda" value={newSample.dish_name || ''} onChange={e => setNewSample(prev => ({...prev, dish_name: e.target.value}))} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-brand-muted uppercase tracking-widest ml-1">Saqlash Joyi</label>
                    <input className="w-full bg-slate-50 border-2 border-transparent focus:border-brand-primary rounded-2xl p-4 font-black outline-none" placeholder="Muzlatgich-01" value={newSample.storage_location || ''} onChange={e => setNewSample(prev => ({...prev, storage_location: e.target.value}))} />
                  </div>
                </div>

                <div className="space-y-4">
                   <p className="text-[10px] font-black text-brand-muted uppercase tracking-widest">Bajarilishi shart (Checklist)</p>
                   {LAB_CHECKLIST_ITEMS.map((text, i) => (
                     <button key={i} onClick={() => setLabChecklist(prev => ({...prev, [i]: !prev[i]}))} className={`w-full text-left p-5 rounded-3xl border-2 transition-all flex items-center gap-4 ${labChecklist[i] ? 'bg-emerald-50 border-emerald-500 shadow-xl' : 'bg-slate-50 border-transparent hover:border-brand-primary/20'}`}>
                        <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${labChecklist[i] ? 'bg-emerald-500 text-white' : 'bg-white border'}`}>
                           {labChecklist[i] && <CheckCircle2 size={16} />}
                        </div>
                        <span className={`text-sm font-black ${labChecklist[i] ? 'text-emerald-700' : 'text-brand-depth'}`}>{text}</span>
                     </button>
                   ))}
                </div>

                <button onClick={() => {
                  const sample: LabSample = {
                    ...newSample as any,
                    sample_id: `SAMP-${Date.now().toString().slice(-6)}`,
                    batch_reference: `B-${new Date().getHours()}${new Date().getMinutes()}`,
                    date: new Date().toISOString().split('T')[0],
                    timestamp: new Date().toISOString(),
                    created_by: 'N. Karimov',
                    lab_result: 'Nazorat qilinmoqda',
                    nutrition: newSampleNutrition
                  };
                  setSamples(prev => [sample, ...prev]);
                  setShowAddModal(false);
                  setLabChecklist({});
                }} disabled={!allLabChecksDone || !newSample.dish_name || !newSample.storage_location} className={`w-full py-5 rounded-3xl font-black uppercase text-xs tracking-widest transition-all shadow-xl ${allLabChecksDone && newSample.dish_name && newSample.storage_location ? 'bg-brand-depth text-white hover:scale-[1.02]' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}>Namuna Saqlash</button>
             </div>
           </motion.div>
        </div>
      )}
    </div>
  );
};

export default LabView;
