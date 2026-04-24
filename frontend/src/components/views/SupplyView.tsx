import React, { useState } from 'react';
import { 
  Truck, 
  ShoppingBag, 
  Users2, 
  CalendarDays, 
  AlertCircle, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  FileText,
  Plus,
  Search,
  ChevronRight,
  Filter,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type SupplyTab = 'REQUIRED' | 'ORDERS' | 'SUPPLIERS' | 'PLAN' | 'DELAYED';

const SupplyView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<SupplyTab>('REQUIRED');

  const tabs = [
    { id: 'REQUIRED', label: 'Kerakli mahsulotlar', icon: ShoppingBag, color: 'brand-primary' },
    { id: 'ORDERS', label: 'Buyurtmalar', icon: FileText, color: 'blue-500' },
    { id: 'SUPPLIERS', label: 'Yetkazib beruvchilar', icon: Users2, color: 'emerald-500' },
    { id: 'PLAN', label: 'Xarid rejasi', icon: CalendarDays, color: 'violet-500' },
    { id: 'DELAYED', label: 'Kechikayotganlar', icon: AlertCircle, color: 'rose-500' },
  ];

  return (
    <div className="p-8 space-y-10 animate-in fade-in duration-700">
      {/* KPI Cards section */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Oylik Xarid', value: '45.2 mln', sub: 'so‘m', trend: '+12%', icon: TrendingUp, color: 'brand-primary' },
          { label: 'Aktiv Buyurtmalar', value: '18', sub: 'ta', trend: 'Bekor bo\'lmadi', icon: ShoppingBag, color: 'blue-500' },
          { label: 'Kechikishlar', value: '3', sub: 'ta mahsulot', trend: '-2 bugun', icon: Clock, color: 'rose-500' },
          { label: 'Yetkazib beruvchilar', value: '12', sub: 'ta hamkor', trend: 'Barchasi faol', icon: Users2, color: 'emerald-500' },
        ].map((kpi, idx) => (
          <div key={idx} className="bg-white p-6 rounded-[2rem] border border-brand-border shadow-sm flex items-center gap-6 group hover:shadow-xl hover:-translate-y-1 transition-all duration-500">
            <div className={`w-14 h-14 rounded-2xl bg-${kpi.color}/10 flex items-center justify-center text-${kpi.color} group-hover:bg-${kpi.color} group-hover:text-white transition-colors`}>
              <kpi.icon size={24} />
            </div>
            <div>
               <p className="text-[10px] font-black text-brand-muted uppercase tracking-widest leading-none mb-1">{kpi.label}</p>
               <div className="flex items-baseline gap-1">
                 <span className="text-2xl font-black text-brand-depth leading-none">{kpi.value}</span>
                 <span className="text-[10px] font-bold text-brand-muted uppercase">{kpi.sub}</span>
               </div>
               <p className={`text-[10px] font-bold mt-1 ${kpi.trend.includes('+') ? 'text-emerald-500' : kpi.trend.includes('-') ? 'text-rose-500' : 'text-brand-primary'}`}>{kpi.trend}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Internal Navigation */}
      <div className="bg-white p-2 rounded-[1.5rem] border border-brand-border shadow-sm flex flex-wrap gap-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as SupplyTab)}
            className={`flex items-center gap-3 px-6 py-3.5 rounded-xl transition-all font-black text-xs uppercase tracking-widest ${
              activeTab === tab.id 
                ? `bg-brand-primary text-white shadow-lg shadow-brand-primary/20` 
                : 'text-brand-muted hover:bg-slate-50 hover:text-brand-depth'
            }`}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Rendering */}
      <AnimatePresence mode="wait">
        <motion.div
           key={activeTab}
           initial={{ opacity: 0, y: 10 }}
           animate={{ opacity: 1, y: 0 }}
           exit={{ opacity: 0, y: -10 }}
           transition={{ duration: 0.3 }}
        >
          {activeTab === 'REQUIRED' && <RequiredProductsSection />}
          {activeTab === 'ORDERS' && <OrdersSection />}
          {activeTab === 'SUPPLIERS' && <SuppliersSection />}
          {activeTab === 'PLAN' && <PlanSection />}
          {activeTab === 'DELAYED' && <DelayedSection />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

// --- Internal Page Sections ---

const RequiredProductsSection = () => (
  <div className="space-y-6">
    <div className="flex justify-between items-center bg-white p-8 rounded-[2rem] border border-brand-border">
      <div>
        <h3 className="text-2xl font-black text-brand-depth">Kerakli mahsulotlar ro'yxati</h3>
        <p className="text-brand-muted text-[10px] font-bold uppercase tracking-widest mt-1">Oshxona va Ombor so'rovlari asosida</p>
      </div>
      <div className="flex gap-3">
        <button className="px-6 py-3 bg-slate-50 border border-brand-border rounded-xl font-bold text-xs flex items-center gap-2 hover:bg-slate-100 transition-colors">
          <Filter size={16} /> Saralash
        </button>
        <button className="px-6 py-3 bg-brand-primary text-white rounded-xl font-black text-xs flex items-center gap-2 shadow-lg shadow-brand-primary/20 hover:scale-105 transition-all">
          <Plus size={16} /> Buyurtma ochish
        </button>
      </div>
    </div>

    <div className="grid grid-cols-1 gap-4">
      {[
        { name: 'Sut (3.2%)', amount: '120 L', dept: 'Oshxona', urgency: 'CRITICAL', deadline: '2 soat ichida' },
        { name: 'Go\'sht (Mol)', amount: '45 kg', dept: 'Oshxona', urgency: 'HIGH', deadline: '1 kun' },
        { name: 'Yuvish vositalari', amount: '10 quti', dept: 'Tozalik', urgency: 'MEDIUM', deadline: '3 kun' },
        { name: 'Qog\'oz salfetkalar', amount: '500 dona', dept: 'Ombor', urgency: 'LOW', deadline: '5 kun' },
      ].map((item, idx) => (
        <div key={idx} className="bg-white border border-brand-border p-6 rounded-[1.5rem] flex items-center justify-between hover:border-brand-primary transition-colors group">
          <div className="flex items-center gap-6">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              item.urgency === 'CRITICAL' ? 'bg-rose-50 text-rose-500 border-rose-100' : 'bg-slate-50 text-brand-slate'
            } border`}>
              <ShoppingBag size={20} />
            </div>
            <div>
              <h4 className="font-black text-brand-depth text-lg">{item.name}</h4>
              <div className="flex items-center gap-3 mt-1">
                 <span className="text-[10px] font-black uppercase text-brand-muted tracking-widest">{item.dept} so'rovi</span>
                 <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                 <span className="text-[10px] font-black uppercase text-brand-primary">{item.amount}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-10">
            <div className="text-right">
              <p className="text-[10px] font-black uppercase text-brand-muted tracking-widest mb-1">Muddati</p>
              <p className={`text-xs font-bold ${item.urgency === 'CRITICAL' ? 'text-rose-600' : 'text-brand-depth'}`}>{item.deadline}</p>
            </div>
            <div className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest border ${
              item.urgency === 'CRITICAL' ? 'bg-rose-50 text-rose-600 border-rose-200' :
              item.urgency === 'HIGH' ? 'bg-orange-50 text-orange-600 border-orange-200' :
              'bg-slate-50 text-slate-600 border-slate-200'
            }`}>
              {item.urgency}
            </div>
            <button className="w-10 h-10 bg-slate-50 text-brand-muted rounded-full flex items-center justify-center group-hover:bg-brand-primary group-hover:text-white transition-all">
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const OrdersSection = () => (
  <div className="bg-white rounded-[2rem] border border-brand-border overflow-hidden shadow-sm">
    <div className="p-8 border-b border-brand-border bg-slate-50/30 flex justify-between items-center">
      <div>
        <h3 className="text-xl font-black text-brand-depth">Faol Buyurtmalar</h3>
        <p className="text-[10px] font-bold text-brand-muted uppercase tracking-widest mt-1">Yetkazib berish jarayonidagilar</p>
      </div>
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted" size={16} />
        <input 
          type="text" 
          placeholder="Buyurtma ID si..."
          className="bg-white border border-brand-border rounded-xl py-3 pl-12 pr-6 text-xs font-bold outline-none focus:ring-2 ring-brand-primary/20 w-64"
        />
      </div>
    </div>
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="bg-slate-50/50 border-b border-brand-border text-[10px] font-black uppercase text-brand-muted tracking-widest">
            <th className="px-8 py-5">Buyurtma ID</th>
            <th className="px-8 py-5">Yetkazib beruvchi</th>
            <th className="px-8 py-5">Summa</th>
            <th className="px-8 py-5">Sana</th>
            <th className="px-8 py-5">Holati</th>
            <th className="px-8 py-5 text-right">Amallar</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {[
            { id: '#PO-4592', vendor: 'AgroFresh LLC', amount: '4,200,000', date: '18.04.2024', status: 'SHIPPED' },
            { id: '#PO-4588', vendor: 'Sutchi Biznes', amount: '1,850,000', date: '17.04.2024', status: 'PENDING' },
            { id: '#PO-4581', vendor: 'HygieTools', amount: '950,000', date: '15.04.2024', status: 'DELIVERED' },
          ].map((order, idx) => (
            <tr key={idx} className="hover:bg-brand-primary/[0.02] transition-colors group">
              <td className="px-8 py-6 font-black text-brand-primary text-xs">{order.id}</td>
              <td className="px-8 py-6">
                <span className="text-sm font-bold text-brand-depth">{order.vendor}</span>
              </td>
              <td className="px-8 py-6">
                <span className="text-sm font-black text-brand-depth">{order.amount} <span className="text-[10px] text-brand-muted">so'm</span></span>
              </td>
              <td className="px-8 py-6">
                <span className="text-xs font-bold text-brand-slate">{order.date}</span>
              </td>
              <td className="px-8 py-6">
                <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase ${
                  order.status === 'SHIPPED' ? 'bg-blue-50 text-blue-600 border border-blue-100' :
                  order.status === 'PENDING' ? 'bg-orange-50 text-orange-600 border border-orange-100' :
                  'bg-emerald-50 text-emerald-600 border border-emerald-100'
                }`}>
                  {order.status === 'SHIPPED' ? 'Yo\'lda' : order.status === 'PENDING' ? 'Kutilmoqda' : 'Qabul qilindi'}
                </span>
              </td>
              <td className="px-8 py-6 text-right">
                <button className="p-2 bg-slate-50 text-brand-muted rounded-lg hover:text-brand-primary hover:bg-brand-primary/10 transition-all border border-brand-border">
                  <ChevronRight size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const SuppliersSection = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {[
       { name: 'AgroFresh LLC', type: 'Meva va Sabzavotlar', score: '4.8', activeOrders: 3, contact: 'Jamshid A.' },
       { name: 'Sutchi Biznes', type: 'Sut mahsulotlari', score: '4.9', activeOrders: 1, contact: 'Elena K.' },
       { name: 'Go\'sht Dunyosi', type: 'Go\'sht va Parranda', score: '4.5', activeOrders: 0, contact: 'Bekzod T.' },
       { name: 'CleanSolutions', type: 'Xo\'jalik mollari', score: '4.2', activeOrders: 2, contact: 'Sardor L.' },
    ].map((vendor, idx) => (
      <div key={idx} className="bg-white p-8 rounded-[2rem] border border-brand-border shadow-sm group hover:shadow-xl transition-all duration-500">
        <div className="flex justify-between items-start mb-6">
          <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-brand-primary border border-brand-border group-hover:bg-brand-primary group-hover:text-white transition-all">
            <Users2 size={24} />
          </div>
          <div className="flex items-center gap-1 bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-[10px] font-black shadow-inner">
            <CheckCircle2 size={12} /> {vendor.score}
          </div>
        </div>
        <h4 className="text-xl font-black text-brand-depth mb-1">{vendor.name}</h4>
        <p className="text-brand-muted text-[10px] font-bold uppercase tracking-widest mb-6">{vendor.type}</p>
        
        <div className="space-y-4 pt-6 border-t border-slate-50">
           <div className="flex justify-between items-center">
              <span className="text-[10px] font-black text-brand-muted uppercase tracking-widest">Mas'ul shaxs</span>
              <span className="text-xs font-bold text-brand-depth">{vendor.contact}</span>
           </div>
           <div className="flex justify-between items-center">
              <span className="text-[10px] font-black text-brand-muted uppercase tracking-widest">Aktiv buyurtmalar</span>
              <span className="px-2 py-0.5 bg-brand-primary-light text-brand-primary rounded text-[10px] font-black">{vendor.activeOrders} ta</span>
           </div>
        </div>

        <button className="w-full mt-8 py-4 bg-slate-50 border border-brand-border rounded-xl font-black text-[10px] uppercase tracking-widest text-brand-muted group-hover:bg-brand-primary group-hover:text-white group-hover:border-brand-primary transition-all">
          Aloqaga chiqish
        </button>
      </div>
    ))}
  </div>
);

const PlanSection = () => (
  <div className="bg-white rounded-[2rem] border border-brand-border p-10 shadow-sm flex flex-col items-center justify-center text-center space-y-6 min-h-[400px]">
    <div className="w-20 h-20 bg-violet-50 text-violet-500 rounded-3xl flex items-center justify-center mb-4">
      <CalendarDays size={40} />
    </div>
    <div>
      <h3 className="text-2xl font-black text-brand-depth">Aprel oyi xarid rejasi</h3>
      <p className="text-brand-muted text-sm max-w-md mx-auto mt-2 leading-relaxed">
        Kelgusi hafta uchun oziq-ovqat va tozalik vositalari xaridi avtomatik tarzda shakllantirildi. 
        Rejani oshpaz va dietolog bilan tasdiqlashingiz lozim.
      </p>
    </div>
    <div className="flex gap-4">
       <button className="px-8 py-4 bg-slate-50 border border-brand-border rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-100 transition-colors">Rejani yuklash</button>
       <button className="px-8 py-4 bg-violet-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-violet-500/20 hover:scale-105 transition-all">Tasdiqlash</button>
    </div>
  </div>
);

const DelayedSection = () => (
  <div className="space-y-6">
    <div className="bg-rose-50 border border-rose-100 p-8 rounded-[2rem] flex items-center gap-6">
       <div className="w-16 h-16 bg-white text-rose-500 rounded-2xl flex items-center justify-center shadow-lg shadow-rose-500/10">
          <AlertCircle size={32} />
       </div>
       <div>
          <h3 className="text-xl font-black text-rose-800">Kechikayotgan Ta'minot</h3>
          <p className="text-rose-700/60 text-sm font-medium">Ushbu mahsulotlar belgilangan vaqtdan o'tib ketgan, zudlik bilan qo'ng'iroq qiling!</p>
       </div>
    </div>

    <div className="grid grid-cols-1 gap-4">
       {[
         { id: '#PO-4588', name: 'Meva to\'plami', vendor: 'AgroFresh LLC', delay: '4 soat', action: 'Call Jamshid' },
         { id: '#PO-4589', name: 'Non va yopgan non', vendor: 'City Bakery', delay: '1.5 soat', action: 'Call Driver' },
       ].map((item, idx) => (
         <div key={idx} className="bg-white border border-brand-border p-8 rounded-[1.5rem] flex items-center justify-between group">
            <div className="flex items-center gap-6">
               <div className="flex flex-col">
                  <span className="text-[10px] font-black text-brand-muted uppercase tracking-widest">{item.id}</span>
                  <span className="text-lg font-black text-brand-depth">{item.name}</span>
               </div>
               <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
               <div className="flex flex-col">
                  <span className="text-[10px] font-black text-brand-muted uppercase tracking-widest">Yetkazuvchi</span>
                  <span className="text-xs font-bold text-brand-slate">{item.vendor}</span>
               </div>
            </div>
            <div className="flex items-center gap-10">
               <div className="text-right">
                  <span className="block text-[10px] font-black text-rose-500 uppercase tracking-widest mb-1">Kechikish vaqti</span>
                  <span className="text-lg font-black text-rose-600">-{item.delay}</span>
               </div>
               <button className="px-6 py-3 bg-rose-500 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-rose-500/20 active:scale-95 transition-all">
                  {item.action}
               </button>
            </div>
         </div>
       ))}
    </div>
  </div>
);

export default SupplyView;
