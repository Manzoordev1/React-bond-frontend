// import React, { useState } from 'react';
import { BondForm } from './components/BondForm';
import { MetricsPanel } from './components/MetricsPanel';
import { CashFlowTable } from './components/CashFlowTable';
import { HistoryPanel } from './components/HistoryPanel';
import { useBond } from './hooks/useBond';
import type { ActiveTab, CreateBondDto } from './hooks/index';

export default function App() {
  const [tab, setTab] = useState<ActiveTab>('calculator');

  const {
    result, history, loading, historyLoading, error,
    calculate, loadHistory, deleteRecord, clearAll,
  } = useBond();

  const handleCalculate = (dto: CreateBondDto) => calculate(dto);

  return (
    <div className="app-shell">

      {/* ── Background orbs ── */}
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      <div className="app-inner">

        {/* ── Header ── */}
        <header className="app-header">
          <div className="header-eyebrow">Fixed Income Analytics</div>
          <h1 className="app-title">
            Bond<em>Calc</em>
          </h1>
          <p className="app-subtitle">Yield · YTM · Cash Flow · Pricing Analysis</p>
        </header>

        {/* ── Tabs ── */}
        <nav className="tab-bar">
          <button
            className={`tab-item ${tab === 'calculator' ? 'tab-active' : ''}`}
            onClick={() => setTab('calculator')}
          >
            <span className="tab-icon">◈</span> Calculator
          </button>
          <button
            className={`tab-item ${tab === 'history' ? 'tab-active' : ''}`}
            onClick={() => { setTab('history'); }}
          >
            <span className="tab-icon">◉</span> History
          </button>
        </nav>

        {/* ── Error Banner ── */}
        {error && (
          <div className="error-bar">
            <span>⚠</span> {error}
          </div>
        )}

        {/* ── Calculator Tab ── */}
        {tab === 'calculator' && (
          <>
            <div className="two-col">
              <BondForm onCalculate={handleCalculate} loading={loading} />
              <MetricsPanel result={result} loading={loading} />
            </div>

            {result && (
              <CashFlowTable
                cashFlows={result.cashFlows}
                frequency={result.inputs.couponFrequency}
              />
            )}
          </>
        )}

        {/* ── History Tab ── */}
        {tab === 'history' && (
          <HistoryPanel
            history={history}
            loading={historyLoading}
            onLoad={loadHistory}
            onDelete={deleteRecord}
            onClearAll={clearAll}
          />
        )}

      </div>
    </div>
  );
}
