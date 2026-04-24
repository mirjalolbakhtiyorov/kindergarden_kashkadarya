import React, { useState, useMemo } from 'react';
import { 
  ShieldCheck, 
  Utensils, 
  Package, 
  AlertTriangle, 
  Clock, 
  FlaskConical, 
  CheckCircle2, 
  Coffee, 
  ShieldAlert,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { KitchenTask, KitchenStatus } from '../../types';

interface KitchenManagerViewProps {
  tasks: KitchenTask[];
  setTasks: React.Dispatch<React.SetStateAction<KitchenTask[]>>;
}

const KitchenManagerView: React.FC<KitchenManagerViewProps> = ({ tasks, setTasks }) => {
  const [hygieneChecked, setHygieneChecked] = useState(false);
  const [hygieneList, setHygieneList] = useState<Record<number, boolean>>({});
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestText, setRequestText] = useState('');
  const [alertText, setAlertText] = useState('');

  const stats = useMemo(() => ({
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'TAYYOR' || t.status === 'SUZISHGA_TAYYOR').length,
    inProgress: tasks.filter(t => t.status === 'PISHIRILYAPTI').length,
    totalPortions: tasks.reduce((sum, t) => sum + t.portions, 0),
    dietPortions: tasks.reduce((sum, t) => sum + t.dietPortions, 0),
    alerts: tasks.some(t => t.ingredients.some(i => !i.inStock)) ? 1 : 0
  }), [tasks]);

  const updateStatus = (taskId: string, newStatus: KitchenStatus) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        const update: Partial<KitchenTask> = { status: newStatus };
        if (newStatus === 'PISHIRILYAPTI' && !t.startTime) update.startTime = new Date().toLocaleTimeString();
        if (newStatus === 'TAYYOR') update.completedAt = new Date().toLocaleTimeString();
        return { ...t, ...update };
      }
      return t;
    }));
  };

  const getStatusColor = (status: KitchenStatus) => {
    switch (status) {
      case 'BOSHLASH': return 'bg-slate-100 text-slate-600';
      case 'PISHIRILYAPTI': return 'bg-rose-100 text-rose-600';
      case 'TAYYOR': return 'bg-emerald-100 text-emerald-600';
      case 'SUZISHGA_TAYYOR': return 'bg-blue-100 text-blue-600';
    }
  };

  const handleRequestSend = () => {
    if (!requestText.trim()) return;
    alert(`Omborchiga so'rov yuborildi: ${requestText}`);
    setRequestText('');
    setShowRequestModal(false);
  };

  const handleAlertSend = () => {
    if (!alertText.trim()) return;
    alert(`ADMINISTRATSIYAGA BILDIDIRISHNOMA YUBORILDI: ${alertText}`);
    setAlertText('');
    setShowIssueModal(false);
  };

  const HYGIENE_ITEMS = [
    "Maxsus kiyim va qalpoq kiyilgan",
    "Qo'llar antibakterial sovun bilan yuvildi",
    "Ishchi yuzalar dezinfeksiya qilindi",
    "Salomatlik holati yaxshi (isitma/yo'tal yo'q)",
    "Tirnoqlar to'g'ri olingan va toza",
    "Oshxona anjomlari sterillangan",
    "Muzlatgich harorati nazorat qilindi (+4°C gacha)",
    "Chiqindilar o'z vaqtida chiqarildi"
  ];

  const allHygieneDone = HYGIENE_ITEMS.every((_, i) => hygieneList[i]);

  if (!hygieneChecked) {
    return (
      <div className="max-w-xl mx-auto mt-20 p-10 bg-white rounded-[40px] border border-brand-border shadow-2xl space-y-8 text-center animate-in zoom-in-95 duration-500">
        <div className="w-20 h-20 bg-emerald-50 text-brand-emerald rounded-3xl flex items-center justify-center mx-auto mb-6">
          <ShieldCheck size={40} />
        </div>
        <div>
          <h2 className="text-3xl font-black text-brand-depth">Xavfsizlik Nazorati</h2>
          <p className="text-brand-muted font-bold text-sm mt-2 uppercase tracking-widest">Ish boshlashdan oldin gigiyena tasdig'i talab etiladi</p>
        </div>
        <div className="space-y-4 text-left max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
          {HYGIENE_ITEMS.map((check, i) => (
            <div key={i} className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-brand-primary transition-all group">
               <input 
                 type="checkbox" 
                 className="w-5 h-5 accent-brand-emerald cursor-pointer" 
                 id={`check-${i}`} 
                 checked={!!hygieneList[i]}
                 onChange={(e) => setHygieneList(prev => ({ ...prev, [i]: e.target.checked }))}
               />
               <label htmlFor={`check-${i}`} className="text-sm font-bold text-brand-depth cursor-pointer flex-1">{check}</label>
            </div>
          ))}
        </div>
        <button 
          onClick={() => setHygieneChecked(true)}
          disabled={!allHygieneDone}
          className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest shadow-xl transition-all ${
            allHygieneDone 
              ? 'bg-brand-depth text-white hover:scale-[1.02]' 
              : 'bg-slate-200 text-slate-400 cursor-not-allowed opacity-70'
          }`}
        >
          {allHygieneDone ? 'TASDIQLASH VA ISHNI BOSHLASH' : 'QUYIDAGI ISHLARNI BAJARING VA TASDIQLANG'}
        </button>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-brand-depth tracking-tight">Oshxona Nazorati</h2>
          <p className="text-brand-muted text-xs font-bold uppercase tracking-widest mt-1">Real-vaqtda taom tayyorlash va tarqatish monitoringi</p>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
           <button onClick={() => setShowIssueModal(true)} className="flex-1 md:flex-none justify-center bg-rose-50 text-rose-600 px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-wider flex items-center gap-2 border border-rose-100 hover:bg-rose-100 transition-all">
              <AlertTriangle size={14} /> MUAMMO (ALERT)
           </button>
           <button onClick={() => setShowRequestModal(true)} className="flex-1 md:flex-none justify-center bg-white border border-brand-border px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-wider flex items-center gap-2 hover:border-brand-primary transition-all">
              <Package size={14} /> MAHSULOT SO'ROVI
           </button>
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showRequestModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowRequestModal(false)} className="absolute inset-0 bg-brand-depth/40 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative w-full max-w-md bg-white rounded-[40px] shadow-2xl p-8 space-y-6">
              <div className="flex items-center gap-4 text-brand-depth">
                <div className="p-3 bg-brand-primary/10 rounded-2xl"><Package size={24} className="text-brand-primary" /></div>
                <h3 className="text-xl font-black">Mahsulot So'rovi</h3>
              </div>
              <p className="text-brand-muted text-sm font-bold uppercase tracking-tighter">Omborga kerakli masalliqlarni yozib yuboring</p>
              <textarea 
                value={requestText}
                onChange={(e) => setRequestText(e.target.value)}
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-3xl p-6 text-sm font-bold outline-none focus:border-brand-primary"
                placeholder="Masalan: 5kg Kartoshka, 2 litr Yog'..."
                rows={4}
              />
              <div className="flex gap-4">
                <button onClick={() => setShowRequestModal(false)} className="flex-1 py-4 border border-brand-border rounded-2xl font-black text-brand-muted uppercase text-[10px] tracking-widest hover:bg-slate-50">Bekor qilish</button>
                <button onClick={handleRequestSend} className="flex-1 py-4 bg-brand-primary text-white rounded-2xl font-black shadow-lg shadow-brand-primary/20 uppercase text-[10px] tracking-widest hover:bg-brand-primary/90">Yuborish</button>
              </div>
            </motion.div>
          </div>
        )}

        {showIssueModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowIssueModal(false)} className="absolute inset-0 bg-brand-depth/40 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative w-full max-w-md bg-white rounded-[40px] shadow-2xl p-8 space-y-6">
              <div className="flex items-center gap-4 text-rose-600">
                <div className="p-3 bg-rose-50 rounded-2xl"><ShieldAlert size={24} /></div>
                <h3 className="text-xl font-black">Tezkor Bildirishnoma</h3>
              </div>
              <p className="text-brand-muted text-sm font-bold uppercase tracking-tighter">Oshxonadagi muammo haqida ogohlantiring</p>
              <textarea 
                value={alertText}
                onChange={(e) => setAlertText(e.target.value)}
                className="w-full bg-rose-50/30 border-2 border-rose-100 rounded-3xl p-6 text-sm font-bold outline-none focus:border-rose-500 text-rose-700"
                placeholder="Muammo tafsilotini yozing..."
                rows={4}
              />
              <div className="flex gap-4">
                <button onClick={() => setShowIssueModal(false)} className="flex-1 py-4 border border-brand-border rounded-2xl font-black text-brand-muted uppercase text-[10px] tracking-widest hover:bg-slate-50">Yopish</button>
                <button onClick={handleAlertSend} className="flex-1 py-4 bg-rose-500 text-white rounded-2xl font-black shadow-lg shadow-rose-500/20 uppercase text-[10px] tracking-widest hover:bg-rose-600">Yuborish (Urgent)</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-brand-border shadow-sm">
          <p className="text-brand-muted text-[10px] font-bold uppercase tracking-widest mb-1">Jami porsiyalar</p>
          <h3 className="text-2xl font-black text-brand-depth">{stats.totalPortions} ta</h3>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-brand-border shadow-sm border-l-4 border-l-brand-primary">
          <p className="text-brand-muted text-[10px] font-bold uppercase tracking-widest mb-1">Parhezli ovqatlar</p>
          <h3 className="text-2xl font-black text-brand-primary">{stats.dietPortions} ta</h3>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-brand-border shadow-sm">
          <p className="text-brand-muted text-[10px] font-bold uppercase tracking-widest mb-1">Tayyor bo'ldi</p>
          <h3 className="text-2xl font-black text-brand-emerald">{stats.completed} ta taom</h3>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-brand-border shadow-sm border-l-4 border-l-rose-500">
          <p className="text-brand-muted text-[10px] font-bold uppercase tracking-widest mb-1">Muammo / Tanqislik</p>
          <h3 className="text-2xl font-black text-rose-500">{stats.alerts} ta</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Active Tasks */}
        <div className="col-span-1 lg:col-span-8 space-y-6">
           <h4 className="font-black text-brand-depth uppercase text-sm tracking-widest flex items-center gap-2 px-4 italic border-l-4 border-brand-primary">
              <Utensils size={18} className="text-brand-primary" /> Kunlik Taomlar Rejasi
           </h4>
           {tasks.map(task => (
             <div key={task.id} className="bg-white rounded-[40px] border border-brand-border shadow-sm overflow-hidden group hover:border-brand-primary transition-all">
                <div className="p-8 flex flex-col md:flex-row items-start gap-8">
                   <div className={`p-6 rounded-3xl shrink-0 ${
                     task.mealType === 'LUNCH' ? 'bg-orange-50 text-orange-500' : 
                     task.mealType === 'BREAKFAST' ? 'bg-blue-50 text-blue-500' : 
                     task.mealType === 'TEA' ? 'bg-amber-50 text-amber-500' : 
                     'bg-indigo-50 text-indigo-500'
                   }`}>
                      {task.mealType === 'LUNCH' || task.mealType === 'DINNER' ? <Utensils size={32} /> : <Coffee size={32} />}
                   </div>
                   <div className="flex-1 space-y-4 w-full">
                      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                         <div>
                            <span className="px-3 py-1 bg-slate-100 text-slate-500 text-[9px] font-black uppercase rounded-full tracking-tighter mb-2 inline-block">{task.mealType}</span>
                            <h5 className="text-2xl font-black text-brand-depth">{task.mealName}</h5>
                            <div className="flex flex-wrap items-center gap-3 mt-1">
                               <p className="text-brand-muted font-bold text-sm">{task.portions} ta porsiya</p>
                               {task.portions !== task.originalPortions && (
                                 <span className="px-2 py-0.5 bg-amber-50 text-amber-600 text-[9px] font-black rounded border border-amber-100 animate-pulse">
                                    Porsiya o'zgardi! (+{task.portions - task.originalPortions})
                                 </span>
                               )}
                               <span className="text-brand-primary font-bold text-sm">• Barcha guruhlar</span>
                            </div>
                         </div>
                         <div className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest shrink-0 ${getStatusColor(task.status)}`}>
                            {task.status}
                         </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-4 border-t border-slate-50">
                         {(['BOSHLASH', 'PISHIRILYAPTI', 'TAYYOR'] as KitchenStatus[]).map((step) => (
                           <button 
                             key={step}
                             onClick={() => updateStatus(task.id, step)}
                             className={`py-3 rounded-2xl font-black text-[9px] uppercase tracking-widest transition-all ${
                               task.status === step ? 'bg-brand-depth text-white shadow-lg' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'
                             }`}
                           >
                             {step.replace('_', ' ')}
                           </button>
                         ))}
                         {task.status === 'TAYYOR' ? (
                           <button 
                             onClick={() => updateStatus(task.id, 'SUZISHGA_TAYYOR')}
                             className="py-3 rounded-2xl font-black text-[9px] uppercase tracking-widest bg-brand-primary text-white shadow-lg animate-bounce"
                           >
                             SUZISHGA TAYYOR →
                           </button>
                         ) : (
                           <button 
                             disabled={task.status !== 'SUZISHGA_TAYYOR'}
                             onClick={() => updateStatus(task.id, 'SUZISHGA_TAYYOR')}
                             className={`py-3 rounded-2xl font-black text-[9px] uppercase tracking-widest transition-all ${
                               task.status === 'SUZISHGA_TAYYOR' ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-50 text-slate-400'
                             }`}
                           >
                             SUZISHGA TAYYOR
                           </button>
                         )}
                      </div>
                   </div>
                </div>

                {/* Ingredients Drawdown */}
                <div className="bg-slate-50/50 p-6 px-10 border-t border-slate-100">
                   <h6 className="text-[10px] font-black text-brand-muted uppercase tracking-widest mb-4 italic">Kerakli masalliqlar:</h6>
                   <div className="flex flex-wrap gap-4">
                      {task.ingredients.map((ing, i) => (
                        <div key={i} className={`px-4 py-2 rounded-xl border flex items-center gap-3 transition-colors ${
                          ing.inStock ? (ing.isUrgent ? 'bg-white border-amber-300' : 'bg-white border-slate-200') : 'bg-rose-50 border-rose-200'
                        }`}>
                           <div className={`w-2 h-2 rounded-full ${ing.inStock ? (ing.isUrgent ? 'bg-amber-500' : 'bg-emerald-500') : 'bg-rose-500 animate-pulse'}`} />
                           <div>
                              <p className="text-xs font-black text-brand-depth">{ing.name}</p>
                              <p className="text-[10px] font-bold text-brand-muted">
                                {ing.amount} {ing.unit} 
                                {ing.expiryDate && <span className={`ml-2 ${ing.isUrgent ? 'text-amber-600' : ''}`}>Amal: {ing.expiryDate}</span>}
                              </p>
                           </div>
                           {!ing.inStock && <AlertCircle size={14} className="text-rose-500 ml-1" />}
                           {ing.isUrgent && <AlertTriangle size={14} className="text-amber-500 ml-1" />}
                        </div>
                      ))}
                   </div>
                </div>
             </div>
           ))}
        </div>

        {/* Right: Operational Info */}
        <div className="col-span-1 lg:col-span-4 space-y-6">
           <div className="bg-brand-depth p-8 rounded-[40px] text-white space-y-6 shadow-xl relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-brand-primary/10 rounded-full blur-3xl"></div>
              <h4 className="font-black text-sm uppercase tracking-widest flex items-center gap-2 relative z-10">
                 <Clock size={18} className="text-brand-primary" /> Vaqt Nazorati
              </h4>
              <div className="space-y-4 relative z-10">
                 <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                    <p className="text-white/40 text-[9px] font-black uppercase mb-1">Tayyorlash boshlandi</p>
                    <p className="text-lg font-black">{tasks.find(t => t.status === 'PISHIRILYAPTI')?.startTime || '--:--'}</p>
                 </div>
                 <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                    <p className="text-white/40 text-[9px] font-black uppercase mb-1">Taxminiy tugash</p>
                    <p className="text-lg font-black text-brand-primary">12:30</p>
                 </div>
              </div>
              <button className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-white/10 transition-colors relative z-10">
                 Kechikish haqida xabar bering
              </button>
           </div>

           <div className="bg-white p-8 rounded-[40px] border border-brand-border shadow-sm space-y-6">
              <h4 className="font-black text-brand-depth text-sm uppercase tracking-widest flex items-center gap-2">
                 <FlaskConical size={18} className="text-brand-emerald" /> Sanitar Nazorat
              </h4>
              <div className="space-y-4">
                 <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                    <span className="text-xs font-bold text-brand-emerald">Gigiyena tasdiqlangan</span>
                    <CheckCircle2 size={18} className="text-brand-emerald" />
                 </div>
                 <div className="p-4 bg-slate-50 rounded-2xl border border-brand-border space-y-3">
                    <p className="text-[10px] font-black text-brand-muted uppercase tracking-widest">Taom Harorati (C°)</p>
                    <div className="flex items-center gap-4">
                       <input type="number" defaultValue={72} className="w-24 bg-white border-2 border-slate-100 rounded-xl p-2.5 font-black text-brand-depth outline-none focus:border-brand-emerald transition-all" />
                       <span className="text-[10px] font-black text-brand-emerald bg-emerald-100 px-3 py-1.5 rounded-full uppercase tracking-tighter">Normal ✓</span>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default KitchenManagerView;
