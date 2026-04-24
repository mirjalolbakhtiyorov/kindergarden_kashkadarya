import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  User, 
  Key, 
  Eye, 
  EyeOff, 
  Save, 
  Smartphone,
  ChevronRight,
  Fingerprint,
  Bell,
  Settings,
  LogOut,
  Camera,
  CheckCircle2,
  AlertCircle,
  Apple,
  MessageSquare,
  Activity,
  MapPin,
  Briefcase,
  Wallet,
  Calendar,
  FileText,
  UserCheck,
  Star,
  Syringe,
  Download,
  Clock,
  Heart,
  Baby,
  ShieldAlert,
  ClipboardList,
  CreditCard,
  Target,
  Users,
  Zap,
  Flame,
  Droplets,
  Award,
  Contact,
  Send,
  ArrowUpRight,
  BookOpen,
  Coffee,
  Receipt,
  Trash2,
  FileSearch,
  Paperclip,
  Smile,
  MoreVertical,
  Check,
  CheckCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';

type SettingsTab = 'profile' | 'security' | 'menu' | 'medical' | 'messages' | 'finance' | 'attendance' | 'documents' | 'pickup' | 'progress' | 'vaccines';

// --- RICH MOCK DATA FOR PREMIUM FEEL ---
const MOCK_PARENT_DATA = {
  id: "test-child-id",
  childName: "Mustafo Bozorov",
  childBirthCertificate: "GC-7788990-UZ",
  address: "Toshkent shahar, Chilonzor tumani, 5-mavze, 12-uy, 45-xonadon",
  childGroup: "3-guruh 'Bilimdonlar'",
  fatherName: "Bozorov Iskandar",
  fatherPhone: "+998 90 123 45 67",
  fatherWorkplace: "IT Park Academy (Senior Developer)",
  fatherPassport: "AA 1234567",
  motherName: "Bozorova Nigora",
  motherPhone: "+998 93 777 88 99",
  motherWorkplace: "Toshkent Tibbiyot Akademiyasi (Shifokor)",
  motherPassport: "AB 7654321",
  height: 118,
  weight: 19.5,
  allergies: "Asal, yong'oq va qulupnay",
  medical_notes: "Bolada jiddiy tibbiy cheklovlar yo'q. Oylik profilaktik ko'riklardan o'tgan. Vitamin D qabul qiladi."
};

const MOCK_FULL_DATA = {
  payments: [
    { id: "PAY-9921", date: "2026-04-05", amount: 500000, status: "PAID" },
    { id: "PAY-8812", date: "2026-03-05", amount: 450000, status: "PAID" },
    { id: "PAY-7734", date: "2026-02-05", amount: 450000, status: "PAID" },
    { id: "PAY-6655", date: "2026-01-05", amount: 450000, status: "PAID" }
  ],
  attendance: [
    { id: "tomorrow", date: "2026-04-25", status: "PLANNED", isAttending: true, reason: null },
    { id: "1", date: "2026-04-24", status: "PRESENT", reason: null },
    { id: "2", date: "2026-04-23", status: "PRESENT", reason: null },
    { id: "3", date: "2026-04-22", status: "ABSENT_SICK", reason: "Shamollash alomatlari (Yengil)" },
    { id: "4", date: "2026-04-21", status: "PRESENT", reason: null },
    { id: "5", date: "2026-04-20", status: "PRESENT", reason: null },
    { id: "6", date: "2026-04-17", status: "PRESENT", reason: null },
    { id: "7", date: "2026-04-16", status: "PRESENT", reason: null }
  ],
  progressReports: [
    { id: "r1", date: "2026-04-22", subject: "Rasm chizish", rating: 5, comment: "Mustafo bugun 'Mening Oilam' mavzusida juda chiroyli rasm chizdi. Ranglar uyg'unligi va kompozitsiya a'lo darajada." },
    { id: "r2", date: "2026-04-20", subject: "Ingliz tili", rating: 4, comment: "Yangi so'zlarni (hayvonlar nomlari) oson o'zlashtirdi. Talaffuz ustida biroz ishlashimiz kerak." },
    { id: "r3", date: "2026-04-18", subject: "Mantiqiy fikrlash", rating: 5, comment: "Matematik boshqotirmalarni guruhda birinchi bo'lib yechdi. Diqqati juda yuqori." }
  ],
  vaccinations: [
    { id: "v1", vaccine_name: "VGB (Gepatit B)", planned_date: "2025-10-10", taken_date: "2025-10-12", status: "TAKEN" },
    { id: "v2", vaccine_name: "OPV (Polio)", planned_date: "2026-05-20", taken_date: null, status: "PLANNED" },
    { id: "v3", vaccine_name: "AKDS", planned_date: "2026-02-15", taken_date: "2026-02-15", status: "TAKEN" }
  ],
  documents: [
    { id: "d1", title: "Tug'ilganlik haqida guvohnoma", created_at: "2026-01-10" },
    { id: "d2", title: "Tibbiy karta (086)", created_at: "2026-01-12" },
    { id: "d3", title: "Vaksinatsiya pasporti", created_at: "2026-01-15" }
  ],
  authorizedPickups: [
    { id: "p1", full_name: "Bozorov Ahmad", relation: "Bobosi", phone: "+998 90 999 00 11", photo_url: null },
    { id: "p2", full_name: "Bozorova Ra'no", relation: "Buvisi", phone: "+998 90 888 11 22", photo_url: null }
  ]
};

