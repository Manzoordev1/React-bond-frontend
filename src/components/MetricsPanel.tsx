import React from 'react';
import type { BondResult } from '../hooks/index';

interface Props {
  result: BondResult | null;
  loading: boolean;
}

const money = (n: number) =>
  n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const pricingConfig = {
  premium: { label: 'Trading at Premium', icon: '▲', cls: 'tag-green' },
  discount: { label: 'Trading at Discount', icon: '▼', cls: 'tag-red' },
  par: { label: 'Trading at Par', icon: '●', cls: 'tag-gold' },
};

export const MetricsPanel: React.FC<Props> = ({ result, loading }) => {
  if (!result && !loading) {
    return (
      <div className="glass-card metrics-placeholder">
        <div className="section-label"><span className="label-dot" />Analytics Output</div>
        <div className="placeholder-body">
          <div className="placeholder-icon">◎</div>
          <p>Enter bond parameters to<br />see live analytics</p>
        </div>
      </div>
    );
  }

  if (loading && !result) {
    return (
      <div className="glass-card metrics-placeholder">
        <div className="section-label"><span className="label-dot" />Analytics Output</div>
        <div className="placeholder-body">
          <div className="loading-ring" />
          <p>Computing…</p>
        </div>
      </div>
    );
  }

  if (!result) return null;

  const { currentYield, ytm, totalInterest, pricingStatus, pricingDiff, id, savedAt } = result;
  const pc = pricingConfig[pricingStatus];

  return (
    <div className="glass-card">
      <div className="section-label">
        <span className="label-dot" />
        Analytics Output
        {id && <span className="saved-pill">✓ Saved #{id}</span>}
      </div>

      <div className="metrics-grid">
        <div className="metric-card">
          <p className="metric-label">Current Yield</p>
          <p className="metric-value clr-gold">{currentYield.toFixed(4)}<span className="metric-unit">%</span></p>
          <p className="metric-sub">Annual coupon / Market price</p>
        </div>

        <div className="metric-card">
          <p className="metric-label">Yield to Maturity</p>
          <p className="metric-value clr-teal">{ytm.toFixed(4)}<span className="metric-unit">%</span></p>
          <p className="metric-sub">Annualised, Newton-Raphson</p>
        </div>

        <div className="metric-card">
          <p className="metric-label">Total Interest Earned</p>
          <p className="metric-value clr-text">${money(totalInterest)}</p>
          <p className="metric-sub">Over full life of bond</p>
        </div>

        <div className="metric-card">
          <p className="metric-label">Pricing Status</p>
          <span className={`pricing-tag ${pc.cls}`}>
            {pc.icon} {pc.label}
          </span>
          <p className="metric-sub">
            {pricingDiff >= 0 ? '+' : ''}${money(pricingDiff)} vs face value
          </p>
        </div>
      </div>

      {savedAt && (
        <p className="saved-ts">Saved at {new Date(savedAt).toLocaleTimeString()}</p>
      )}
    </div>
  );
};
