// ─── Request DTOs (match NestJS CreateBondDto) ───────────────────────────────

export interface CreateBondDto {
  faceValue: number;
  couponRate: number;      // percentage e.g. 5.00
  marketPrice: number;
  yearsToMaturity: number;
  couponFrequency: 1 | 2; // 1 = annual, 2 = semi-annual
}

export interface UpdateBondDto {
  faceValue?: number;
  couponRate?: number;
  marketPrice?: number;
  yearsToMaturity?: number;
  couponFrequency?: 1 | 2;
}

// ─── Response types (match NestJS BondResult) ─────────────────────────────────

export interface CashFlowPeriod {
  period: number;
  paymentDate: string;
  couponPayment: number;
  principalRepaid: number;
  cumulativeInterest: number;
  remainingPrincipal: number;
}

export interface BondResult {
  id: number;
  savedAt: string;
  inputs: CreateBondDto;
  currentYield: number;
  ytm: number;
  totalInterest: number;
  pricingStatus: 'premium' | 'discount' | 'par';
  pricingDiff: number;
  cashFlows: CashFlowPeriod[];
}

// ─── Bond entity from DB (GET /api/bond) ──────────────────────────────────────

export interface BondRecord {
  id: number;
  faceValue: number;
  couponRate: number;
  marketPrice: number;
  yearsToMaturity: number;
  couponFrequency: number;
  currentYield: number;
  ytm: number;
  totalInterest: number;
  pricingStatus: 'premium' | 'discount' | 'par';
  createdAt: string;
}

// ─── API response wrappers ────────────────────────────────────────────────────

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  count?: number;
}

// ─── Form state ───────────────────────────────────────────────────────────────

export interface FormState {
  faceValue: string;
  couponRate: string;
  marketPrice: string;
  yearsToMaturity: string;
  couponFrequency: '1' | '2';
}

export type ActiveTab = 'calculator' | 'history';
