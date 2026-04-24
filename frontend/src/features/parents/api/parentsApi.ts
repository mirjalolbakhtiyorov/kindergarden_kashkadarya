import axios from 'axios';
import { ParentPortalUser } from '../types/parentPortal.types';

const API_URL = 'http://127.0.0.1:3001/api/parents';

export const parentsApi = {
  getAll: async (): Promise<ParentPortalUser[]> => {
    const res = await axios.get(API_URL);
    return res.data;
  },
  update: async (id: string, data: any): Promise<void> => {
    await axios.put(`${API_URL}/${id}`, data);
  },
  delete: async (id: string): Promise<void> => {
    await axios.delete(`${API_URL}/${id}`);
  }
};
