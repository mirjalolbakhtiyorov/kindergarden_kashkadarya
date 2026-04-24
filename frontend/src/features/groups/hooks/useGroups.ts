import { useState, useEffect, useCallback } from 'react';
import { groupsApi } from '../api/groupsApi';
import { Group } from '../types/group.types';
import { GroupFormValues } from '../schemas/groupForm.schema';

export const useGroups = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchGroups = useCallback(async () => {
    try {
      setLoading(true);
      const data = await groupsApi.getAll();
      setGroups(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch groups');
    } finally {
      setLoading(false);
    }
  }, []);

  const createGroup = async (data: GroupFormValues) => {
    try {
      setLoading(true);
      await groupsApi.create(data);
      await fetchGroups();
    } catch (err: any) {
      alert('Xatolik: ' + (err.response?.data?.error || err.message));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateGroup = async (id: string, data: GroupFormValues) => {
    try {
      setLoading(true);
      await groupsApi.update(id, data);
      await fetchGroups();
    } catch (err: any) {
      alert('Xatolik: ' + (err.response?.data?.error || err.message));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteGroup = async (id: string) => {
    if (window.confirm('Haqiqatdan ham ushbu guruhni o\'chirmoqchimisiz?')) {
      try {
        setLoading(true);
        await groupsApi.delete(id);
        await fetchGroups();
        setError(null);
      } catch (err: any) {
        const msg = err.response?.data?.error || err.message || 'O‘chirishda xatolik';
        if (msg.includes('FOREIGN KEY constraint failed')) {
          alert('Ushbu guruhni o‘chirib bo‘lmaydi, chunki unda bolalar yoki xodimlar mavjud.');
        } else {
          alert('Xatolik: ' + msg);
        }
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  return { groups, loading, error, createGroup, updateGroup, deleteGroup, refetch: fetchGroups };
};
