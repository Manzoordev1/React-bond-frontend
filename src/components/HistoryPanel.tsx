import React, { useEffect, useState } from 'react';
import type { BondRecord } from '../hooks/index';

interface Props {
  history: BondRecord[];
  loading: boolean;
  onLoad: () => void;
  onDelete: (id: number) => void;
  onClearAll: () => void;
}

const money = (n: number) =>
  Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const statusConfig = {
  premium: { icon: '▲', cls: 'tag-green', label: 'Premium' },
  discount: { icon: '▼', cls: 'tag-red', label: 'Discount' },
  par: { icon: '●', cls: 'tag-gold', label: 'Par' },
};

export const HistoryPanel: React.FC<Props> = ({
  history, loading, onLoad, onDelete, onClearAll,
}) => {
  const [confirmClear, setConfirmClear] = useState(false);

  useEffect(() => { onLoad(); }, []); // eslint-disable-line

  // ✅ Fix: guard against undefined/null before .length or .map
  const safeHistory: BondRecord[] = Array.isArray(history) ? history : [];

  const handleClearAll = () => {
    if (confirmClear) { onClearAll(); setConfirmClear(false); }
    else { setConfirmClear(true); setTimeout(() => setConfirmClear(false), 3000); }
  };

  return (
    <div className="glass-card history-card">
      <div className="history-topbar">
        <div className="section-label" style={{ marginBottom: 0 }}>
          <span className="label-dot" />
          Calculation History
          <span className="table-count">{safeHistory.length} records</span>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="refresh-btn" onClick={onLoad} disabled={loading}>
            {loading ? '…' : '↻ Refresh'}
          </button>
          {safeHistory.length > 0 && (
            <button
              className={`clear-btn ${confirmClear ? 'confirm' : ''}`}
              onClick={handleClearAll}
            >
              {confirmClear ? '⚠ Confirm Clear All' : 'Clear All'}
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="history-empty"><div className="loading-ring" /><p>Loading…</p></div>
      ) : safeHistory.length === 0 ? (
        <div className="history-empty">
          <p className="empty-icon">◎</p>
          <p>No history yet. Run a calculation to save it.</p>
        </div>
      ) : (
        <div className="history-list">
          {safeHistory.map(rec => {
            const sc = statusConfig[rec.pricingStatus];
            return (
              <div key={rec.id} className="history-row">
                <div className="history-id">#{rec.id}</div>
                <div className="history-body">
                  <div className="history-main">
                    <span className="hval">FV <strong>${money(rec.faceValue)}</strong></span>
                    <span className="hsep">·</span>
                    <span className="hval">Rate <strong>{Number(rec.couponRate).toFixed(2)}%</strong></span>
                    <span className="hsep">·</span>
                    <span className="hval">Price <strong>${money(rec.marketPrice)}</strong></span>
                    <span className="hsep">·</span>
                    <span className="hval">{rec.couponFrequency === 2 ? 'Semi-Annual' : 'Annual'}</span>
                  </div>
                  <div className="history-results">
                    <span className="hval">YTM <strong className="clr-teal">{Number(rec.ytm).toFixed(4)}%</strong></span>
                    <span className="hsep">·</span>
                    <span className="hval">CY <strong className="clr-gold">{Number(rec.currentYield).toFixed(4)}%</strong></span>
                    <span className="hsep">·</span>
                    <span className={`pricing-tag sm ${sc.cls}`}>{sc.icon} {sc.label}</span>
                    <span className="hsep">·</span>
                    <span className="hdate">{new Date(rec.createdAt).toLocaleString()}</span>
                  </div>
                </div>
                <button className="del-btn" onClick={() => onDelete(rec.id)} title="Delete">✕</button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};