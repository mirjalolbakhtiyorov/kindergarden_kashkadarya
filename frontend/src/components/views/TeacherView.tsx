import React, { useState, useMemo } from 'react';
import { 
  ClipboardCheck, 
  ArrowLeft 
} from 'lucide-react';
import { Group } from '../../types';

interface TeacherViewProps {
  groups: Group[];
}

const TeacherView: React.FC<TeacherViewProps> = ({ groups }) => {
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);

  if (!selectedGroup) {
    return (
      <div className="p-8 animate-in fade-in">
        <h2 className="text-xl font-bold mb-6">Guruhni tanlang</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map(g => (
            <button key={g.name} onClick={() => setSelectedGroup(g.name)} className="p-8 bg-white border border-brand-border rounded-xl text-center font-bold hover:shadow-lg transition">
              {g.name}
            </button>
          ))}
        </div>
      </div>
    );
  }

  const groupData = groups.find(g => g.name === selectedGroup)!;

  return <GroupAttendanceView groupData={groupData} onBack={() => setSelectedGroup(null)} />;
};

const GroupAttendanceView = ({ groupData, onBack }: { groupData: {name: string, children: {id: number, name: string}[]}, onBack: () => void }) => {
  const [attendance, setAttendance] = useState(
    groupData.children.map((child, i) => ({
      ...child,
      meal: i % 3 === 0 ? 'breakfast' : i % 3 === 1 ? 'lunch' : 'dinner',
      status: 'present' as 'present' | 'absent' | 'present_no_meal'
    }))
  );

  const [archive, setArchive] = useState<any[]>([]);
  const [showSavedMessage, setShowSavedMessage] = useState(false);

  const stats = useMemo(() => {
    const present = attendance.filter(a => a.status === 'present' || a.status === 'present_no_meal').length;
    const noMeal = attendance.filter(a => a.status === 'present_no_meal').length;
    return {
      total: attendance.length,
      kelgan: present,
      kelmagan: attendance.filter(a => a.status === 'absent').length,
      nonushta_qilmaydi: noMeal,
      porsiya_soni: present - noMeal
    };
  }, [attendance]);

  const handleSave = () => {
    setArchive(prev => [...prev, { date: new Date().toLocaleDateString(), ...stats }]);
    setShowSavedMessage(true);
    setTimeout(() => setShowSavedMessage(false), 2000);
  };

  return (
    <div className="p-8 space-y-8 animate-in fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-xl border border-brand-border gap-4">
        <button onClick={onBack} className="text-brand-muted hover:text-brand-depth font-bold text-sm flex items-center gap-2 underline underline-offset-4 decoration-transparent hover:decoration-brand-muted transition-all">
          <ArrowLeft size={16} /> Guruhlar
        </button>
        <h2 className="text-xl font-bold">Guruh: "{groupData.name}" ({new Date().toLocaleDateString('uz-UZ', { day: 'numeric', month: 'long' })})</h2>
        <div className="relative w-full md:w-auto">
          <button onClick={handleSave} className="w-full md:w-auto bg-brand-primary text-white font-bold px-6 py-2 rounded-lg hover:shadow-lg transition-transform active:scale-95">Saqlash va Arxivlash</button>
          {showSavedMessage && (
            <div className="absolute right-0 top-full mt-2 bg-green-500 text-white px-4 py-2 rounded-lg text-sm whitespace-nowrap shadow-lg">Saqlandi!</div>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {['breakfast', 'lunch', 'dinner'].map(meal => (
           <div key={meal} className="bg-white p-6 rounded-xl border border-brand-border shadow-sm">
             <h3 className="font-bold mb-4 capitalize border-b pb-2">{meal === 'breakfast' ? 'Nonushta' : meal === 'lunch' ? 'Tushlik' : 'Kechki ovqat'}</h3>
             <div className="space-y-1">
              {attendance.filter(a => a.meal === meal).map((child) => (
                  <div key={child.id} className="flex items-center justify-between py-2 border-b last:border-0 hover:bg-slate-50 transition-colors px-2 rounded-md">
                    <span className="text-sm font-medium">{child.name}</span>
                    <select 
                      value={child.status} 
                      onChange={(e) => setAttendance(prev => prev.map(a => a.id === child.id ? {...a, status: e.target.value as any} : a))} 
                      className="text-xs border rounded p-1.5 focus:ring-1 focus:ring-brand-primary outline-none transition-all"
                    >
                      <option value="present">Keldi</option>
                      <option value="absent">Kelmadi</option>
                      <option value="present_no_meal">Keldi (ovqatlanmaydi)</option>
                    </select>
                  </div>
              ))}
             </div>
           </div>
         ))}
      </div>

      <div className="bg-brand-depth p-8 rounded-xl text-white shadow-xl">
        <h3 className="font-bold text-lg mb-6 uppercase tracking-wider">Kunlik Hisobot</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {Object.entries(stats).map(([k, v]) => (
            <div key={k} className="p-4 bg-white/10 rounded-lg text-center border border-white/5">
              <p className="text-[10px] uppercase font-bold text-white/60 mb-1">{k.replace('_', ' ')}</p>
              <p className="text-2xl font-bold">{v}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-brand-border shadow-sm">
        <div className="flex items-center gap-2 mb-4">
           <ClipboardCheck size={20} className="text-brand-primary" />
           <h3 className="font-bold text-lg">Arxiv</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-brand-muted border-b">
                <th className="pb-3 px-4">Sana</th>
                <th className="pb-3 px-4">Porsiya soni</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {archive.length > 0 ? archive.map((a, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4">{a.date}</td>
                  <td className="py-3 px-4 font-bold">{a.porsiya_soni}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={2} className="py-8 text-center text-brand-muted italic">Arxiv hali mavjud emas</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TeacherView;