const ParentView = () => {
  const { user, logout } = useAuth();
  const { showNotification } = useNotification();
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const [isSaving, setIsSaving] = useState(false);
  
  // Using MOCK DATA by default
  const [parentData] = useState<any>(MOCK_PARENT_DATA);
  const [fullPortalData] = useState<any>(MOCK_FULL_DATA);
  const [loading] = useState(false);

  const [credentials, setCredentials] = useState({
    login: user?.login || 'mustafo_2026',
    newPassword: '',
    confirmPassword: ''
  });

  const [activeChat, setActiveChat] = useState<'admin' | 'teacher'>('teacher');
  const [chatMessage, setChatMessage] = useState('');
  const [messages, setMessages] = useState<any>({
    teacher: [
      { id: 1, type: 'received', text: 'Assalomu alaykum, Iskandar aka. Mustafoning bugungi mashg\'ulotlardagi ishtiroki juda yaxshi bo\'ldi.', time: '10:30', status: 'read' },
      { id: 2, type: 'sent', text: 'Vaalaykum assalom, ustoz. Rahmat, xursandmiz. Bugun ingliz tilidan yangi so\'zlarni yodladimi?', time: '11:15', status: 'read' },
      { id: 3, type: 'received', text: 'Ha, mevalar mavzusini to\'liq o\'zlashtirdi. Hozirda rasm chizish darsida qatnashmoqda.', time: '11:20', status: 'read' }
    ],
    admin: [
      { id: 1, type: 'received', text: 'Hurmatli ota-onalar, 1-may kuni bog\'chamizda "Bahor bayrami" tadbiri bo\'lib o\'tadi.', time: '09:00', status: 'read' },
      { id: 2, type: 'sent', text: 'Tushunarli, rahmat. Tadbir soat nechada boshlanadi?', time: '09:45', status: 'read' }
    ]
  });

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chatMessage.trim()) return;

    const newMessage = {
      id: Date.now(),
      type: 'sent',
      text: chatMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent'
    };

    setMessages((prev: any) => ({
      ...prev,
      [activeChat]: [...prev[activeChat], newMessage]
    }));
    
    setChatMessage('');
    showNotification('Xabar yuborildi', 'success');
  };

  const handleUpdateCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      showNotification('Ma’lumotlar muvaffaqiyatli yangilandi!', 'success');
      setIsSaving(false);
    }, 1000);
  };

  const navItems: { id: SettingsTab; label: string; icon: any; color: string }[] = [
    { id: 'profile', label: 'Shaxsiy ma\'lumotlar', icon: User, color: 'brand-primary' },
    { id: 'security', label: 'Parol va Xavfsizlik', icon: ShieldCheck, color: 'blue-500' },
    { id: 'finance', label: 'To\'lov va Balans', icon: Wallet, color: 'emerald-500' },
    { id: 'attendance', label: 'Davomat tarixi', icon: Calendar, color: 'indigo-500' },
    { id: 'progress', label: 'Yutuq va O\'zlashtirish', icon: Star, color: 'amber-400' },
    { id: 'medical', label: 'Tibbiy holat', icon: Activity, color: 'rose-500' },
    { id: 'vaccines', label: 'Emlash jadvali', icon: Syringe, color: 'sky-500' },
    { id: 'menu', label: 'Kunlik ovqatlanish', icon: Apple, color: 'orange-500' },
    { id: 'documents', label: 'Hujjatlar arxivi', icon: FileText, color: 'slate-500' },
    { id: 'pickup', label: 'Ishonchli vakillar', icon: UserCheck, color: 'teal-500' },
    { id: 'messages', label: 'Ma\'muriyatga xabar', icon: MessageSquare, color: 'brand-primary' },
  ];

  const renderTabContent = () => {
    const data = fullPortalData;

    switch (activeTab) {
      case 'profile':
        return (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
               <div className="space-y-8">
                  <h4 className="flex items-center gap-3 text-sm font-black text-brand-depth uppercase tracking-[0.3em] px-2">
                     <Baby size={20} className="text-brand-primary" /> Bolaning Shaxsiy Ma'lumotlari
                  </h4>
                  <div className="grid grid-cols-1 gap-5">
                     <div className="bg-white p-7 rounded-[2.5rem] border border-brand-border shadow-sm hover:shadow-xl transition-all group overflow-hidden relative">
                        <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity"><User size={60} /></div>
                        <p className="text-[10px] font-black text-brand-muted uppercase tracking-widest mb-1">To'liq ismi va familiyasi</p>
                        <p className="text-base font-black text-brand-depth relative z-10">{parentData.childName}</p>
                     </div>
                     <div className="bg-white p-7 rounded-[2.5rem] border border-brand-border shadow-sm hover:shadow-xl transition-all group overflow-hidden relative">
                        <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity"><Target size={60} /></div>
                        <p className="text-[10px] font-black text-brand-muted uppercase tracking-widest mb-1">Tug'ilganlik guvohnomasi</p>
                        <p className="text-base font-black text-brand-depth relative z-10">{parentData.childBirthCertificate}</p>
                     </div>
                     <div className="bg-white p-7 rounded-[2.5rem] border border-brand-border shadow-sm hover:shadow-xl transition-all group overflow-hidden relative">
                        <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity"><MapPin size={60} /></div>
                        <p className="text-[10px] font-black text-brand-muted uppercase tracking-widest mb-1">Doimiy yashash manzili</p>
                        <p className="text-base font-black text-brand-depth relative z-10">{parentData.address}</p>
                     </div>
                     <div className="bg-brand-primary p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group">
                        <div className="absolute -right-4 -bottom-4 opacity-20 group-hover:scale-110 transition-transform duration-700"><Target size={100} /></div>
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60 mb-2">Hozirgi Guruhi</p>
                        <p className="text-3xl font-black tracking-tight">{parentData.childGroup}</p>
                     </div>
                  </div>
               </div>

               <div className="space-y-8">
                  <h4 className="flex items-center gap-3 text-sm font-black text-brand-depth uppercase tracking-[0.3em] px-2">
                     <Users size={20} className="text-brand-primary" /> Ota-ona Ma'lumotlari
                  </h4>
                  <div className="space-y-6">
                     <div className="bg-white p-8 rounded-[3rem] border border-brand-border shadow-sm space-y-6 relative overflow-hidden group hover:shadow-2xl transition-all">
                        <div className="absolute top-0 left-0 w-2 h-full bg-brand-primary"></div>
                        <p className="text-[10px] font-black text-brand-primary uppercase tracking-[0.2em]">Otasining ma'lumotlari</p>
                        <h5 className="text-2xl font-black text-brand-depth tracking-tight">{parentData.fatherName}</h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100 flex items-center gap-3">
                              <Briefcase size={16} className="text-brand-muted" />
                              <div><p className="text-[8px] font-black text-brand-muted uppercase">Ishlash joyi</p><p className="text-xs font-bold text-brand-depth">{parentData.fatherWorkplace}</p></div>
                           </div>
                           <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100 flex items-center gap-3">
                              <Smartphone size={16} className="text-brand-muted" />
                              <div><p className="text-[8px] font-black text-brand-muted uppercase">Telefon</p><p className="text-xs font-bold text-brand-depth">{parentData.fatherPhone}</p></div>
                           </div>
                        </div>
                     </div>
                     <div className="bg-white p-8 rounded-[3rem] border border-brand-border shadow-sm space-y-6 relative overflow-hidden group hover:shadow-2xl transition-all">
                        <div className="absolute top-0 left-0 w-2 h-full bg-rose-500"></div>
                        <p className="text-[10px] font-black text-rose-500 uppercase tracking-[0.2em]">Onasining ma'lumotlari</p>
                        <h5 className="text-2xl font-black text-brand-depth tracking-tight">{parentData.motherName}</h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100 flex items-center gap-3">
                              <Briefcase size={16} className="text-brand-muted" />
                              <div><p className="text-[8px] font-black text-brand-muted uppercase">Ishlash joyi</p><p className="text-xs font-bold text-brand-depth">{parentData.motherWorkplace}</p></div>
                           </div>
                           <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100 flex items-center gap-3">
                              <Smartphone size={16} className="text-brand-muted" />
                              <div><p className="text-[8px] font-black text-brand-muted uppercase">Telefon</p><p className="text-xs font-bold text-brand-depth">{parentData.motherPhone}</p></div>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
          </motion.div>
        );

      case 'finance':
        return (
          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-10">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
               <div className="lg:col-span-2 bg-brand-depth p-12 rounded-[4rem] text-white shadow-2xl relative overflow-hidden group border border-white/10">
                  <div className="absolute top-0 right-0 w-80 h-80 bg-brand-primary/20 rounded-full blur-[100px] -mr-32 -mt-32"></div>
                  <div className="relative z-10 flex flex-col h-full justify-between gap-12">
                     <div className="flex justify-between items-start">
                        <div className="space-y-2">
                           <p className="text-[11px] font-black text-white/40 uppercase tracking-[0.4em]">Hisob holati (Balans)</p>
                           <h4 className="text-6xl font-black tracking-tighter">0.00 <span className="text-xl opacity-40 uppercase ml-2">UZS</span></h4>
                        </div>
                        <div className="w-20 h-20 rounded-[2.5rem] flex items-center justify-center backdrop-blur-xl border-2 bg-emerald-500/20 border-emerald-500/30 text-emerald-400"><CheckCircle2 size={36} /></div>
                     </div>
                     <div className="grid grid-cols-2 md:grid-cols-3 gap-8 pt-8 border-t border-white/5">
                        <div><p className="text-[9px] font-black text-white/30 uppercase tracking-widest mb-1">Umumiy to'lovlar</p><p className="text-xl font-black">1,850,000 UZS</p></div>
                        <div><p className="text-[9px] font-black text-white/30 uppercase tracking-widest mb-1">Joriy qarz</p><p className="text-xl font-black text-emerald-400">0 UZS</p></div>
                        <div className="hidden md:block"><p className="text-[9px] font-black text-white/30 uppercase tracking-widest mb-1">Keyingi hisob</p><p className="text-xl font-black">1-may, 2026</p></div>
                     </div>
                  </div>
               </div>
               <div className="flex flex-col gap-6">
                  <div className="flex-1 bg-brand-primary p-10 rounded-[3.5rem] text-white shadow-xl flex flex-col justify-between items-center text-center group cursor-pointer hover:bg-brand-primary-dark transition-all active:scale-95 border-b-8 border-black/10">
                     <CreditCard size={40} className="group-hover:rotate-12 transition-transform" />
                     <div><h5 className="text-xl font-black uppercase tracking-tight">Onlayn to'lov</h5><p className="text-[10px] font-bold opacity-60 uppercase mt-1">Tezkor onlayn to'lov</p></div>
                  </div>
                  <div className="flex-1 bg-white p-10 rounded-[3.5rem] border border-brand-border shadow-sm flex flex-col justify-between items-center text-center group cursor-pointer hover:border-brand-primary transition-all active:scale-95">
                     <Receipt size={40} className="text-brand-primary group-hover:scale-110 transition-transform" />
                     <div><h5 className="text-xl font-black text-brand-depth uppercase tracking-tight">Invoys olish</h5><p className="text-[10px] font-bold text-brand-muted uppercase mt-1">Bank orqali to'lash</p></div>
                  </div>
               </div>
            </div>
            <div className="bg-white rounded-[4rem] border border-brand-border overflow-hidden shadow-sm">
               <div className="p-8 border-b border-slate-50 bg-slate-50/20"><h5 className="font-black text-brand-depth uppercase text-xs tracking-widest flex items-center gap-3"><ClipboardList size={18} className="text-brand-primary" /> Buxgalteriya Tarixi</h5></div>
               <div className="overflow-x-auto">
                  <table className="w-full text-left">
                     <thead>
                        <tr className="bg-slate-50/50 text-[10px] font-black text-brand-muted uppercase tracking-[0.3em] border-b border-brand-border">
                           <th className="px-10 py-6">Operatsiya ID</th><th className="px-10 py-6">To'lov sanasi</th><th className="px-10 py-6">Kiritilgan summa</th><th className="px-10 py-6">Holat</th><th className="px-10 py-6 text-right">Kvitansiya</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-50">
                        {data.payments.map((p: any) => (
                           <tr key={p.id} className="hover:bg-slate-50/50 transition-all">
                              <td className="px-10 py-8 font-mono text-[10px] font-black text-brand-primary">#{p.id}</td>
                              <td className="px-10 py-8 text-sm font-black text-brand-depth">{p.date}</td>
                              <td className="px-10 py-8 text-lg font-black text-brand-depth tracking-tight">{p.amount.toLocaleString()} UZS</td>
                              <td className="px-10 py-8"><span className="px-3 py-1 bg-emerald-100 text-emerald-600 text-[9px] font-black uppercase rounded-lg">To'langan</span></td>
                              <td className="px-10 py-8 text-right"><button className="p-4 bg-white text-brand-depth hover:bg-brand-primary hover:text-white rounded-2xl transition-all shadow-xl border border-brand-border"><Download size={20} /></button></td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </div>
          </motion.div>
        );

      case 'menu':
        return (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-10">
             <div className="bg-emerald-50 p-12 rounded-[5rem] border-2 border-emerald-100 flex flex-col md:flex-row items-center gap-12 relative overflow-hidden">
                <div className="w-32 h-32 bg-white rounded-[2.5rem] flex items-center justify-center shadow-2xl shrink-0 border-4 border-emerald-50 animate-bounce-slow"><Apple className="text-emerald-500" size={64} /></div>
                <div><h4 className="text-4xl font-black text-emerald-900 tracking-tighter">Premium Parhez Menyu</h4><p className="text-emerald-700 text-sm font-bold uppercase tracking-[0.2em] leading-relaxed max-w-2xl">Professional dietologlar tomonidan bolaning fiziologik ehtiyojlaridan kelib chiqib shakllantirilgan. 100% tabiiy va yangi mahsulotlar.</p></div>
             </div>
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {[
                  { type: 'Nonushta', time: '08:30', meal: 'Sutli bo\'tqa va pishloqli non', iron: '2.8mg', carbs: '48g', vitamins: 'A, D, B12', cals: '340', recipe: "Tayyorlanishi: Yangi sut va sariyog' qo'shilgan holda bug'da pishiriladi." },
                  { type: 'Tushlik', time: '12:30', meal: 'Mastava va Mo\'shxo\'rda', iron: '5.4mg', carbs: '65g', vitamins: 'C, E, K', cals: '580', recipe: "Tayyorlanishi: Mol go'shti va sabzavotlar bilan boyitilgan an'anaviy sho'rva." },
                  { type: 'Ikkinchi tushlik', time: '16:00', meal: 'Mevali assorti va sharbat', iron: '1.5mg', carbs: '35g', vitamins: 'B6, C, A', cals: '230', recipe: "Tarkibi: Olma, banan va mavsumiy mevalar to'plami." },
                  { type: 'Kechki ovqat', time: '18:30', meal: 'Bug\'da pishgan kotlet va guruch', iron: '4.9mg', carbs: '42g', vitamins: 'Zinc, Mg, B6', cals: '420', recipe: "Tayyorlanishi: Yog'siz go'shtdan parhez usulida bug'da tayyorlanadi." }
                ].map((item, idx) => (
                  <div key={idx} className="bg-white border-2 border-slate-50 rounded-[4rem] p-12 shadow-2xl hover:border-brand-primary transition-all group">
                     <div className="flex justify-between items-center mb-8"><span className="px-6 py-2 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase rounded-2xl">{item.type}</span><div className="flex items-center gap-2 text-brand-muted font-bold text-xs"><Clock size={16}/> {item.time}</div></div>
                     <h5 className="text-3xl font-black text-brand-depth mb-4 leading-tight">{item.meal}</h5>
                     <p className="text-xs font-bold text-brand-slate mb-8 bg-slate-50 p-4 rounded-xl border-l-4 border-emerald-400 italic">"{item.recipe}"</p>
                     <div className="grid grid-cols-2 gap-6 pt-10 border-t border-slate-100">
                        <div className="bg-slate-50 p-4 rounded-2xl flex items-center justify-between group-hover:bg-white transition-colors border border-slate-100"><span className="text-[10px] font-black text-brand-muted uppercase">Temir</span><span className="text-sm font-black text-brand-depth">{item.iron}</span></div>
                        <div className="bg-slate-50 p-4 rounded-2xl flex items-center justify-between group-hover:bg-white transition-colors border border-slate-100"><span className="text-[10px] font-black text-brand-muted uppercase">Uglerod</span><span className="text-sm font-black text-brand-depth">{item.carbs}</span></div>
                        <div className="bg-slate-50 p-4 rounded-2xl flex items-center justify-between col-span-2 group-hover:bg-white transition-colors border border-slate-100"><span className="text-[10px] font-black text-brand-muted uppercase">Vitamin Kompleksi</span><span className="text-sm font-black text-brand-primary tracking-widest">{item.vitamins}</span></div>
                        <div className="bg-brand-depth p-5 rounded-2xl flex items-center justify-between col-span-2 text-white shadow-2xl group-hover:bg-brand-primary"><span className="text-[11px] font-black uppercase opacity-60">Energiya Qiymati</span><span className="text-2xl font-black tracking-tighter">{item.cals} kkal</span></div>
                     </div>
                  </div>
                ))}
             </div>
          </motion.div>
        );

      case 'medical':
        return (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-10">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-10 rounded-[3rem] border border-brand-border shadow-xl flex items-center gap-10 relative overflow-hidden group hover:border-brand-primary transition-all">
                   <div className="w-20 h-20 rounded-[2rem] bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shadow-sm shrink-0"><Activity size={32} /></div>
                   <div><p className="text-[10px] font-black text-brand-muted uppercase tracking-widest mb-1">Bo'yi (O'sish)</p><h4 className="text-5xl font-black text-blue-700 tracking-tighter">{parentData.height} <span className="text-xl font-bold opacity-60">cm</span></h4></div>
                </div>
                <div className="bg-white p-10 rounded-[3rem] border border-brand-border shadow-xl flex items-center gap-10 relative overflow-hidden group hover:border-rose-500 transition-all">
                   <div className="w-20 h-20 rounded-[2rem] bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100 shadow-sm shrink-0"><Heart size={32} /></div>
                   <div><p className="text-[10px] font-black text-brand-muted uppercase tracking-widest mb-1">Vazni (Og'irligi)</p><h4 className="text-5xl font-black text-rose-700 tracking-tighter">{parentData.weight} <span className="text-xl font-bold opacity-60">kg</span></h4></div>
                </div>
             </div>
             <div className="bg-amber-50 p-12 rounded-[4rem] border-2 border-amber-100 relative overflow-hidden shadow-xl group">
                <div className="absolute top-0 right-0 p-10 opacity-10"><ShieldAlert size={100} className="text-amber-600" /></div>
                <div className="relative z-10 space-y-6">
                   <div className="flex items-center gap-4"><ShieldAlert size={24} className="text-amber-500" /><h5 className="text-2xl font-black text-amber-950 tracking-tight">Allergiyalar va Taqiqlar</h5></div>
                   <div className="bg-white/80 backdrop-blur-md p-8 rounded-[2.5rem] border border-amber-200 shadow-inner"><p className="text-lg font-black text-amber-900 leading-relaxed uppercase tracking-tight">{parentData.allergies}</p></div>
                </div>
             </div>
             <div className="bg-white p-12 rounded-[4rem] border border-brand-border shadow-sm group">
                <h5 className="font-black text-xs uppercase tracking-[0.3em] text-brand-depth mb-6 flex items-center gap-3"><FileText size={18} className="text-brand-primary" /> Shifokor tavsiyalari va tibbiy qaydlar</h5>
                <div className="bg-slate-50 p-10 rounded-[3rem] border-2 border-slate-100 group-hover:bg-white transition-all"><p className="text-base font-bold text-brand-slate leading-loose italic">{parentData.medical_notes}</p></div>
             </div>
          </motion.div>
        );

      case 'vaccines':
        return (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-12">
             <div className="bg-sky-600 text-white p-16 rounded-[5rem] shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/10 rounded-full blur-[120px] -mr-40 -mt-40 group-hover:bg-white/20 transition-all duration-1000"></div>
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-12">
                   <div className="space-y-4 text-center md:text-left"><h4 className="text-5xl font-black tracking-tighter leading-none">Emlash Monitoringi</h4><p className="text-lg font-bold text-sky-100/80 max-w-md uppercase tracking-widest text-xs">Rejali sog'lomlashtirish ishlari va immunizatsiya nazorati</p></div>
                   <Syringe size={56} className="text-sky-300 opacity-60" />
                </div>
             </div>
             <div className="bg-white rounded-[4rem] border border-brand-border overflow-hidden shadow-2xl relative">
                <div className="divide-y divide-slate-100">
                   {data.vaccinations.map((v:any) => (
                      <div key={v.id} className="p-12 flex flex-col sm:flex-row items-center justify-between group hover:bg-sky-50/30 transition-all gap-8">
                         <div className="flex items-center gap-10">
                            <div className={`w-20 h-20 rounded-[2.5rem] flex items-center justify-center border-4 transition-all shadow-xl ${v.status === 'TAKEN' ? 'bg-emerald-50 border-white text-emerald-500' : 'bg-slate-50 border-white text-slate-300 group-hover:bg-white'}`}><Syringe size={36} /></div>
                            <div><h5 className="text-2xl font-black text-brand-depth tracking-tight leading-none">{v.vaccine_name}</h5><div className="flex flex-wrap gap-3 mt-3"><div className="flex items-center gap-2 text-[10px] font-black text-brand-muted uppercase bg-white border border-brand-border px-4 py-1.5 rounded-xl">Reja: {v.planned_date}</div>{v.status === 'TAKEN' && (<div className="flex items-center gap-2 text-[10px] font-black text-emerald-600 uppercase bg-emerald-50 border border-emerald-100 px-4 py-1.5 rounded-xl">Olingan: {v.taken_date}</div>)}</div></div>
                         </div>
                         <div className={`px-10 py-5 rounded-[2rem] text-xs font-black uppercase tracking-[0.2em] shadow-2xl transition-all border-b-4 ${v.status === 'TAKEN' ? 'bg-emerald-500 text-white border-emerald-700 shadow-emerald-500/20' : 'bg-brand-depth text-white border-black shadow-brand-depth/20'}`}>{v.status === 'TAKEN' ? 'Muvaffaqiyatli' : 'Kutilmoqda'}</div>
                      </div>
                   ))}
                </div>
             </div>
          </motion.div>
        );

      case 'progress':
        return (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-10">
             <div className="bg-gradient-to-br from-amber-400 to-orange-500 p-16 rounded-[5rem] text-white shadow-2xl relative overflow-hidden flex flex-col lg:flex-row justify-between items-center gap-12">
                <div className="relative z-10 text-center lg:text-left space-y-4"><h4 className="text-5xl font-black tracking-tighter leading-none">Bolaning Yutuqlari</h4><p className="text-lg font-bold text-white/80 max-w-md italic">"Har bir kichik yutuq — kelajak g'alabasi uchun poydevordir"</p></div>
                <div className="relative z-10 flex items-center gap-8 bg-white/10 p-10 rounded-[4rem] border border-white/20 backdrop-blur-2xl"><div className="w-24 h-24 rounded-[2rem] bg-white text-amber-500 flex items-center justify-center shadow-xl"><Award size={48} /></div><div className="text-center"><p className="text-[11px] font-black uppercase tracking-[0.3em] opacity-60">Umumiy Reyting</p><p className="text-7xl font-black tracking-tighter mt-1">4.9</p></div></div>
             </div>
             <div className="grid grid-cols-1 gap-10">
                {data.progressReports.map((r:any) => (
                   <div key={r.id} className="bg-white p-12 rounded-[4rem] border border-brand-border shadow-xl relative overflow-hidden group hover:shadow-2xl transition-all">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10 mb-8">
                         <div className="flex items-center gap-6"><div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center shadow-sm"><Star size={32} /></div><div><h5 className="text-3xl font-black text-brand-depth tracking-tighter leading-none">{r.subject}</h5><p className="text-[11px] font-black text-brand-muted uppercase tracking-[0.3em] mt-2">{r.date} • TARBIYACHI HISOBOTI</p></div></div>
                         <div className="flex gap-2 p-3 bg-slate-50 rounded-2xl shadow-inner border border-slate-100">{[...Array(5)].map((_, i) => (<Star key={i} size={28} fill={i < r.rating ? '#fbbf24' : 'none'} className={i < r.rating ? 'text-amber-400 drop-shadow-md' : 'text-slate-200'} />))}</div>
                      </div>
                      <div className="bg-brand-ghost p-10 rounded-[3rem] border-2 border-brand-border relative group-hover:bg-white transition-all"><MessageSquare className="absolute -top-6 -left-6 text-brand-primary opacity-20 w-16 h-16" /><p className="text-lg font-bold text-brand-depth leading-relaxed italic relative z-10">"{r.comment}"</p></div>
                   </div>
                ))}
             </div>
          </motion.div>
        );

      case 'messages':
        return (
          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="h-[700px] flex gap-8">
             {/* Chat Sidebar */}
             <div className="w-80 flex flex-col gap-4">
                <div className="bg-white p-6 rounded-[2.5rem] border border-brand-border shadow-sm space-y-4">
                   <p className="text-[10px] font-black text-brand-muted uppercase tracking-[0.3em] px-2">Kontaktlar</p>
                   <div className="space-y-2">
                      <button 
                        onClick={() => setActiveChat('teacher')}
                        className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all ${activeChat === 'teacher' ? 'bg-brand-primary text-white shadow-lg' : 'hover:bg-slate-50'}`}
                      >
                         <div className={`w-12 h-12 rounded-xl flex items-center justify-center border-2 ${activeChat === 'teacher' ? 'bg-white/20 border-white/30 text-white' : 'bg-slate-50 border-brand-border text-brand-primary'}`}>
                            <User size={24} />
                         </div>
                         <div className="text-left">
                            <p className="text-xs font-black leading-none">Tarbiyachi</p>
                            <p className={`text-[10px] mt-1 font-bold ${activeChat === 'teacher' ? 'text-white/60' : 'text-brand-muted'}`}>Online</p>
                         </div>
                      </button>
                      <button 
                        onClick={() => setActiveChat('admin')}
                        className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all ${activeChat === 'admin' ? 'bg-brand-primary text-white shadow-lg' : 'hover:bg-slate-50'}`}
                      >
                         <div className={`w-12 h-12 rounded-xl flex items-center justify-center border-2 ${activeChat === 'admin' ? 'bg-white/20 border-white/30 text-white' : 'bg-slate-50 border-brand-border text-brand-primary'}`}>
                            <ShieldCheck size={24} />
                         </div>
                         <div className="text-left">
                            <p className="text-xs font-black leading-none">Ma'muriyat</p>
                            <p className={`text-[10px] mt-1 font-bold ${activeChat === 'admin' ? 'text-white/60' : 'text-brand-muted'}`}>Aktiv</p>
                         </div>
                      </button>
                   </div>
                </div>
                <div className="bg-brand-ghost p-6 rounded-[2.5rem] border border-brand-border flex-1 flex flex-col items-center justify-center text-center space-y-4">
                   <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-inner opacity-40"><Lock size={24} /></div>
                   <p className="text-[9px] font-black text-brand-muted uppercase leading-relaxed px-4 tracking-widest">Barcha xabarlar 128-bitli shifrlash orqali himoyalangan</p>
                </div>
             </div>

             {/* Main Chat Window */}
             <div className="flex-1 bg-white border-2 border-slate-50 rounded-[4rem] shadow-2xl flex flex-col relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/p-2.png')] opacity-[0.03] pointer-events-none"></div>
                
                {/* Chat Header */}
                <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-white/80 backdrop-blur-md relative z-10">
                   <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-brand-primary/10 flex items-center justify-center text-brand-primary border border-brand-primary/20">
                         {activeChat === 'teacher' ? <User size={28} /> : <ShieldCheck size={28} />}
                      </div>
                      <div>
                         <h5 className="text-xl font-black text-brand-depth tracking-tight">{activeChat === 'teacher' ? 'Guruh Tarbiyachisi' : 'Bog\'cha Ma\'muriyati'}</h5>
                         <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div> Tarmoqda
                         </p>
                      </div>
                   </div>
                   <button className="p-3 text-brand-muted hover:text-brand-primary transition-colors"><MoreVertical size={24} /></button>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-10 space-y-6 relative z-10 custom-scrollbar">
                   {messages[activeChat].map((msg: any) => (
                      <div key={msg.id} className={`flex ${msg.type === 'sent' ? 'justify-end' : 'justify-start'}`}>
                         <div className={`max-w-[80%] p-5 rounded-[2rem] shadow-lg relative group ${
                            msg.type === 'sent' 
                            ? 'bg-brand-primary text-white rounded-tr-none' 
                            : 'bg-slate-50 text-brand-depth rounded-tl-none border border-slate-100'
                         }`}>
                            <p className="text-sm font-bold leading-relaxed">{msg.text}</p>
                            <div className={`flex items-center justify-end gap-1.5 mt-2 ${msg.type === 'sent' ? 'text-white/60' : 'text-brand-muted'}`}>
                               <span className="text-[9px] font-black">{msg.time}</span>
                               {msg.type === 'sent' && (
                                  msg.status === 'read' ? <CheckCheck size={12} /> : msg.status === 'sent' ? <Check size={12} /> : null
                               )}
                            </div>
                         </div>
                      </div>
                   ))}
                </div>

                {/* Input Area */}
                <div className="p-8 border-t border-slate-50 bg-white/80 backdrop-blur-md relative z-10">
                   <form 
                     onSubmit={handleSendMessage}
                     className="flex items-center gap-4 bg-slate-50 border-2 border-transparent focus-within:border-brand-primary focus-within:bg-white rounded-[2.5rem] px-8 py-4 transition-all shadow-inner"
                   >
                      <button type="button" className="text-brand-muted hover:text-brand-primary transition-colors"><Paperclip size={22} /></button>
                      <input 
                        type="text"
                        value={chatMessage}
                        onChange={(e) => setChatMessage(e.target.value)}
                        placeholder="Xabar yozing..."
                        className="flex-1 bg-transparent outline-none font-bold text-sm text-brand-depth py-2"
                      />
                      <button type="button" className="text-brand-muted hover:text-brand-primary transition-colors"><Smile size={22} /></button>
                      <button 
                        type="submit"
                        className="w-12 h-12 bg-brand-primary text-white rounded-2xl flex items-center justify-center shadow-lg shadow-brand-primary/30 hover:scale-105 active:scale-95 transition-all"
                      >
                         <Send size={20} />
                      </button>
                   </form>
                </div>
             </div>
          </motion.div>
        );

      case 'documents':
        return (
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-12">
             <div className="bg-white rounded-[4rem] border-2 border-slate-50 shadow-2xl overflow-hidden">
                <div className="p-16 border-b border-slate-50 flex flex-col md:flex-row items-center justify-between bg-slate-50/20 gap-10">
                   <div className="flex items-center gap-8 text-center md:text-left"><div className="w-24 h-24 rounded-[2.5rem] bg-brand-primary text-white flex items-center justify-center shadow-xl border-4 border-white/20"><FileText size={48} /></div><div><h5 className="text-4xl font-black text-brand-depth tracking-tighter uppercase leading-none">Hujjatlar Arxivi</h5><p className="text-[11px] font-black text-brand-muted uppercase tracking-[0.4em] mt-3 flex items-center justify-center md:justify-start gap-2"><ShieldCheck size={14} className="text-emerald-500" /> Maxfiy va Xavfsiz Saqlash</p></div></div>
                </div>
                <div className="divide-y divide-slate-100">
                   {data.documents.map((doc:any) => (
                      <div key={doc.id} className="p-12 flex flex-col md:flex-row items-center justify-between group hover:bg-slate-50/80 transition-all gap-10">
                         <div className="flex items-center gap-10 text-center md:text-left"><div className="w-20 h-20 rounded-[2rem] bg-white flex items-center justify-center text-brand-primary border-2 border-slate-100 shadow-xl group-hover:scale-110 transition-all relative overflow-hidden"><FileText size={32} /></div><div><p className="font-black text-2xl text-brand-depth tracking-tight group-hover:text-brand-primary transition-colors leading-none">{doc.title}</p><div className="flex flex-wrap justify-center md:justify-start items-center gap-4 mt-4"><span className="text-[10px] font-black text-brand-muted uppercase tracking-widest bg-slate-100 border border-slate-200 px-4 py-1.5 rounded-xl shadow-inner">PDF FORMAT</span><div className="flex items-center gap-1.5 text-[10px] font-black text-brand-slate uppercase tracking-widest"><Clock size={14} className="text-brand-primary" /> Yuklangan: {doc.created_at}</div></div></div></div>
                         <button className="flex items-center gap-4 px-12 py-5 bg-brand-depth text-white rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:bg-brand-primary transition-all active:scale-95 group/dl"><Download size={20} /> Yuklab olish</button>
                      </div>
                   ))}
                </div>
             </div>
          </motion.div>
        );

      case 'pickup':
        return (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-12">
             <div className="flex flex-col sm:flex-row justify-between items-center bg-white p-12 rounded-[4rem] border-2 border-slate-50 shadow-xl gap-10">
                <div><h4 className="text-4xl font-black text-brand-depth tracking-tighter leading-none">Ishonchli Vakillar</h4><p className="text-brand-muted text-xs font-bold uppercase tracking-[0.3em] mt-3 flex items-center justify-center md:justify-start gap-2"><ShieldCheck size={16} className="text-emerald-500" /> Faqat ruxsat etilgan shaxslar</p></div>
                <button className="px-12 py-6 bg-brand-primary text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] shadow-xl hover:scale-105 transition-all flex items-center gap-4"><UserCheck size={24} /> Yangi vakil qo'shish</button>
             </div>
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {data.authorizedPickups.map((v:any) => (
                   <div key={v.id} className="bg-white p-12 rounded-[4rem] border border-brand-border shadow-2xl flex flex-col sm:flex-row items-center gap-10 hover:shadow-xl transition-all relative overflow-hidden group">
                      <div className="w-36 h-36 rounded-[2.5rem] bg-slate-50 border-8 border-white shadow-2xl flex items-center justify-center overflow-hidden shrink-0 relative">{v.photo_url ? (<img src={v.photo_url} alt="" className="w-full h-full object-cover" />) : (<div className="text-brand-muted flex flex-col items-center"><Contact size={48} className="opacity-20" /><p className="text-[8px] font-black mt-2">PHOTO ID</p></div>)}<div className="absolute top-2 right-2 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white shadow-lg"></div></div>
                      <div className="flex-1 space-y-3 text-center sm:text-left"><div><p className="text-[11px] font-black text-brand-primary uppercase tracking-[0.4em] mb-2">{v.relation}</p><p className="text-3xl font-black text-brand-depth tracking-tighter leading-none">{v.full_name}</p></div><div className="flex items-center justify-center sm:justify-start gap-3 text-sm font-black text-brand-depth pt-2"><Smartphone size={18} className="text-brand-primary" /> {v.phone}</div><div className="pt-4 flex justify-center sm:justify-start"><button className="px-6 py-3 bg-rose-50 text-rose-500 rounded-xl font-black text-[9px] uppercase tracking-[0.2em] border border-rose-100 hover:bg-rose-500 hover:text-white transition-all shadow-sm"><Trash2 size={12} className="inline mr-2"/> Vakolatni bekor qilish</button></div></div>
                   </div>
                ))}
             </div>
          </motion.div>
        );

      case 'security':
        return (
          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, x: 0 }} className="space-y-12">
            <div className="p-12 bg-gradient-to-br from-brand-primary/10 to-brand-primary/5 border-2 border-brand-primary/10 rounded-[4rem] flex flex-col md:flex-row items-center gap-10 relative overflow-hidden group">
               <div className="w-24 h-24 bg-white rounded-[2.5rem] shadow-2xl flex items-center justify-center text-brand-primary border-4 border-brand-primary/10 shrink-0 group-hover:rotate-6 transition-all duration-700"><ShieldCheck size={48} /></div>
               <div className="text-center md:text-left space-y-2"><h4 className="text-3xl font-black text-brand-depth tracking-tighter uppercase leading-none">Xavfsizlik Boshqaruvi</h4><p className="text-brand-muted text-[11px] font-black uppercase tracking-[0.3em] mt-2">Shaxsiy kabinetingizga kirish ma'lumotlarini boshqaring</p></div>
            </div>
            <form onSubmit={handleUpdateCredentials} className="space-y-12 max-w-4xl mx-auto">
               <div className="bg-white p-12 rounded-[4rem] border border-brand-border shadow-2xl space-y-10 relative">
                  <div className="space-y-4"><label className="text-[10px] font-black text-brand-muted uppercase tracking-[0.4em] ml-4">Tizim Logini (Username)</label><div className="relative group"><User className="absolute left-8 top-1/2 -translate-y-1/2 text-brand-muted group-focus-within:text-brand-primary transition-colors" size={24} /><input type="text" value={credentials.login} onChange={(e) => setCredentials({...credentials, login: e.target.value})} className="w-full pl-20 pr-8 py-7 bg-slate-50 border-4 border-transparent focus:border-brand-primary focus:bg-white rounded-[2.5rem] font-black text-xl text-brand-depth outline-none transition-all shadow-inner" /></div></div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-4"><div className="space-y-4"><label className="text-[10px] font-black text-brand-muted uppercase tracking-[0.4em] ml-4">Yangi Parol</label><div className="relative group"><Lock className="absolute left-8 top-1/2 -translate-y-1/2 text-brand-muted group-focus-within:text-brand-primary transition-colors" size={24} /><input type="password" value={credentials.newPassword} onChange={(e) => setCredentials({...credentials, newPassword: e.target.value})} placeholder="••••••••" className="w-full pl-20 pr-8 py-7 bg-slate-50 border-4 border-transparent focus:border-brand-primary focus:bg-white rounded-[2.5rem] font-black text-xl text-brand-depth outline-none transition-all shadow-inner" /></div></div><div className="space-y-4"><label className="text-[10px] font-black text-brand-muted uppercase tracking-[0.4em] ml-4">Parolni Tasdiqlash</label><div className="relative group"><Key className="absolute left-8 top-1/2 -translate-y-1/2 text-brand-muted group-focus-within:text-brand-primary transition-colors" size={24} /><input type="password" value={credentials.confirmPassword} onChange={(e) => setCredentials({...credentials, confirmPassword: e.target.value})} placeholder="••••••••" className="w-full pl-20 pr-8 py-7 bg-slate-50 border-4 border-transparent focus:border-brand-primary focus:bg-white rounded-[2.5rem] font-black text-xl text-brand-depth outline-none transition-all shadow-inner" /></div></div></div>
               </div>
               <div className="flex flex-col md:flex-row items-center gap-8 justify-center"><div className="bg-amber-50 px-8 py-4 rounded-2xl border border-amber-100 flex items-center gap-3"><AlertCircle size={18} className="text-amber-500" /><p className="text-[10px] font-bold text-amber-700 leading-tight">DIQQAT: Loginni o'zgartirsangiz, <br/>kelajakda o'sha login orqali kirishingiz kerak bo'ladi.</p></div><button type="submit" disabled={isSaving} className="w-full md:w-auto flex items-center justify-center gap-4 px-20 py-7 bg-brand-depth text-white font-black rounded-[2.5rem] shadow-2xl hover:bg-brand-primary transition-all disabled:opacity-50 uppercase text-xs tracking-[0.3em] active:scale-95 group">{isSaving ? <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={24} className="group-hover:-translate-y-0.5 transition-transform" />}Ma'luotlarni saqlash</button></div>
            </form>
          </motion.div>
        );

      default: return null;
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto p-4 md:p-10 lg:p-16 space-y-12 bg-slate-50/30">
      {/* Header Profile Summary */}
      <div className="relative p-12 md:p-16 bg-brand-depth rounded-[4rem] md:rounded-[5rem] text-white shadow-[0_50px_100px_rgba(0,0,0,0.3)] overflow-hidden group border border-white/5">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-primary/20 rounded-full blur-[150px] -mr-40 -mt-40 group-hover:bg-brand-primary/30 transition-all duration-1000"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] -ml-40 -mb-40 group-hover:bg-emerald-500/20 transition-all duration-1000"></div>
        
        <div className="relative z-10 flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          <div className="relative shrink-0">
             <div className="w-40 h-40 md:w-48 md:h-48 rounded-[3.5rem] border-8 border-white/5 p-1 bg-gradient-to-br from-brand-primary/20 to-white/5 shadow-2xl backdrop-blur-3xl flex items-center justify-center group-hover:scale-105 transition-transform duration-700">
                <User size={80} className="text-white/20 group-hover:text-white/40 transition-colors" />
                <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center border-4 border-brand-depth shadow-xl">
                   <CheckCircle2 size={24} className="text-white" />
                </div>
             </div>
          </div>

          <div className="text-center lg:text-left flex-1 space-y-6">
             <div>
                <div className="flex flex-wrap justify-center lg:justify-start items-center gap-4 mb-4">
                   <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase font-display leading-none">{parentData?.childName || 'Mustafo Bozorov'}</h2>
                   <div className="px-5 py-2 bg-brand-primary/20 text-brand-primary text-[10px] font-black uppercase rounded-2xl tracking-[0.3em] backdrop-blur-md border border-brand-primary/30">Premium Portal</div>
                </div>
                <div className="flex flex-wrap justify-center lg:justify-start items-center gap-6 md:gap-10">
                   <p className="text-white/60 font-black text-sm uppercase tracking-[0.2em] flex items-center gap-3">
                      <Users size={20} className="text-brand-primary" />
                      {parentData?.childGroup || '3-guruh (Shaffoflar)'}
                   </p>
                   <div className="w-2 h-2 bg-white/10 rounded-full hidden md:block"></div>
                   <p className="text-white/60 font-black text-sm uppercase tracking-[0.2em] flex items-center gap-3">
                      <MapPin size={20} className="text-brand-primary" />
                      Toshkent, O'zbekiston
                   </p>
                </div>
             </div>

             <div className="flex flex-wrap justify-center lg:justify-start items-center gap-8 pt-6 border-t border-white/5">
                <div className="flex items-center gap-4 group/stat">
                   <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover/stat:bg-brand-primary group-hover/stat:border-brand-primary transition-all"><Target size={22} className="text-brand-primary group-hover/stat:text-white" /></div>
                   <div>
                      <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">O'zlashtirish</p>
                      <p className="text-xl font-black leading-none mt-1">98.2%</p>
                   </div>
                </div>
                <div className="flex items-center gap-4 group/stat">
                   <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover/stat:bg-emerald-50 group-hover/stat:border-emerald-500 transition-all"><Activity size={22} className="text-emerald-400 group-hover/stat:text-white" /></div>
                   <div>
                      <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Salomatlik</p>
                      <p className="text-xl font-black leading-none mt-1">Sog'lom</p>
                   </div>
                </div>
             </div>
          </div>

          <div className="flex gap-4">
             <button onClick={logout} className="p-6 bg-white/5 rounded-[2.5rem] hover:bg-rose-500 hover:border-rose-400 transition-all border border-white/10 group shadow-2xl active:scale-90"><LogOut size={28} className="group-hover:scale-110 transition-transform" /></button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
        <div className="col-span-1 lg:col-span-4 xl:col-span-3">
          <div className="bg-white p-6 rounded-[3.5rem] border border-brand-border shadow-[0_20px_60px_rgba(0,0,0,0.03)] space-y-2 sticky top-10">
            <div className="px-8 py-6 mb-4 border-b border-slate-50"><p className="text-[11px] font-black text-brand-depth uppercase tracking-[0.4em]">Boshqaruv Paneli</p></div>
            <div className="space-y-2">
              {navItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-5 p-6 rounded-[2rem] font-black text-xs transition-all group relative overflow-hidden ${
                    activeTab === item.id 
                      ? `bg-brand-primary text-white shadow-2xl shadow-brand-primary/30 scale-[1.05] z-10` 
                      : 'text-brand-muted hover:bg-slate-50 hover:text-brand-depth'
                  }`}
                >
                  <item.icon size={22} className={activeTab === item.id ? 'text-white' : 'text-brand-muted group-hover:text-brand-primary transition-colors'} />
                  <span className="uppercase tracking-[0.15em]">{item.label}</span>
                  {activeTab === item.id && (<motion.div layoutId="active-nav" className="absolute right-4 w-1.5 h-1.5 bg-white rounded-full shadow-lg" />)}
                </button>
              ))}
            </div>
            <div className="mt-10 p-8 bg-brand-ghost rounded-[2.5rem] border border-brand-border relative overflow-hidden group">
               <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform"><Target size={60} /></div>
               <p className="text-[10px] font-black text-brand-depth uppercase tracking-widest mb-4">Tizim holati</p>
               <div className="flex items-center gap-3"><div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-lg shadow-emerald-500/50"></div><span className="text-xs font-black text-brand-depth uppercase tracking-widest">Online • xavfsiz</span></div>
            </div>
          </div>
        </div>

        <div className="col-span-1 lg:col-span-8 xl:col-span-9">
          <div className="bg-white p-12 md:p-16 rounded-[5rem] border border-brand-border shadow-[0_40px_100px_rgba(0,0,0,0.04)] min-h-[800px] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-primary/[0.01] rounded-full blur-[100px] -mr-80 -mt-80"></div>
            <div className="flex flex-col sm:flex-row items-center justify-between mb-16 relative z-10 gap-8">
               <div className="text-center sm:text-left"><h1 className="text-4xl md:text-5xl font-black text-brand-depth tracking-tighter leading-none">{navItems.find(n => n.id === activeTab)?.label}</h1><div className="text-brand-muted text-[10px] font-black mt-3 uppercase tracking-[0.4em] flex items-center justify-center sm:justify-start gap-3"><div className="w-8 h-px bg-brand-primary/30"></div>Eksklyuziv portal xizmati</div></div>
               <div className="flex gap-4"><div className="p-4 bg-brand-ghost rounded-2xl text-brand-muted hover:text-brand-primary transition-all border border-brand-border cursor-pointer relative group"><Bell size={24} /><span className="absolute top-3 right-3 w-2.5 h-2.5 bg-rose-500 border-2 border-white rounded-full group-hover:scale-125 transition-transform"></span></div><div className="p-4 bg-brand-ghost rounded-2xl text-brand-muted hover:text-brand-primary transition-all border border-brand-border cursor-pointer"><Settings size={24} /></div></div>
            </div>
            <AnimatePresence mode="wait"><motion.div key={activeTab} initial={{ opacity: 0, scale: 0.98, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 1.02, y: -20 }} transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }} className="relative z-10">{renderTabContent()}</motion.div></AnimatePresence>
            <div className="absolute bottom-0 right-0 p-20 pointer-events-none opacity-[0.02] scale-150 rotate-12"><Target size={300} /></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentView;
