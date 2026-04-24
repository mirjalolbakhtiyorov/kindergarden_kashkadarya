import React, { useState, useMemo, useEffect } from 'react';
import axios from 'axios';
import { 
  ClipboardCheck, 
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Thermometer,
  Calendar,
  Users,
  Utensils,
  History as HistoryIcon
} from 'lucide-react';
import { Group } from '../../types';
import { useNotification } from '../../context/NotificationContext';
import { useGroups } from '../../features/groups/hooks/useGroups';

interface TeacherViewProps {
  groups: Group[];
}

type AttendanceStatus = 'present' | 'absent' | 'sick';

const API_BASE_URL = 'http://localhost:3001/api';

const TeacherView: React.FC<TeacherViewProps> = ({ groups: initialGroups }) => {
  const { groups, refetch: refetchGroups } = useGroups();
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const { showNotification } = useNotification();
  
  const [todayStats, setTodayStats] = useState({
    present: 0,
    absent: 0,
    sick: 0
  });

  const fetchTodayStats = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/attendance/today-stats`);
      console.log('Today Stats:', res.data);
      setTodayStats(res.data);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  };

  useEffect(() => {
    console.log('TeacherView loaded, fetching data...');
    fetchTodayStats();
    refetchGroups();
  }, []);

  // Backenddan kelgan guruhlarni tekshiramiz
  const displayGroups = groups.length > 0 ? groups : initialGroups;
  console.log('Display Groups:', displayGroups);

  if (!selectedGroup) {
    const totalKids = displayGroups.reduce((sum, g) => sum + ((g as any).children?.length || 0), 0);
    const mealPortions = todayStats.present; 
    
    const absentDisplay = todayStats.present + todayStats.absent + todayStats.sick === 0 
      ? 0 
      : todayStats.absent;

    return (
      <div className="p-8 animate-in fade-in max-w-7xl mx-auto space-y-10">
        <header>
          <h2 className="text-4xl font-black text-brand-depth tracking-tight">Xush kelibsiz!</h2>
          <p className="text-brand-muted font-bold uppercase text-[10px] tracking-widest mt-2 flex items-center gap-2">
            <Calendar size={14} className="text-brand-primary" />
            Bugun: {new Date().toLocaleDateString('uz-UZ', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white p-6 rounded-[2rem] border border-brand-border shadow-sm flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-blue-50 text-brand-primary rounded-2xl flex items-center justify-center mb-4">
              <Users size={24} />
            </div>
            <p className="text-[9px] font-black text-brand-muted uppercase tracking-[0.2em] mb-1">Jami bolalar</p>
            <p className="text-3xl font-black text-brand-depth">{totalKids}</p>
          </div>

          <div className="bg-emerald-50/50 p-6 rounded-[2rem] border border-emerald-100 flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-4">
              <CheckCircle2 size={24} />
            </div>
            <p className="text-[9px] font-black text-emerald-600 uppercase tracking-[0.2em] mb-1">Bugun kelgan</p>
            <p className="text-3xl font-black text-emerald-600">{todayStats.present}</p>
          </div>

          <div className="bg-rose-50/50 p-6 rounded-[2rem] border border-rose-100 flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-rose-100 text-rose-500 rounded-2xl flex items-center justify-center mb-4">
              <XCircle size={24} />
            </div>
            <p className="text-[9px] font-black text-rose-500 uppercase tracking-[0.2em] mb-1">Bugun kelmagan</p>
            <p className="text-3xl font-black text-rose-500">{absentDisplay}</p>
          </div>

          <div className="bg-amber-50/50 p-6 rounded-[2rem] border border-amber-100 flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mb-4">
              <Thermometer size={24} />
            </div>
            <p className="text-[9px] font-black text-amber-600 uppercase tracking-[0.2em] mb-1">Kasal bolalar</p>
            <p className="text-3xl font-black text-amber-600">{todayStats.sick}</p>
          </div>

          <div className="bg-indigo-50/50 p-6 rounded-[2rem] border border-indigo-100 flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mb-4">
              <Utensils size={24} />
            </div>
            <p className="text-[9px] font-black text-indigo-600 uppercase tracking-[0.2em] mb-1">Ovqat porsiyasi</p>
            <p className="text-3xl font-black text-indigo-600">{mealPortions}</p>
          </div>
        </div>

        <section>
          <h3 className="text-sm font-black text-brand-muted uppercase tracking-[0.2em] mb-6 ml-1">Guruhni tanlang</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayGroups.map(g => (
              <button 
                key={(g as any).id || g.name} 
                onClick={() => setSelectedGroup(g.name)} 
                className="p-8 bg-white border border-brand-border rounded-[2.5rem] text-left transition-all hover:border-brand-primary hover:shadow-2xl hover:shadow-brand-primary/5 group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-brand-primary/5 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-700"></div>
                <div className="relative z-10">
                  <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-brand-primary group-hover:text-white transition-all duration-300">
                    <Users size={24} />
                  </div>
                  <span className="font-black text-brand-depth block text-xl mb-1 tracking-tight">{g.name}</span>
                  <div className="flex flex-col gap-1">
                    <p className="text-[10px] text-brand-muted font-bold uppercase tracking-wider">Tarbiyachi: {(g as any).teacher_name}</p>
                    <p className="text-[10px] text-brand-primary font-black uppercase tracking-widest mt-2">{(g as any).children?.length || 0} ta bola</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>
      </div>
    );
  }

  const groupData = displayGroups.find(g => g.name === selectedGroup);
  if (!groupData) return null;

  return (
    <GroupAttendanceView 
      groupData={groupData} 
      onBack={() => {
        setSelectedGroup(null);
        fetchTodayStats();
        refetchGroups();
      }} 
      onSaved={() => {
        fetchTodayStats();
        refetchGroups();
      }}
    />
  );
};

const GroupAttendanceView = ({ groupData, onBack, onSaved }: { groupData: any, onBack: () => void, onSaved: () => void }) => {
  const { showNotification } = useNotification();
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [attendance, setAttendance] = useState<Record<string, AttendanceStatus>>({});

  useEffect(() => {
    const fetchExistingAttendance = async () => {
      try {
        setIsLoading(true);
        const today = new Date().toISOString().split('T')[0];
        const res = await axios.get(`${API_BASE_URL}/attendance/${groupData.id}/${today}`);
        
        const initialAttendance = (groupData.children || []).reduce((acc: any, child: any) => {
          acc[child.id] = res.data[child.id] || 'present';
          return acc;
        }, {});
        
        setAttendance(initialAttendance);
      } catch (err) {
        console.error('Failed to fetch existing attendance:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchExistingAttendance();
  }, [groupData]);

  const stats = useMemo(() => {
    const values = Object.values(attendance);
    return {
      total: (groupData.children || []).length,
      present: values.filter(v => v === 'present').length,
      absent: values.filter(v => v === 'absent').length,
      sick: values.filter(v => v === 'sick').length
    };
  }, [attendance, groupData.children]);

  const handleStatusChange = (childId: string, status: AttendanceStatus) => {
    setAttendance(prev => ({ ...prev, [childId]: status }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const payload = {
        date: new Date().toISOString().split('T')[0],
        group_name: groupData.name,
        attendance_data: attendance
      };

      await axios.post(`${API_BASE_URL}/attendance`, payload);
      showNotification('Davomat muvaffaqiyatli saqlandi!', 'success');
      onSaved();
    } catch (err) {
      showNotification('Davomatni saqlashda xatolik yuz berdi', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="p-20 text-center font-black text-brand-muted uppercase tracking-widest">Yuklanmoqda...</div>;
  }

  return (
    <div className="p-8 space-y-10 animate-in fade-in max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-8 rounded-[2.5rem] border border-brand-border shadow-xl shadow-slate-200/50 gap-6">
        <div className="space-y-1">
          <button onClick={onBack} className="text-brand-primary font-black text-[10px] uppercase tracking-widest flex items-center gap-2 mb-2 hover:translate-x-[-4px] transition-transform">
            <ArrowLeft size={14} /> Orqaga
          </button>
          <h2 className="text-3xl font-black text-brand-depth tracking-tight">"{groupData.name}" guruhi</h2>
          <div className="flex items-center gap-2 text-brand-muted font-bold text-xs">
            <Calendar size={14} />
            {new Date().toLocaleDateString('uz-UZ', { day: 'numeric', month: 'long', year: 'numeric' })}
          </div>
        </div>
        <button 
          onClick={handleSave} 
          disabled={isSaving}
          className="w-full md:w-auto bg-brand-primary text-white font-black uppercase text-xs tracking-widest px-10 py-5 rounded-2xl hover:shadow-2xl hover:shadow-brand-primary/30 transition-all active:scale-95 disabled:opacity-50"
        >
          {isSaving ? 'Saqlanmoqda...' : 'Saqlash va Tasdiqlash'}
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-[2rem] border border-brand-border shadow-sm text-center">
          <p className="text-[10px] font-black text-brand-muted uppercase tracking-widest mb-1">Jami</p>
          <p className="text-3xl font-black text-brand-depth">{stats.total}</p>
        </div>
        <div className="bg-emerald-50/50 p-6 rounded-[2rem] border border-emerald-100 text-center">
          <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">Keldi</p>
          <p className="text-3xl font-black text-emerald-600">{stats.present}</p>
        </div>
        <div className="bg-rose-50/50 p-6 rounded-[2rem] border border-rose-100 text-center">
          <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest mb-1">Kelmadi</p>
          <p className="text-3xl font-black text-rose-500">{stats.absent}</p>
        </div>
        <div className="bg-amber-50/50 p-6 rounded-[2rem] border border-amber-100 text-center">
          <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-1">Kasal</p>
          <p className="text-3xl font-black text-amber-600">{stats.sick}</p>
        </div>
      </div>
      
      <div className="bg-white rounded-[2.5rem] border border-brand-border shadow-sm overflow-hidden">
        <div className="p-8 border-b border-brand-border bg-slate-50/30">
          <h3 className="font-black text-brand-depth uppercase text-xs tracking-widest flex items-center gap-2">
            <ClipboardCheck size={18} className="text-brand-primary" />
            Bolalar ro'yxati
          </h3>
        </div>
        <div className="divide-y divide-slate-50">
          {(groupData.children || []).length === 0 ? (
            <div className="p-20 text-center text-brand-muted font-bold italic">Guruhda bolalar yo'q</div>
          ) : (
            groupData.children.map((child: any) => (
              <div key={child.id} className="p-6 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                <span className="font-bold text-brand-depth">{child.first_name || child.name} {child.last_name || ''}</span>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleStatusChange(child.id, 'present')}
                    className={`w-28 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${
                      attendance[child.id] === 'present' 
                        ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' 
                        : 'bg-slate-50 text-brand-muted border border-brand-border hover:bg-white'
                    }`}
                  >
                    <CheckCircle2 size={14} /> Keldi
                  </button>
                  <button 
                    onClick={() => handleStatusChange(child.id, 'absent')}
                    className={`w-28 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${
                      attendance[child.id] === 'absent' 
                        ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20' 
                        : 'bg-slate-50 text-brand-muted border border-brand-border hover:bg-white'
                    }`}
                  >
                    <XCircle size={14} /> Kelmadi
                  </button>
                  <button 
                    onClick={() => handleStatusChange(child.id, 'sick')}
                    className={`w-28 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${
                      attendance[child.id] === 'sick' 
                        ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20' 
                        : 'bg-slate-50 text-brand-muted border border-brand-border hover:bg-white'
                    }`}
                  >
                    <Thermometer size={14} /> Kasal
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherView;
