import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Package, 
  AlertTriangle, 
  Clock, 
  CheckCircle2, 
  List, 
  ChevronLeft, 
  ChevronRight, 
  TrendingUp, 
  TrendingDown, 
  LogOut 
} from 'lucide-react';
import { motion } from 'motion/react';
import { InventoryProduct, Transaction, Batch } from '../../types';
import { INITIAL_INVENTORY, INITIAL_TRANSACTIONS } from '../../constants/mockData';

const StorekeeperView: React.FC = () => {
  const [inventory, setInventory] = useState<InventoryProduct[]>(INITIAL_INVENTORY);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [viewMode, setViewMode] = useState<'DASHBOARD' | 'STOCK_IN' | 'STOCK_OUT' | 'ADJUST'>('DASHBOARD');
  
  // Calendar states
  const [currentMonth, setCurrentMonth] = useState(new Date(2024, 4, 1)); // May 2024 for mock
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);

  const stats = useMemo(() => {
    let totalItems = inventory.length;
    let lowStockCount = inventory.filter(p => p.batches.reduce((sum, b) => sum + b.quantity, 0) < p.minStock).length;
    let expiringSoonCount = inventory.filter(p => 
      p.batches.some(b => {
        const diff = new Date(b.expiryDate).getTime() - new Date().getTime();
        return diff > 0 && diff < (7 * 24 * 60 * 60 * 1000); // 7 days
      })
    ).length;
    let expiredCount = inventory.filter(p => 
      p.batches.some(b => new Date(b.expiryDate).getTime() < new Date().getTime())
    ).length;

    return { totalItems, lowStockCount, expiringSoonCount, expiredCount };
  }, [inventory]);

  const handleStockIn = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const productId = formData.get('product') as string;
    const quantity = parseFloat(formData.get('quantity') as string);
    const batchNumber = formData.get('batchNumber') as string;
    const expiryDate = formData.get('expiryDate') as string;
    const supplier = formData.get('supplier') as string;
    const storageLocation = formData.get('storageLocation') as string;
    const storageTemp = parseFloat(formData.get('storageTemp') as string);

    if (!productId || isNaN(quantity) || quantity <= 0) return;

    const product = inventory.find(p => p.id === productId);
    if (!product) return;

    const newBatch: Batch = {
      id: `b-${Date.now()}`,
      batchNumber,
      quantity,
      expiryDate,
      receivedDate: new Date().toISOString().split('T')[0],
      storageLocation,
      storageTemp,
      supplier
    };

    setInventory(prev => prev.map(p => 
      p.id === productId ? { ...p, batches: [...p.batches, newBatch] } : p
    ));

    setTransactions(prev => [
      {
        id: `t-${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        type: 'IN',
        productName: product.name,
        quantity,
        unit: product.unit
      },
      ...prev
    ]);

    setViewMode('DASHBOARD');
  };

  const handleStockOut = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const productId = formData.get('product') as string;
    let amountToTake = parseFloat(formData.get('quantity') as string);

    if (!productId || isNaN(amountToTake) || amountToTake <= 0) return;

    const product = inventory.find(p => p.id === productId);
    if (!product) return;

    const totalAvailable = product.batches.reduce((sum, b) => sum + b.quantity, 0);
    if (amountToTake > totalAvailable) {
       alert("Omborda yetarli mahsulot yo'q!");
       return;
    }

    const originalRequest = amountToTake;

    const sortedBatches = [...product.batches].sort((a, b) => 
      new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime()
    );

    const updatedBatches: Batch[] = [];
    for (const batch of sortedBatches) {
      if (amountToTake <= 0) {
        updatedBatches.push(batch);
        continue;
      }

      if (batch.quantity <= amountToTake) {
        amountToTake -= batch.quantity;
      } else {
        updatedBatches.push({
          ...batch,
          quantity: batch.quantity - amountToTake
        });
        amountToTake = 0;
      }
    }

    setInventory(prev => prev.map(p => 
      p.id === productId ? { ...p, batches: updatedBatches } : p
    ));

    setTransactions(prev => [
      {
        id: `t-${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        type: 'OUT',
        productName: product.name,
        quantity: originalRequest,
        unit: product.unit
      },
      ...prev
    ]);

    setViewMode('DASHBOARD');
  };

  const renderDashboard = () => (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-brand-depth tracking-tight">Ombor va Logistika</h2>
          <p className="text-brand-muted text-xs font-bold uppercase tracking-widest mt-1">Smart Inventory OS • FIFO Integration</p>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <button 
            onClick={() => setViewMode('STOCK_IN')} 
            className="flex-1 md:flex-none justify-center bg-brand-primary text-white px-8 py-3 rounded-2xl font-black shadow-lg shadow-brand-primary/20 flex items-center gap-2 hover:scale-105 transition-all text-sm uppercase tracking-wider"
          >
            <Plus size={18} /> Kirim
          </button>
          <button 
            onClick={() => setViewMode('STOCK_OUT')} 
            className="flex-1 md:flex-none justify-center bg-brand-depth text-white px-8 py-3 rounded-2xl font-black shadow-lg shadow-brand-depth/20 flex items-center gap-2 hover:scale-105 transition-all text-sm uppercase tracking-wider"
          >
            <LogOut size={18} className="rotate-180" /> Chiqim
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-brand-border shadow-sm">
          <div className="w-10 h-10 bg-blue-50 text-brand-primary rounded-2xl flex items-center justify-center mb-4"><Package size={20} /></div>
          <p className="text-brand-muted text-[10px] font-bold uppercase tracking-widest mb-1">Barcha mahsulotlar</p>
          <h3 className="text-2xl font-black text-brand-depth">{stats.totalItems} tur</h3>
        </div>
        <div className={`bg-white p-6 rounded-3xl border shadow-sm border-l-4 ${stats.lowStockCount > 0 ? 'border-l-brand-amber border-brand-amber/20' : 'border-brand-border'}`}>
          <div className="w-10 h-10 bg-amber-50 text-brand-amber rounded-2xl flex items-center justify-center mb-4"><AlertTriangle size={20} /></div>
          <p className="text-brand-muted text-[10px] font-bold uppercase tracking-widest mb-1">Kritik kamayish</p>
          <h3 className="text-2xl font-black text-brand-depth">{stats.lowStockCount} ta</h3>
        </div>
        <div className={`bg-white p-6 rounded-3xl border shadow-sm border-l-4 ${stats.expiringSoonCount > 0 ? 'border-l-rose-500 border-rose-500/20' : 'border-brand-border'}`}>
          <div className="w-10 h-10 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center mb-4"><Clock size={20} /></div>
          <p className="text-brand-muted text-[10px] font-bold uppercase tracking-widest mb-1">Muddati o'tayotgan</p>
          <h3 className="text-2xl font-black text-rose-500">{stats.expiringSoonCount} ta</h3>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-brand-border shadow-sm">
          <div className="w-10 h-10 bg-emerald-50 text-brand-emerald rounded-2xl flex items-center justify-center mb-4"><CheckCircle2 size={20} /></div>
          <p className="text-brand-muted text-[10px] font-bold uppercase tracking-widest mb-1">Tizim holati</p>
          <h3 className="text-2xl font-black text-brand-depth">OPTIMAL</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 bg-white rounded-[40px] border border-brand-border shadow-sm overflow-hidden flex flex-col">
          <div className="p-8 border-b border-brand-border flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-50/50">
            <h4 className="font-black text-brand-depth uppercase text-sm tracking-widest flex items-center gap-2">
              <List size={18} className="text-brand-primary" /> Inventarizatsiya
            </h4>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[700px]">
              <thead>
                <tr className="bg-slate-50/30 text-[10px] text-brand-muted uppercase font-black tracking-widest border-b border-brand-border">
                  <th className="px-8 py-5">Nomi / Turkumi</th>
                  <th className="px-8 py-5">Qoldiq</th>
                  <th className="px-8 py-5">Muddati</th>
                  <th className="px-8 py-5 text-right">Amallar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {inventory.map(product => {
                  const totalQty = product.batches.reduce((s, b) => s + b.quantity, 0);
                  const isLow = totalQty < product.minStock;
                  const nearestExpiryBatch = [...product.batches].sort((a,b) => new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime())[0];
                  const expiryStr = nearestExpiryBatch ? nearestExpiryBatch.expiryDate : '-';

                  return (
                    <tr key={product.id} className="group hover:bg-slate-50 transition-colors">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 bg-brand-ghost rounded-xl flex items-center justify-center text-brand-primary font-black text-[10px] uppercase">
                             {product.unit}
                           </div>
                           <div>
                              <p className="text-sm font-black text-brand-depth">{product.name}</p>
                              <p className="text-[10px] text-brand-muted font-bold uppercase tracking-tighter">{product.category}</p>
                           </div>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex flex-col">
                           <span className="text-sm font-black text-brand-depth">{totalQty} {product.unit}</span>
                           {isLow && <span className="text-[8px] text-brand-amber font-black uppercase mt-1 px-1.5 py-0.5 bg-brand-amber/10 rounded w-fit">Kritik</span>}
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <span className="text-xs font-bold text-brand-muted">{expiryStr}</span>
                      </td>
                      <td className="px-8 py-5 text-right">
                         <button className="text-brand-primary font-black text-[10px] uppercase hover:underline tracking-widest">Tafsilotlar</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="bg-brand-depth text-white p-8 rounded-[40px] shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
             <div className="relative z-10">
                <div className="flex items-center justify-between mb-8">
                   <h4 className="font-black uppercase tracking-widest text-xs">Harakatlar</h4>
                   <div className="flex gap-1">
                      <button onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)))} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"><ChevronLeft size={16} /></button>
                      <button onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)))} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"><ChevronRight size={16} /></button>
                   </div>
                </div>
                <p className="text-2xl font-black text-center mb-8 uppercase tracking-tighter">{currentMonth.toLocaleString('uz-UZ', { month: 'long', year: 'numeric' })}</p>
                <div className="grid grid-cols-7 gap-1">
                   {(() => {
                      const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
                      const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
                      const emptyDays = firstDay === 0 ? 6 : firstDay - 1;
                      return (
                         <>
                            {Array.from({ length: emptyDays }).map((_, i) => <div key={`empty-${i}`} />)}
                            {Array.from({ length: daysInMonth }).map((_, i) => {
                               const day = i + 1;
                               const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                               const hasAct = transactions.some(t => t.date === dateStr);
                               return (
                                  <button key={day} onClick={() => setSelectedDate(dateStr)} className={`aspect-square rounded-xl flex items-center justify-center text-[10px] font-black transition-all ${selectedDate === dateStr ? 'bg-brand-primary text-white shadow-lg scale-110 z-10' : 'hover:bg-white/5'} ${hasAct ? 'border border-brand-primary/30' : ''}`}>
                                     {day}
                                  </button>
                               );
                            })}
                         </>
                      );
                   })()}
                </div>
             </div>
          </div>

          <div className="bg-white p-8 rounded-[40px] border border-brand-border shadow-sm">
             <div className="flex justify-between items-center mb-6">
                <h5 className="font-black text-brand-depth uppercase text-[10px] tracking-widest flex items-center gap-2">
                  <Clock size={16} className="text-brand-primary" /> Log: {selectedDate}
                </h5>
             </div>
             <div className="space-y-4 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
               {transactions.filter(t => t.date === selectedDate).length > 0 ? (
                 transactions.filter(t => t.date === selectedDate).map(t => (
                   <div key={t.id} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100 group hover:border-brand-primary transition-all">
                      <div className="flex items-center gap-3">
                         <div className={`p-2 rounded-xl ${t.type === 'IN' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                           {t.type === 'IN' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                         </div>
                         <div>
                            <p className="text-xs font-black text-brand-depth">{t.productName}</p>
                            <p className="text-[9px] font-bold text-brand-muted uppercase">{t.type === 'IN' ? 'Kirim' : 'Chiqim'}</p>
                         </div>
                      </div>
                      <span className={`text-xs font-black ${t.type === 'IN' ? 'text-emerald-600' : 'text-amber-600'}`}>
                        {t.type === 'IN' ? '+' : '-'}{t.quantity}
                      </span>
                   </div>
                 ))
               ) : (
                 <div className="text-center py-10">
                   <p className="text-[10px] font-black text-brand-muted uppercase tracking-widest opacity-30">Harakat yo'q</p>
                 </div>
               )}
             </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-8">
      {viewMode === 'DASHBOARD' && renderDashboard()}
      {viewMode === 'STOCK_IN' && (
        <div className="fixed inset-0 bg-brand-depth/80 backdrop-blur-xl flex items-center justify-center z-[110] p-4 lg:p-12 animate-in fade-in duration-300">
           <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white w-full max-w-2xl rounded-[40px] p-10 shadow-2xl overflow-hidden overflow-y-auto max-h-full scrollbar-hidden">
             <div className="flex justify-between items-start mb-10">
               <div>
                  <h3 className="text-3xl font-black text-brand-depth tracking-tight">Kirim Operatsiyasi</h3>
                  <p className="text-xs text-brand-muted uppercase font-bold tracking-widest mt-1 italic">Yangi partiyani ro'yxatdan o'tkazing</p>
               </div>
               <button onClick={() => setViewMode('DASHBOARD')} className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center shadow-lg hover:bg-rose-50 hover:text-rose-500 transition-all text-2xl font-black">&times;</button>
             </div>
             <form onSubmit={handleStockIn} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-brand-muted uppercase tracking-widest ml-1">Mahsulot *</label>
                    <select name="product" className="w-full bg-slate-50 border-2 border-transparent focus:border-brand-primary rounded-2xl p-4 font-black outline-none transition-all cursor-pointer">
                       {inventory.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-brand-muted uppercase tracking-widest ml-1">Miqdor *</label>
                    <input name="quantity" type="number" step="0.01" className="w-full bg-slate-50 border-2 border-transparent focus:border-brand-primary rounded-2xl p-4 font-black outline-none transition-all" placeholder="0.00" required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-brand-muted uppercase tracking-widest ml-1">Partiya Raqami *</label>
                    <input name="batchNumber" type="text" className="w-full bg-slate-50 border-2 border-transparent focus:border-brand-primary rounded-2xl p-4 font-black outline-none transition-all" placeholder="Masalan: B-2024/01" required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-brand-muted uppercase tracking-widest ml-1">Muddati *</label>
                    <input name="expiryDate" type="date" className="w-full bg-slate-50 border-2 border-transparent focus:border-brand-primary rounded-2xl p-4 font-black outline-none transition-all" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-brand-muted uppercase tracking-widest ml-1">Yetkazib beruvchi</label>
                  <input name="supplier" type="text" className="w-full bg-slate-50 border-2 border-transparent focus:border-brand-primary rounded-2xl p-4 font-black outline-none transition-all" placeholder="Kompaniya nomi" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-brand-muted uppercase tracking-widest ml-1">Saqlash joyi</label>
                    <input name="storageLocation" type="text" className="w-full bg-slate-50 border-2 border-transparent focus:border-brand-primary rounded-2xl p-4 font-black outline-none transition-all" placeholder="A-tokcha / Muzlatgich" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-brand-muted uppercase tracking-widest ml-1">Harorat (°C)</label>
                    <input name="storageTemp" type="number" className="w-full bg-slate-50 border-2 border-transparent focus:border-brand-primary rounded-2xl p-4 font-black outline-none transition-all" placeholder="+4" />
                  </div>
                </div>
                <button type="submit" className="w-full py-5 bg-brand-primary text-white rounded-3xl font-black shadow-xl shadow-brand-primary/30 hover:bg-brand-primary/95 transition-all text-xs uppercase tracking-widest">Kirimni tasdiqlash</button>
             </form>
           </motion.div>
        </div>
      )}
      {viewMode === 'STOCK_OUT' && (
        <div className="fixed inset-0 bg-brand-depth/80 backdrop-blur-xl flex items-center justify-center z-[110] p-4 lg:p-12 animate-in fade-in duration-300">
           <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white w-full max-w-xl rounded-[40px] p-10 shadow-2xl">
              <div className="flex justify-between items-start mb-10">
                 <div>
                    <h3 className="text-3xl font-black text-brand-depth tracking-tight">Chiqim Operatsiyasi</h3>
                    <p className="text-xs text-brand-muted uppercase font-bold tracking-widest mt-1 italic italic text-amber-600">FIFO tizimi bo'yicha chegiriladi</p>
                 </div>
                 <button onClick={() => setViewMode('DASHBOARD')} className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center shadow-lg hover:bg-rose-50 hover:text-rose-500 transition-all text-2xl font-black">&times;</button>
              </div>
              <form onSubmit={handleStockOut} className="space-y-8">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-brand-muted uppercase tracking-widest ml-1">Mahsulotni tanlang *</label>
                    <select name="product" className="w-full bg-slate-50 border-2 border-transparent focus:border-brand-primary rounded-2xl p-4 font-black outline-none transition-all cursor-pointer">
                       {inventory.map(p => (
                         <option key={p.id} value={p.id}>{p.name} ({p.batches.reduce((s, b) => s + b.quantity, 0)} {p.unit} mavjud)</option>
                       ))}
                    </select>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-brand-muted uppercase tracking-widest ml-1">Chiqariladigan miqdor *</label>
                    <input name="quantity" type="number" step="0.01" className="w-full bg-slate-50 border-2 border-transparent focus:border-brand-primary rounded-2xl p-4 font-black outline-none transition-all" placeholder="0.00" required />
                 </div>
                 <div className="bg-amber-50 rounded-2xl p-4 border border-brand-amber/20">
                    <p className="text-[10px] text-brand-amber font-bold leading-relaxed flex items-start gap-2">
                       <AlertTriangle size={14} className="shrink-0" />
                       Tizim avtomatik ravishda muddati eng yaqin bo'lgan partiyalardan miqdorni chegiradi. Ushbu amal ortga qaytarilmaydi.
                    </p>
                 </div>
                 <div className="flex gap-4">
                    <button onClick={() => setViewMode('DASHBOARD')} type="button" className="flex-1 py-4 border-2 border-slate-100 rounded-3xl font-black text-brand-muted uppercase text-[10px] tracking-widest">Bekor qilish</button>
                    <button type="submit" className="flex-[2] py-4 bg-brand-depth text-white rounded-3xl font-black shadow-xl shadow-brand-depth/30 uppercase text-[10px] tracking-widest">Chiqimni tasdiqlash</button>
                 </div>
              </form>
           </motion.div>
        </div>
      )}
    </div>
  );
};

export default StorekeeperView;
