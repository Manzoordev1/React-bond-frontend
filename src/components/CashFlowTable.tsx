import React, { useState } from 'react';
import type { CashFlowPeriod } from '../hooks/index';

interface Props {
  cashFlows: CashFlowPeriod[];
  frequency: number;
}

const money = (n: number) =>
  n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const PAGE_SIZE = 10;

export const CashFlowTable: React.FC<Props> = ({ cashFlows, frequency }) => {
  const [page, setPage] = useState(0);
  const totalPages = Math.ceil(cashFlows.length / PAGE_SIZE);
  const rows = cashFlows.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  const periodLabel = (p: number) =>
    frequency === 2
      ? p % 2 === 0 ? `Year ${p / 2}` : `Year ${Math.ceil(p / 2)}-H1`
      : `Year ${p}`;

  return (
    <div className="glass-card table-card">
      <div className="table-header-row">
        <div className="section-label" style={{ marginBottom: 0 }}>
          <span className="label-dot" />
          Cash Flow Schedule
          <span className="table-count">{cashFlows.length} periods</span>
        </div>
        {totalPages > 1 && (
          <div className="pagination">
            <button className="pg-btn" onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}>←</button>
            <span className="pg-info">{page + 1} / {totalPages}</span>
            <button className="pg-btn" onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page === totalPages - 1}>→</button>
          </div>
        )}
      </div>

      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Period</th>
              <th>Payment Date</th>
              <th>Coupon</th>
              <th>Principal</th>
              <th>Cumulative Interest</th>
              <th>Remaining Principal</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(row => {
              const isFinal = row.remainingPrincipal === 0;
              return (
                <tr key={row.period} className={isFinal ? 'row-final' : ''}>
                  <td className="td-num">{row.period}</td>
                  <td className="td-period">{periodLabel(row.period)}</td>
                  <td className="td-date">{row.paymentDate}</td>
                  <td className="td-coupon">${money(row.couponPayment)}</td>
                  <td className={isFinal ? 'td-principal-final' : 'td-muted'}>${money(row.principalRepaid)}</td>
                  <td className="td-cumul">${money(row.cumulativeInterest)}</td>
                  <td className={isFinal ? 'td-muted' : ''}>${money(row.remainingPrincipal)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
