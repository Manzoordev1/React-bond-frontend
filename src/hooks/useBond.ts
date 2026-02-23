import { useState, useCallback, useRef } from 'react';
import {
  createBond,
  getAllBonds,
  deleteBond,
  clearAllBonds,
  updateBond,
} from '../api/bondApi';
import type { BondResult, BondRecord, CreateBondDto, UpdateBondDto } from './index';

export function useBond() {
  const [result, setResult]               = useState<BondResult | null>(null);
  const [history, setHistory]             = useState<BondRecord[]>([]);
  const [loading, setLoading]             = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [error, setError]                 = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  // ── Calculate (POST) ──────────────────────────────────────────────────────
  const calculate = useCallback(async (dto: CreateBondDto) => {
    if (abortRef.current) abortRef.current.abort();
    abortRef.current = new AbortController();

    setLoading(true);
    setError(null);
    try {
      const data = await createBond(dto);
      setResult(data);
    } catch (err: any) {
      if (err?.code === 'ERR_CANCELED') return;
      const msg = err?.response?.data?.message ?? err?.message ?? 'Calculation failed.';
      setError(Array.isArray(msg) ? msg.join(', ') : msg);
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Update existing record (PATCH) ────────────────────────────────────────
  const update = useCallback(async (id: number, dto: UpdateBondDto) => {
    setLoading(true);
    setError(null);
    try {
      const data = await updateBond(id, dto);
      setResult(data);
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? err?.message ?? 'Update failed.';
      setError(Array.isArray(msg) ? msg.join(', ') : msg);
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Load history (GET all) ────────────────────────────────────────────────
  const loadHistory = useCallback(async () => {
    setHistoryLoading(true);
    try {
      const data = await getAllBonds(100);
      setHistory(data);
    } catch {
      setHistory([]);
    } finally {
      setHistoryLoading(false);
    }
  }, []);

  // ── Delete one record ─────────────────────────────────────────────────────
  const deleteRecord = useCallback(async (id: number) => {
    await deleteBond(id);
    setHistory(prev => prev.filter(r => r.id !== id));
  }, []);

  // ── Clear all records ─────────────────────────────────────────────────────
  const clearAll = useCallback(async () => {
    await clearAllBonds();
    setHistory([]);
  }, []);

  return {
    result,
    history,
    loading,
    historyLoading,
    error,
    calculate,
    update,
    loadHistory,
    deleteRecord,
    clearAll,
  };
}
