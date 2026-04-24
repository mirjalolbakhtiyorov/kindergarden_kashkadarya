import React, { useState } from 'react';
import { useGroups } from '../hooks/useGroups';
import { GroupFormModal } from './GroupFormModal';
import { Group } from '../types/group.types';

export const GroupsList: React.FC = () => {
  const { groups, loading, createGroup, updateGroup, deleteGroup } = useGroups();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<Group | undefined>(undefined);

  if (loading) return <div className="p-8 text-center text-brand-muted font-bold">Yuklanmoqda...</div>;

  const handleCreate = () => {
    setSelectedGroup(undefined);
    setIsModalOpen(true);
  };

  const handleEdit = (group: Group) => {
    setSelectedGroup(group);
    setIsModalOpen(true);
  };

  return (
    <div className="p-8">
       <button onClick={handleCreate} className="bg-brand-primary text-white px-6 py-3 rounded-xl font-bold mb-6 shadow-lg shadow-brand-primary/10">+ Yangi guruh yaratish</button>
       
       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {groups.length === 0 ? (
            <div className="col-span-2 py-10 text-center text-brand-muted font-bold">Guruhlar mavjud emas.</div>
          ) : (
            groups.map(group => (
              <div key={group.id} className="p-4 bg-slate-50 rounded-2xl border border-brand-border flex items-center justify-between group hover:border-brand-primary transition-all">
                 <div>
                    <span className="font-black text-brand-depth block">{group.name}</span>
                    <p className="text-[10px] text-brand-slate uppercase font-bold tracking-wider mt-0.5">
                      {group.teacher_name} | {group.capacity} o'rin | {group.age_limit}
                    </p>
                 </div>
                 <div className="flex gap-4">
                   <button 
                     onClick={() => handleEdit(group)} 
                     className="text-brand-primary text-[10px] font-black uppercase hover:bg-brand-primary/10 px-2 py-1 rounded transition-all"
                   >
                     Tahrirlash
                   </button>
                   <button 
                     onClick={() => deleteGroup(group.id)} 
                     className="text-rose-500 text-[10px] font-black uppercase hover:bg-rose-50 px-2 py-1 rounded transition-all"
                   >
                     O‘chirish
                   </button>
                 </div>
              </div>
            ))
          )}
       </div>

       {isModalOpen && (
         <GroupFormModal 
           group={selectedGroup}
           onClose={() => setIsModalOpen(false)}
           onSubmit={async (data) => {
             if (selectedGroup) {
               await updateGroup(selectedGroup.id, data);
             } else {
               await createGroup(data);
             }
           }}
         />
       )}
    </div>
  );
};
