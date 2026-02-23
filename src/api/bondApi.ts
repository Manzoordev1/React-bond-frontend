import axios from 'axios';
import type { ApiResponse, BondResult, BondRecord, CreateBondDto, UpdateBondDto } from '../hooks/index';


const http = axios.create({
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});


export const createBond = async (dto: CreateBondDto): Promise<BondResult> => {
  const { data } = await http.post<ApiResponse<BondResult>>('/api/bond', dto);
  return data.data;
};


export const getAllBonds = async (limit = 50): Promise<BondRecord[]> => {
  const { data } = await http.get<ApiResponse<BondRecord[]>>('/api/bond', {
    params: { limit },
  });
  return Array.isArray(data.data) ? data.data : [];
};

export const getBondById = async (id: number): Promise<BondRecord> => {
  const { data } = await http.get<ApiResponse<BondRecord>>(`/api/bond/${id}`);
  return data.data;
};


export const updateBond = async (id: number, dto: UpdateBondDto): Promise<BondResult> => {
  const { data } = await http.patch<ApiResponse<BondResult>>(`/api/bond/${id}`, dto);
  return data.data;
};


export const deleteBond = async (id: number): Promise<void> => {
  await http.delete(`/api/bond/${id}`);
};


export const clearAllBonds = async (): Promise<void> => {
  await http.delete('/api/bond');
};