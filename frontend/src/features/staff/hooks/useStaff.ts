import { useState, useEffect, useCallback } from 'react';
import { staffApi } from '../api/staffApi';
import { Staff } from '../types/staff.types';
import { StaffFormValues } from '../schemas/staffForm.schema';

export const useStaff = () => {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStaff = useCallback(async () => {
    try {
      setLoading(true);
      const data = await staffApi.getAll();
      setStaff(data);
    } catch (error) {
      console.error('Failed to fetch staff:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStaff();
  }, [fetchStaff]);

  const createStaff = async (data: StaffFormValues) => {
    const result = await staffApi.create(data);
    await fetchStaff();
    return result;
  };

  const updateStaff = async (id: string, data: StaffFormValues) => {
    await staffApi.update(id, data);
    await fetchStaff();
  };

  const deleteStaff = async (id: string) => {
    await staffApi.delete(id);
    await fetchStaff();
  };

  return { staff, loading, createStaff, updateStaff, deleteStaff, refreshStaff: fetchStaff };
};
