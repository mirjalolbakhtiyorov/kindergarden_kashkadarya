import React, { useState, useMemo } from 'react';
import { 
  Stethoscope, 
  Save, 
  Archive 
} from 'lucide-react';
import { Group } from '../../types';

interface NurseViewProps {
  groups: Group[];
}

const NurseView: React.FC<NurseViewProps> = ({ groups }) => {
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [dietFlags, setDietFlags] = useState<Record<number, boolean>>({});
  const [permissionFlags, setPermissionFlags] = useState<Record<number, boolean>>({});

  const handleDietToggle = (childId: number) => {
    setDietFlags(prev => ({ ...prev, [childId]: !prev[childId] }));
  };

  const handlePermissionToggle = (childId: number) => {
    setPermissionFlags(prev => ({ ...prev, [childId]: !prev[childId] }));
  };

  const handleSave = () => {
    alert("Ma'lumotlar saqlandi va arxivga joylandi!");
  };

  const groupData = groups.find(g => g.name === selectedGroup);

  const stats = useMemo(() => {
    if (!groupData) return { total: 0, dietCount: 0, noDietCount: 0 };
    const total = groupData.children.length;
    const dietCount = Object.values(dietFlags).filter(Boolean).length;
    return {
        total,
        dietCount,
        noDietCount: total - dietCount
    };
  }, [dietFlags, groupData]);

  if (!selectedGroup || !groupData) {
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

  return (
    <div className="p-8 animate-in fade-in space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-xl border border-brand-border gap-4">
        <button onClick={() => setSelectedGroup(null)} className="text-brand-muted hover:text-brand-depth font-bold text-sm flex items-center gap-2"><Stethoscope size={16} /> Guruhlar</button>
        <h2 className="text-xl font-bold">Guruh: "{groupData.name}" - Tibbiy monitoring</h2>
        <div className="flex gap-2 w-full md:w-auto">
            <button onClick={handleSave} className="flex-1 md:flex-none justify-center bg-brand-emerald text-white font-bold px-4 py-2 rounded-lg flex items-center gap-2"><Save size={16}/> Saqlash</button>
            <button onClick={handleSave} className="flex-1 md:flex-none justify-center bg-brand-primary text-white font-bold px-4 py-2 rounded-lg flex items-center gap-2"><Archive size={16}/> Arxivlash</button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-brand-border shadow-sm overflow-x-auto">
        <table className="w-full text-sm min-w-[800px]">
          <thead>
            <tr className="text-left text-xs text-brand-muted border-b">
              <th className="pb-3 px-4">Ism</th>
              <th className="pb-3 px-4">Allergiya</th>
              <th className="pb-3 px-4">Parhez</th>
              <th className="pb-3 px-4 text-center">Maxsus parhez</th>
              <th className="pb-3 px-4">Ruxsat holati</th>
              <th className="pb-3 px-4">Ruxsat etilgan mahsulotlar</th>
            </tr>
          </thead>
          <tbody>
            {groupData.children.map(c => (
              <tr key={c.id} className="border-b last:border-0 hover:bg-slate-50 transition-colors">
                <td className="py-4 px-4 font-bold text-brand-depth">{c.name}</td>
                <td className="py-4 px-4">{c.allergy}</td>
                <td className="py-4 px-4">{c.diet}</td>
                <td className="py-4 px-4 text-center">
                    <input type="checkbox" checked={!!dietFlags[c.id]} onChange={() => handleDietToggle(c.id)} className="accent-brand-emerald w-5 h-5 cursor-pointer" />
                </td>
                <td className="py-4 px-4">
                    <select value={permissionFlags[c.id] ? 'allowed' : 'not_allowed'} onChange={(e) => handlePermissionToggle(c.id)} className="text-xs border rounded p-1 outline-none focus:ring-1 focus:ring-brand-primary">
                        <option value="allowed">Ruxsat beriladi</option>
                        <option value="not_allowed">Ruxsat yo‘q</option>
                    </select>
                </td>
                <td className="py-4 px-4 text-xs">
                  <input type="text" placeholder="Mahsulotlarni kiriting..." className="border rounded p-1 w-full outline-none focus:ring-1 focus:ring-brand-primary" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-brand-depth p-8 rounded-xl text-white shadow-xl">
        <h3 className="font-bold text-lg mb-4 uppercase tracking-wider">Yakuniy natijalar</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 bg-white/10 rounded-lg text-center"><p className="text-[10px] uppercase font-bold text-white/60">Guruhdagi bolalar</p><p className="text-2xl font-bold">{stats.total}</p></div>
          <div className="p-4 bg-white/10 rounded-lg text-center"><p className="text-[10px] uppercase font-bold text-white/60">Parhezli ovqat</p><p className="text-2xl font-bold">{stats.dietCount}</p></div>
          <div className="p-4 bg-white/10 rounded-lg text-center"><p className="text-[10px] uppercase font-bold text-white/60">Parhezsiz ovqat</p><p className="text-2xl font-bold">{stats.noDietCount}</p></div>
        </div>
      </div>
    </div>
  );
};

export default NurseView;
