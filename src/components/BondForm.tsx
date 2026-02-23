import React, { useState, useEffect, useRef } from 'react';
import type { CreateBondDto, FormState } from '../hooks/index';

interface Props {
  onCalculate: (dto: CreateBondDto) => void;
  loading: boolean;
}

const DEFAULTS: FormState = {
  faceValue: '1000',
  couponRate: '5',
  marketPrice: '950',
  yearsToMaturity: '10',
  couponFrequency: '2',
};

function parseForm(f: FormState): CreateBondDto | null {
  const fv = parseFloat(f.faceValue);
  const cr = parseFloat(f.couponRate);
  const mp = parseFloat(f.marketPrice);
  const ym = parseFloat(f.yearsToMaturity);
  const freq = parseInt(f.couponFrequency) as 1 | 2;
  if ([fv, cr, mp, ym].some(isNaN) || fv <= 0 || cr <= 0 || mp <= 0 || ym <= 0) return null;
  return { faceValue: fv, couponRate: cr, marketPrice: mp, yearsToMaturity: ym, couponFrequency: freq };
}

export const BondForm: React.FC<Props> = ({ onCalculate, loading }) => {
  const [form, setForm] = useState<FormState>(DEFAULTS);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Live debounced recalculation — fires 500ms after user stops typing
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const dto = parseForm(form);
      if (dto) onCalculate(dto);
    }, 500);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [form]); // eslint-disable-line

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const dto = parseForm(form);
    if (dto) onCalculate(dto);
  };

  return (
    <form className="glass-card" onSubmit={onSubmit}>
      <div className="section-label">
        <span className="label-dot" />
        Bond Parameters
      </div>

      <div className="field-grid">
        <div className="field">
          <label>Face Value</label>
          <div className="input-wrap">
            <span className="sym">$</span>
            <input name="faceValue" type="number" value={form.faceValue} onChange={onChange} placeholder="1000" min="1" step="any" />
          </div>
        </div>

        <div className="field">
          <label>Coupon Rate</label>
          <div className="input-wrap">
            <input name="couponRate" type="number" value={form.couponRate} onChange={onChange} placeholder="5.00" min="0.01" max="100" step="0.01" />
            <span className="sym sym-right">%</span>
          </div>
        </div>

        <div className="field">
          <label>Market Price</label>
          <div className="input-wrap">
            <span className="sym">$</span>
            <input name="marketPrice" type="number" value={form.marketPrice} onChange={onChange} placeholder="950" min="1" step="any" />
          </div>
        </div>

        <div className="field">
          <label>Years to Maturity</label>
          <div className="input-wrap">
            <input name="yearsToMaturity" type="number" value={form.yearsToMaturity} onChange={onChange} placeholder="10" min="0.5" max="100" step="0.5" />
            <span className="sym sym-right">yr</span>
          </div>
        </div>

        <div className="field field-full">
          <label>Coupon Frequency</label>
          <div className="freq-toggle">
            {[{ val: '1', label: 'Annual' }, { val: '2', label: 'Semi-Annual' }].map(opt => (
              <button
                key={opt.val}
                type="button"
                className={`freq-btn ${form.couponFrequency === opt.val ? 'active' : ''}`}
                onClick={() => setForm(prev => ({ ...prev, couponFrequency: opt.val as '1' | '2' }))}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <button className="calc-btn" type="submit" disabled={loading}>
        {loading
          ? <><span className="spinner" /> Calculating…</>
          : <><span className="btn-icon">⟳</span> Calculate Bond</>
        }
      </button>
    </form>
  );
};
