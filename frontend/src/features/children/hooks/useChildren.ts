import { useState, useEffect, useCallback } from 'react';
import { childrenApi } from '../api/childrenApi';
import { Child } from '../types/child.types';
import { ChildFormValues } from '../schemas/childForm.schema';

export const useChildren = () => {
  const [children, setChildren] = useState<Child[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchChildren = useCallback(async () => {
    try {
      setLoading(true);
      const data = await childrenApi.getAll();
      setChildren(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch children');
    } finally {
      setLoading(false);
    }
  }, []);

  const createChild = async (data: ChildFormValues) => {
    try {
      setLoading(true);
      await childrenApi.create(data);
      await fetchChildren(); // Refetch
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to create child');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateChild = async (id: string, data: ChildFormValues) => {
    try {
      setLoading(true);
      await childrenApi.update(id, data);
      await fetchChildren();
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to update child');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteChild = async (id: string) => {
    try {
      if (window.confirm('Haqiqatdan ham ushbu bolani o\'chirmoqchimisiz?')) {
        setLoading(true);
        await childrenApi.delete(id);
        await fetchChildren();
        setError(null);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to delete child');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChildren();
  }, [fetchChildren]);

  return {
    children,
    loading,
    error,
    createChild,
    updateChild,
    deleteChild,
    refetch: fetchChildren
  };
};
