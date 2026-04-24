import React, { useState, useMemo } from 'react';
import { 
  ShieldCheck, 
  Utensils, 
  Calendar, 
  ShieldAlert, 
  AlertCircle, 
  Info, 
  Coffee, 
  Salad, 
  Apple, 
  ChefHat, 
  FileText, 
  Archive, 
  TrendingUp, 
  FlaskConical,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { DISH_DATABASE } from '../../constants/mockData';

interface NutritionistViewProps {
  groups: any[];
}

const NutritionistView: React.FC<NutritionistViewProps> = ({ groups }) => {
  const [activeDay, setActiveDay] = useState(1);
  const [activeMeal, setActiveMeal] = useState<'breakfast' | 'lunch' | 'tea' | 'dinner'>('breakfast');
  const [selectedAge, setSelectedAge] = useState<'1-3' | '3-7'>('1-3');
  const [menuType, setMenuType] = useState<'standard' | 'alternative'>('standard');
  const [menu, setMenu] = useState<Record<string, Record<number, Record<string, { standard: string, alternative: string }>>>>({
    '1-3': {
      1: { breakfast: { standard: 'd1', alternative: 'd8' }, lunch: { standard: 'd3', alternative: 'd5' }, tea: { standard: 'd6', alternative: 'd10' }, dinner: { standard: 'd7', alternative: 'd14' } },
      2: { breakfast: { standard: 'd2', alternative: 'd11' }, lunch: { standard: 'd4', alternative: 'd12' }, tea: { standard: 'd6', alternative: 'd13' }, dinner: { standard: 'd7', alternative: 'd14' } },
      3: { breakfast: { standard: 'd8', alternative: 'd1' }, lunch: { standard: 'd9', alternative: 'd3' }, tea: { standard: 'd10', alternative: 'd6' }, dinner: { standard: 'd14', alternative: 'd7' } },
      4: { breakfast: { standard: 'd11', alternative: 'd2' }, lunch: { standard: 'd12', alternative: 'd4' }, tea: { standard: 'd13', alternative: 'd6' }, dinner: { standard: 'd7', alternative: 'd4' } },
      5: { breakfast: { standard: 'd1', alternative: 'd8' }, lunch: { standard: 'd5', alternative: 'd9' }, tea: { standard: 'd6', alternative: 'd10' }, dinner: { standard: 'd14', alternative: 'd7' } },
      6: { breakfast: { standard: 'd2', alternative: 'd11' }, lunch: { standard: 'd3', alternative: 'd12' }, tea: { standard: 'd13', alternative: 'd6' }, dinner: { standard: 'd7', alternative: 'd14' } },
      7: { breakfast: { standard: 'd11', alternative: 'd1' }, lunch: { standard: 'd4', alternative: 'd3' }, tea: { standard: 'd10', alternative: 'd6' }, dinner: { standard: 'd14', alternative: 'd7' } },
      8: { breakfast: { standard: 'd8', alternative: 'd2' }, lunch: { standard: 'd12', alternative: 'd5' }, tea: { standard: 'd6', alternative: 'd13' }, dinner: { standard: 'd7', alternative: 'd14' } },
      9: { breakfast: { standard: 'd1', alternative: 'd11' }, lunch: { standard: 'd9', alternative: 'd4' }, tea: { standard: 'd13', alternative: 'd10' }, dinner: { standard: 'd14', alternative: 'd7' } },
      10: { breakfast: { standard: 'd2', alternative: 'd8' }, lunch: { standard: 'd3', alternative: 'd9' }, tea: { standard: 'd10', alternative: 'd6' }, dinner: { standard: 'd7', alternative: 'd14' } },
    },
    '3-7': {
      1: { breakfast: { standard: 'd1', alternative: 'd8' }, lunch: { standard: 'd3', alternative: 'd5' }, tea: { standard: 'd6', alternative: 'd10' }, dinner: { standard: 'd7', alternative: 'd14' } },
      2: { breakfast: { standard: 'd2', alternative: 'd11' }, lunch: { standard: 'd4', alternative: 'd12' }, tea: { standard: 'd6', alternative: 'd13' }, dinner: { standard: 'd7', alternative: 'd14' } },
      3: { breakfast: { standard: 'd8', alternative: 'd1' }, lunch: { standard: 'd9', alternative: 'd3' }, tea: { standard: 'd10', alternative: 'd6' }, dinner: { standard: 'd14', alternative: 'd7' } },
      4: { breakfast: { standard: 'd11', alternative: 'd2' }, lunch: { standard: 'd12', alternative: 'd4' }, tea: { standard: 'd13', alternative: 'd6' }, dinner: { standard: 'd7', alternative: 'd4' } },
      5: { breakfast: { standard: 'd1', alternative: 'd8' }, lunch: { standard: 'd5', alternative: 'd9' }, tea: { standard: 'd6', alternative: 'd10' }, dinner: { standard: 'd14', alternative: 'd7' } },
      6: { breakfast: { standard: 'd2', alternative: 'd11' }, lunch: { standard: 'd3', alternative: 'd12' }, tea: { standard: 'd13', alternative: 'd6' }, dinner: { standard: 'd7', alternative: 'd14' } },
      7: { breakfast: { standard: 'd11', alternative: 'd1' }, lunch: { standard: 'd4', alternative: 'd3' }, tea: { standard: 'd10', alternative: 'd6' }, dinner: { standard: 'd14', alternative: 'd7' } },
      8: { breakfast: { standard: 'd8', alternative: 'd2' }, lunch: { standard: 'd12', alternative: 'd5' }, tea: { standard: 'd6', alternative: 'd13' }, dinner: { standard: 'd7', alternative: 'd14' } },
      9: { breakfast: { standard: 'd1', alternative: 'd11' }, lunch: { standard: 'd9', alternative: 'd4' }, tea: { standard: 'd13', alternative: 'd10' }, dinner: { standard: 'd14', alternative: 'd7' } },
      10: { breakfast: { standard: 'd2', alternative: 'd8' }, lunch: { standard: 'd3', alternative: 'd9' }, tea: { standard: 'd10', alternative: 'd6' }, dinner: { standard: 'd7', alternative: 'd14' } },
    }
  });

  const [status, setStatus] = useState<Record<string, Record<number, 'draft' | 'approved'>>>({
    '1-3': { 1: 'draft', 2: 'draft' },
    '3-7': { 1: 'draft', 2: 'draft' }
  });

  const [manualNutrition, setManualNutrition] = useState<Record<string, Record<number, Record<string, Record<string, { starch: number, carbs: number, vitamins: string }>>>>>({});

  const handleManualNutrientChange = (day: number, meal: string, type: 'standard' | 'alternative', field: 'starch' | 'carbs' | 'vitamins', value: any) => {
    setManualNutrition(prev => ({
      ...prev,
      [selectedAge]: {
        ...(prev[selectedAge] || {}),
        [day]: {
          ...(prev[selectedAge]?.[day] || {}),
          [meal]: {
            ...(prev[selectedAge]?.[day]?.[meal] || {}),
            [type]: {
              ...(prev[selectedAge]?.[day]?.[meal]?.[type] || { starch: 0, carbs: 0, vitamins: '' }),
              [field]: field === 'vitamins' ? value : Number(value)
            }
          }
        }
      }
    }));
  };

  const getNutrient = (day: number, meal: string, type: 'standard' | 'alternative') => {
    const dishId = menu[selectedAge][day]?.[meal]?.[type];
    const dish = DISH_DATABASE.find(d => d.id === dishId);
    const defaults = dish?.nutrition[selectedAge as '1-3' | '3-7'] || { kcal: 0, proteins: 0, fats: 0, carbs: 0, starch: 0, vitamins: '-' };
    const manual = manualNutrition[selectedAge]?.[day]?.[meal]?.[type] || {};
    
    return {
      ...defaults,
      starch: manual.starch ?? defaults.starch,
      carbs: manual.carbs ?? defaults.carbs,
      vitamins: manual.vitamins ?? defaults.vitamins
    };
  };

  const currentDishEntry = menu[selectedAge][activeDay]?.[activeMeal] || { standard: '', alternative: '' };
  const currentDishId = menuType === 'standard' ? currentDishEntry.standard : currentDishEntry.alternative;
  const currentDish = DISH_DATABASE.find(d => d.id === currentDishId);
  const currentNutrition = useMemo(() => getNutrient(activeDay, activeMeal, menuType), [activeDay, activeMeal, menuType, selectedAge, manualNutrition, menu]);

  const conflicts = useMemo(() => {
    if (!currentDish) return [];
    const results: { child: string, group: string, allergen: string }[] = [];
    
    groups.forEach(group => {
      group.children.forEach((child: any) => {
        const matchingAllergen = currentDish.ingredients.find(ing => 
          child.allergy.toLowerCase().includes(ing.toLowerCase())
        );
        if (matchingAllergen) {
          results.push({ child: child.name, group: group.name, allergen: matchingAllergen });
        }
      });
    });
    
    return results;
  }, [currentDish, groups]);

  const handleDishChange = (dishId: string) => {
    setMenu(prev => ({
      ...prev,
      [selectedAge]: {
        ...prev[selectedAge],
        [activeDay]: {
          ...(prev[selectedAge][activeDay] || { standard: '', alternative: '' }),
          [activeMeal]: {
            ...(prev[selectedAge][activeDay]?.[activeMeal] || { standard: '', alternative: '' }),
            [menuType]: dishId
          }
        }
      }
    }));
    setStatus(prev => ({
      ...prev,
      [selectedAge]: {
        ...prev[selectedAge],
        [activeDay]: 'draft'
      }
    }));
  };

  const handleApprove = () => {
    if (conflicts.length > 0) {
      alert("Diqqat! Allergiya konfliktlari mavjud. Iltimos, muammoli bolalar uchun alternativ taom belgilang!");
      return;
    }
    setStatus(prev => ({
      ...prev,
      [selectedAge]: {
        ...prev[selectedAge],
        [activeDay]: 'approved'
      }
    }));
    alert(`Yosh guruhi ${selectedAge}, Kun ${activeDay} menyusi muvaffaqiyatli tasdiqlandi va oshxonaga yuborildi!`);
  };

  return (
    <div className="p-8 animate-in fade-in space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 p-8 bg-white rounded-3xl border-b-4 border-brand-primary shadow-xl">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 bg-brand-primary/10 text-brand-primary text-[10px] font-black uppercase tracking-widest rounded-full">Oziq-ovqat nazorati</span>
            {status[selectedAge][activeDay] === 'approved' && (
              <span className="px-3 py-1 bg-emerald-100 text-emerald-600 text-[10px] font-black uppercase tracking-widest rounded-full flex items-center gap-1">
                <ShieldCheck size={10} /> Tasdiqlangan
              </span>
            )}
          </div>
          <h2 className="text-4xl font-black text-brand-depth leading-none tracking-tighter">Smart Menyu Rejalashtiruvchi</h2>
          <div className="flex flex-wrap gap-4 mt-4">
             <div className="flex bg-slate-100 p-1 rounded-xl">
               <button 
                 onClick={() => setSelectedAge('1-3')}
                 className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${selectedAge === '1-3' ? 'bg-white text-brand-primary shadow-sm' : 'text-slate-500'}`}
               >
                 1-3 yosh
               </button>
               <button 
                 onClick={() => setSelectedAge('3-7')}
                 className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${selectedAge === '3-7' ? 'bg-white text-brand-primary shadow-sm' : 'text-slate-500'}`}
               >
                 3-7 yosh
               </button>
             </div>
             <div className="flex bg-brand-primary/5 p-1 rounded-xl border border-brand-primary/10">
               <button 
                 onClick={() => setMenuType('standard')}
                 className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${menuType === 'standard' ? 'bg-brand-primary text-white shadow-lg' : 'text-brand-primary/60'}`}
               >
                 Asosiy Menyu
               </button>
               <button 
                 onClick={() => setMenuType('alternative')}
                 className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${menuType === 'alternative' ? 'bg-brand-primary text-white shadow-lg' : 'text-brand-primary/60'}`}
               >
                 Alternativ (Allergiya)
               </button>
             </div>
          </div>
        </div>
        <button 
          disabled={status[selectedAge][activeDay] === 'approved'}
          onClick={handleApprove}
          className={`flex items-center gap-2 px-10 py-4 rounded-2xl font-black transition-all transform active:scale-95 text-sm uppercase tracking-widest ${
            status[selectedAge][activeDay] === 'approved'
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
              : 'bg-brand-primary text-white shadow-xl shadow-brand-primary/30 hover:shadow-2xl hover:-translate-y-0.5'
          }`}
        >
          <ShieldCheck size={20} /> TASDIQLASH
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="col-span-1 lg:col-span-3 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-brand-border shadow-sm">
            <h3 className="font-black text-xs uppercase tracking-widest text-brand-muted mb-6 flex items-center gap-2">
              <Calendar size={16} className="text-brand-primary" /> Menyu Sikli (10 kun)
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {[...Array(10)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveDay(i + 1)}
                  className={`p-5 rounded-2xl font-black text-xl transition-all relative ${
                    activeDay === i + 1 
                      ? 'bg-brand-depth text-white shadow-lg scale-105 z-10' 
                      : 'bg-brand-ghost text-brand-muted hover:bg-slate-200'
                  }`}
                >
                  {i + 1}
                  {status[selectedAge][i + 1] === 'approved' && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center">
                       <CheckCircle2 size={12} className="text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className={`p-6 rounded-3xl border-2 transition-all ${conflicts.length > 0 ? 'bg-rose-50 border-rose-200 shadow-lg shadow-rose-100' : 'bg-brand-ghost border-transparent'}`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`font-black text-xs uppercase tracking-widest flex items-center gap-2 ${conflicts.length > 0 ? 'text-rose-700' : 'text-brand-muted'}`}>
                <ShieldAlert size={18} /> Allergiya Nazorati
              </h3>
            </div>
            {conflicts.length > 0 ? (
              <div className="space-y-3">
                {conflicts.map((conf, idx) => (
                  <div key={idx} className="bg-white p-4 rounded-2xl border border-rose-100 shadow-sm animate-in slide-in-from-left-2 duration-300">
                    <p className="text-xs font-black text-brand-depth">{conf.child}</p>
                    <p className="text-[10px] text-brand-muted mb-2 font-bold uppercase">{conf.group}</p>
                    <div className="flex items-center gap-1.5 p-2 bg-rose-50 text-rose-700 rounded-xl text-[10px] font-black uppercase">
                       <AlertCircle size={12} /> Ob'ekt: {conf.allergen}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-brand-muted flex flex-col items-center gap-2">
                 <ShieldCheck size={40} className="opacity-20 text-emerald-500" />
                 <p className="text-xs font-bold italic">Barchasi xavfsiz holatda</p>
              </div>
            )}
          </div>
        </div>

        <div className="col-span-1 lg:col-span-9 space-y-8">
          <div className="flex p-2 bg-white rounded-3xl border border-brand-border shadow-sm overflow-hidden">
            {[
              { id: 'breakfast', label: 'Nonushta', icon: Coffee },
              { id: 'lunch', label: 'Tushlik', icon: Salad },
              { id: 'tea', label: 'Poldnik', icon: Apple },
              { id: 'dinner', label: 'Kechki ovqat', icon: Utensils }
            ].map(meal => (
              <button
                key={meal.id}
                onClick={() => setActiveMeal(meal.id as any)}
                className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${
                  activeMeal === meal.id 
                    ? 'bg-brand-primary text-white shadow-xl' 
                    : 'text-brand-muted hover:bg-slate-50'
                }`}
              >
                {meal.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-[40px] border border-brand-border shadow-sm space-y-6">
               <div className="flex items-center justify-between">
                 <h4 className="text-[10px] font-black text-brand-muted uppercase tracking-widest">Taom Tanlash ({menuType})</h4>
                 <Utensils size={18} className="text-brand-primary" />
               </div>
               
               <div className="space-y-4">
                  {currentDish && (
                    <div className="relative aspect-[16/10] rounded-3xl overflow-hidden border-4 border-white shadow-xl">
                       <img src={currentDish.image} alt={currentDish.name} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                       <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-brand-depth to-transparent p-6">
                         <p className="text-white text-lg font-black leading-tight">{currentDish.name}</p>
                       </div>
                    </div>
                  )}
                  <select 
                    value={currentDishId || ''}
                    onChange={(e) => handleDishChange(e.target.value)}
                    className="w-full p-5 bg-brand-ghost border-2 border-transparent focus:border-brand-primary rounded-2xl font-black text-sm outline-none transition-all cursor-pointer shadow-inner"
                  >
                    <option value="">Taomni tanlang...</option>
                    {DISH_DATABASE.filter(d => d.type === activeMeal).map(d => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                  
                  {currentDish && (
                    <div className="flex flex-wrap gap-2 pt-2">
                      {currentDish.ingredients.map(ing => (
                        <span key={ing} className="px-3 py-1 bg-slate-100 text-[10px] font-black text-brand-depth rounded-lg uppercase tracking-wider">
                          {ing}
                        </span>
                      ))}
                    </div>
                  )}
               </div>

               <div className="pt-6 border-t border-slate-50 grid grid-cols-2 gap-4">
                  <div className="p-4 bg-emerald-50 rounded-2xl text-center">
                    <p className="text-[9px] font-black text-emerald-800 uppercase mb-1">Norma</p>
                    <p className="text-xl font-black text-emerald-900">{selectedAge === '1-3' ? '180' : '250'}gr</p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-2xl text-center">
                    <p className="text-[9px] font-black text-blue-800 uppercase mb-1">Guruh</p>
                    <p className="text-xl font-black text-blue-900">{selectedAge}</p>
                  </div>
               </div>
            </div>

            <div className="bg-brand-depth rounded-[40px] p-8 text-white relative overflow-hidden flex flex-col">
               <div className="relative z-10 space-y-6 flex-1">
                 <h4 className="text-[10px] font-black text-white/40 uppercase tracking-widest flex items-center gap-2">
                   <FileText size={16} /> Texnologik Ko'rsatmalar
                 </h4>
                 
                 {currentDish ? (
                   <div className="space-y-4 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
                     {(currentDish.tech_card as string[]).map((step, idx) => (
                       <div key={idx} className="flex gap-4 items-start">
                         <span className="w-5 h-5 bg-brand-primary rounded-full flex items-center justify-center shrink-0 font-black text-[9px] mt-0.5">{idx + 1}</span>
                         <p className="text-xs font-medium text-white/70 leading-relaxed">{step}</p>
                       </div>
                     ))}
                   </div>
                 ) : (
                   <div className="flex flex-col items-center justify-center py-20 opacity-30">
                     <ChefHat size={48} />
                     <p className="text-[10px] font-black uppercase mt-4">Taom tanlanmagan</p>
                   </div>
                 )}
               </div>

               <div className="relative z-10 pt-6 border-t border-white/10 grid grid-cols-4 gap-2 text-center mt-6">
                  <div className="p-2 bg-white/5 rounded-xl">
                    <p className="text-[8px] text-white/30 font-black uppercase">KCAL</p>
                    <p className="text-sm font-black text-brand-primary">{currentNutrition?.kcal || 0}</p>
                  </div>
                  <div className="p-2 bg-white/5 rounded-xl">
                    <p className="text-[8px] text-white/30 font-black uppercase">PROT</p>
                    <p className="text-sm font-black">{currentNutrition?.proteins || 0}</p>
                  </div>
                  <div className="p-2 bg-white/5 rounded-xl">
                    <p className="text-[8px] text-white/30 font-black uppercase">FAT</p>
                    <p className="text-sm font-black">{currentNutrition?.fats || 0}</p>
                  </div>
                  <div className="p-2 bg-white/5 rounded-xl">
                    <p className="text-[8px] text-white/30 font-black uppercase">CARB</p>
                    <p className="text-sm font-black">{currentNutrition?.carbs || 0}</p>
                  </div>
               </div>
               <ChefHat size={260} className="absolute -bottom-16 -right-16 text-white/[0.03] rotate-12" />
            </div>
          </div>

          <div className="bg-white p-8 rounded-[40px] border border-brand-border shadow-sm overflow-hidden">
             <div className="flex items-center justify-between mb-8">
                <div>
                  <h4 className="text-xl font-black text-brand-depth">Ozuqaviy Moddalar Tahlili</h4>
                  <p className="text-xs text-brand-muted mt-1 uppercase font-bold tracking-widest italic text-amber-600">Kun {activeDay} • {selectedAge} yosh • Tahrirlash mumkin</p>
                </div>
                <FlaskConical size={24} className="text-brand-primary" />
             </div>

             <div className="overflow-x-auto">
                <table className="w-full text-left min-w-[600px]">
                   <thead>
                      <tr className="bg-slate-50 text-[10px] font-black text-brand-muted uppercase tracking-widest border-b border-brand-border">
                         <th className="px-6 py-4">Taom / Vaqt</th>
                         <th className="px-6 py-4">Kraxmal (gr)</th>
                         <th className="px-6 py-4">Uglevod (gr)</th>
                         <th className="px-6 py-4">Vitaminlar</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-100">
                      {['breakfast', 'lunch', 'tea', 'dinner'].map(meal => {
                         const stdD = DISH_DATABASE.find(d => d.id === menu[selectedAge][activeDay]?.[meal]?.standard);
                         const stdN = getNutrient(activeDay, meal, 'standard');
                         const altD = DISH_DATABASE.find(d => d.id === menu[selectedAge][activeDay]?.[meal]?.alternative);
                         const altN = getNutrient(activeDay, meal, 'alternative');

                         return (
                            <React.Fragment key={meal}>
                               {stdD && (
                                  <tr className="hover:bg-slate-50/50">
                                     <td className="px-6 py-4">
                                        <p className="text-xs font-black text-brand-depth">{stdD.name}</p>
                                        <p className="text-[9px] font-bold text-slate-400 uppercase">{meal} • Standart</p>
                                     </td>
                                     <td className="px-6 py-4">
                                        <input type="number" value={stdN.starch || 0} onChange={(e) => handleManualNutrientChange(activeDay, meal, 'standard', 'starch', e.target.value)} className="w-16 p-2 bg-brand-ghost border border-brand-border rounded-lg text-xs font-black outline-none focus:border-brand-primary" />
                                     </td>
                                     <td className="px-6 py-4">
                                        <input type="number" value={stdN.carbs || 0} onChange={(e) => handleManualNutrientChange(activeDay, meal, 'standard', 'carbs', e.target.value)} className="w-16 p-2 bg-brand-ghost border border-brand-border rounded-lg text-xs font-black outline-none focus:border-brand-primary" />
                                     </td>
                                     <td className="px-6 py-4">
                                        <input type="text" value={stdN.vitamins || ''} onChange={(e) => handleManualNutrientChange(activeDay, meal, 'standard', 'vitamins', e.target.value)} className="w-full min-w-[120px] p-2 bg-brand-ghost border border-brand-border rounded-lg text-xs font-black outline-none focus:border-brand-primary" />
                                     </td>
                                  </tr>
                               )}
                               {altD && (
                                  <tr className="bg-brand-primary/[0.02]">
                                     <td className="px-6 py-4 border-l-4 border-brand-primary">
                                        <p className="text-xs font-black text-brand-depth">{altD.name}</p>
                                        <p className="text-[9px] font-black text-brand-primary uppercase">{meal} • Alternativ</p>
                                     </td>
                                     <td className="px-6 py-4">
                                        <input type="number" value={altN.starch || 0} onChange={(e) => handleManualNutrientChange(activeDay, meal, 'alternative', 'starch', e.target.value)} className="w-16 p-2 bg-white border border-brand-border rounded-lg text-xs font-black outline-none focus:border-brand-primary shadow-sm" />
                                     </td>
                                     <td className="px-6 py-4">
                                        <input type="number" value={altN.carbs || 0} onChange={(e) => handleManualNutrientChange(activeDay, meal, 'alternative', 'carbs', e.target.value)} className="w-16 p-2 bg-white border border-brand-border rounded-lg text-xs font-black outline-none focus:border-brand-primary shadow-sm" />
                                     </td>
                                     <td className="px-6 py-4">
                                        <input type="text" value={altN.vitamins || ''} onChange={(e) => handleManualNutrientChange(activeDay, meal, 'alternative', 'vitamins', e.target.value)} className="w-full min-w-[120px] p-2 bg-white border border-brand-border rounded-lg text-xs font-black outline-none focus:border-brand-primary shadow-sm" />
                                     </td>
                                  </tr>
                               )}
                            </React.Fragment>
                         );
                      })}
                   </tbody>
                </table>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NutritionistView;
