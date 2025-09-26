// src/pages/RealtimeAnalytics.jsx
import React, { useEffect, useMemo, useState } from 'react';

export default function RealtimeAnalytics() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [err, setErr] = useState(null);
  const [today, setToday] = useState(new Date());

  const todayLabel = useMemo(() => {
    return new Intl.DateTimeFormat(undefined, {
      weekday: 'short',
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).format(today);
  }, [today]);

  useEffect(() => {
    const now = new Date();
    const nextMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0, 0);
    const ms = nextMidnight.getTime() - now.getTime();
    const t = setTimeout(() => setToday(new Date()), ms);
    return () => clearTimeout(t);
  }, [today]);

  const fetchData = async () => {
    setLoading(true);
    setErr(null);
    try {
      const r = await fetch('http://localhost:3001/api/realtime', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      });
      const json = await r.json();
      if (!r.ok || json.error) throw new Error(json.error || 'Request failed');
      setData(json);
    } catch (e) {
      setErr(String(e.message || e));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const grid = useMemo(() => {
    if (!data?.hourly_forecast) return [];
    const hours = data.hourly_forecast.slice(0, 24).map((v, i) => ({
      label: `${String(i + 1).padStart(2, '0')}h`,
      value: Number(v)
    }));
    const rows = [];
    const cols = 6;
    for (let i = 0; i < hours.length; i += cols) rows.push(hours.slice(i, i + cols));
    return rows;
  }, [data]);

  // Fintech + technical impacts returned as an array of lines
  const bucketPeakKp = (v) => {
    if (v < 4) {
      return {
        kp: '0 - 3', g: 'G0', level: 'Quiet / Calm',
        impact: [
          'Risk: low baseline.',
          'Premium: no event loading (≈ +0%).',
          'Terms: standard cover.',
          'Controls: routine monitoring only.'
        ]
      };
    }
    if (v < 5) {
      return {
        kp: '4', g: 'G0', level: 'Active / Unsettled',
        impact: [
          'Risk: mildly elevated.',
          'Premium: optional light loading (≈ +1%).',
          'Terms: unchanged.',
          'Controls: watchlist flag; no moratorium.'
        ]
      };
    }
    if (v < 6) {
      return {
        kp: '5', g: 'G1', level: 'Minor Storm',
        impact: [
          'Risk: noticeable.',
          'Premium: event loading ≈ +2–5%.',
          'Terms: add simple rider if needed.',
          'Controls: basic hardening → small credit.'
        ]
      };
    }
    if (v < 7) {
      return {
        kp: '6', g: 'G2', level: 'Moderate Storm',
        impact: [
          'Risk: significant; some correlation.',
          'Premium: ≈ +6–12%.',
          'Terms: higher deductible or sublimit.',
          'Controls: mitigation attestation required.'
        ]
      };
    }
    if (v < 8) {
      return {
        kp: '7', g: 'G3', level: 'Strong Storm',
        impact: [
          'Risk: high; cluster losses likely.',
          'Premium: ≈ +15–25%.',
          'Terms: raise attachment/retention; cap per‑occurrence.',
          'Ops: surge claims readiness.'
        ]
      };
    }
    if (v < 9) {
      return {
        kp: '8', g: 'G4', level: 'Severe Storm',
        impact: [
          'Risk: very high; systemic.',
          'Premium: ≈ +30–50%.',
          'Terms: event deductible or short waiting period.',
          'Ops: CAT protocol; stricter binding rules.'
        ]
      };
    }
    return {
      kp: '9', g: 'G5', level: 'Extreme Storm',
      impact: [
        'Risk: extreme tail.',
        'Premium: > +50% if offered.',
        'Terms: tight warranties/exclusions; possible bind pause.',
        'Ops: major‑event claims playbook.'
      ]
    };
  };

  const peak = Number(data?.peak_predicted_kp_index ?? 0);
  const mapped = bucketPeakKp(peak);

  const colorForKp = (v) => {
    if (v < 4)   return { bg: '#0f3a2a', text: '#d1fae5', border: '#14532d' };
    if (v < 5)   return { bg: '#16324a', text: '#dbeafe', border: '#1e3a8a' };
    if (v < 6)   return { bg: '#3b2f12', text: '#fde68a', border: '#92400e' };
    if (v < 7)   return { bg: '#3f1d1d', text: '#fecaca', border: '#7f1d1d' };
    if (v < 8)   return { bg: '#4a0f3a', text: '#fbcfe8', border: '#831843' };
    if (v < 9)   return { bg: '#4a0f13', text: '#fecaca', border: '#7f1d1d' };
    return         { bg: '#3b0b0b', text: '#ffe4e6', border: '#7f1d1d' };
  };

  const colors = {
    text: '#f9fafb', subtext: '#d1d5db', card: '#151821', cardBorder: '#2b2f3a',
    header: '#0f172a', headerText: '#e5e7eb', zebra: '#10131b',
    highlight: '#1f2937', highlightBorder: '#374151',
    buttonBg: '#111827', buttonText: '#f3f4f6', buttonBorder: '#374151',
    dateBadgeBg: '#0b1220', dateBadgeBorder: '#2b3a55'
  };

  const styles = {
    page: { padding: 24, maxWidth: 1200, margin: '0 auto', color: colors.text, background: '#0b0c10' },
    headerRow: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, gap: 12 },
    leftHeader: { display: 'flex', alignItems: 'center', gap: 12 },
    h2: { margin: 0, color: colors.text },
    dateBadge: { padding: '6px 10px', borderRadius: 999, background: colors.dateBadgeBg, border: `1px solid ${colors.dateBadgeBorder}`, color: colors.subtext, fontSize: 13, fontWeight: 700 },
    actions: { display: 'flex', alignItems: 'center', gap: 10 },
    btn: { padding: '8px 12px', borderRadius: 8, border: `1px solid ${colors.buttonBorder}`, background: colors.buttonBg, color: colors.buttonText, cursor: 'pointer' },
    error: { color: '#fca5a5', marginBottom: 16, fontWeight: 600 },

    section: { marginTop: 16 },
    tableBox: { overflowX: 'auto', background: colors.card, border: `1px solid ${colors.cardBorder}`, borderRadius: 12 },
    table: { width: '100%', borderCollapse: 'separate', borderSpacing: 0 },
    th: { textAlign: 'left', padding: '12px 14px', fontWeight: 700, fontSize: 14, background: colors.header, color: colors.headerText, position: 'sticky', top: 0, zIndex: 1, borderBottom: `1px solid ${colors.cardBorder}` },
    td: { padding: '12px 14px', fontSize: 15, borderBottom: `1px solid ${colors.cardBorder}`, color: colors.text },
    kpiLabel: { width: 260, color: colors.subtext, fontWeight: 600 },
    kpiValue: { color: colors.text, fontWeight: 700 },
    bulletList: { margin: 0, paddingLeft: 18 },
    bulletItem: { margin: '4px 0' }
  };

  return (
    <div style={styles.page}>
      <div style={styles.headerRow}>
        <div style={styles.leftHeader}>
          <h2 style={styles.h2}>Real-Time Analytics</h2>
          <div style={styles.dateBadge}>Today: {todayLabel}</div>
        </div>
        <div style={styles.actions}>
          <button onClick={fetchData} disabled={loading} style={styles.btn}>
            {loading ? 'Loading...' : 'Refresh'}
          </button>
        </div>
      </div>

      {err && <div style={styles.error}>Error: {err}</div>}

      {/* Peak and Premium */}
      {data && (
        <div style={styles.section}>
          <div style={styles.tableBox}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={{ ...styles.th, width: 280 }}>Metric</th>
                  <th style={styles.th}>Value</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ background: colors.zebra }}>
                  <td style={{ ...styles.td, ...styles.kpiLabel }}>Peak Kp</td>
                  <td style={{ ...styles.td, ...styles.kpiValue }}>{Number(data.peak_predicted_kp_index || 0).toFixed(2)}</td>
                </tr>
                <tr>
                  <td style={{ ...styles.td, ...styles.kpiLabel }}>Insurance Premium</td>
                  <td style={{ ...styles.td, ...styles.kpiValue }}>
                    {'$ ' + Intl.NumberFormat(undefined, { maximumFractionDigits: 0 }).format(Number(data.insurance_premium || 0))}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Single-row NOAA impact (for peak only) with multi-line bullets */}
      {data && (
        <div style={styles.section}>
          <div style={{ margin: '8px 0 6px', fontWeight: 800 }}>Predicted Kp-index Impact</div>
          <div style={styles.tableBox}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Predicted Kp-index</th>
                  <th style={styles.th}>NOAA G-Scale</th>
                  <th style={styles.th}>Storm Level</th>
                  <th style={styles.th}>Insurance impact</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ background: colors.highlight, outline: `2px solid ${colors.highlightBorder}`, outlineOffset: '-2px' }}>
                  <td style={styles.td}>{mapped.kp} (peak {peak.toFixed(2)})</td>
                  <td style={styles.td}>{mapped.g}</td>
                  <td style={{ ...styles.td, fontWeight: 700 }}>{mapped.level}</td>
                  <td style={styles.td}>
                    <ul style={styles.bulletList}>
                      {Array.isArray(mapped.impact) ? mapped.impact.map((line, i) => (
                        <li key={i} style={styles.bulletItem}>{line}</li>
                      )) : <li style={styles.bulletItem}>{mapped.impact}</li>}
                    </ul>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 24h Forecast with color-coded cells */}
      {data && (
        <div style={styles.section}>
          <div style={{ margin: '8px 0 6px', fontWeight: 800 }}>Hourly Forecast (24h)</div>
          <div style={styles.tableBox}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Hour</th>
                  <th style={styles.th}>Hour</th>
                  <th style={styles.th}>Hour</th>
                  <th style={styles.th}>Hour</th>
                  <th style={styles.th}>Hour</th>
                  <th style={styles.th}>Hour</th>
                </tr>
              </thead>
              <tbody>
                {grid.map((row, rIdx) => (
                  <tr key={rIdx} style={{ background: rIdx % 2 === 0 ? colors.card : colors.zebra }}>
                    {row.map((cell, cIdx) => {
                      const palette = colorForKp(cell.value);
                      return (
                        <td key={cIdx} style={styles.td}>
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              background: palette.bg,
                              color: palette.text,
                              border: `1px solid ${palette.border}`,
                              borderRadius: 8,
                              padding: '10px 10px'
                            }}
                          >
                            <span style={{ fontWeight: 600 }}>{cell.label}</span>
                            <span style={{ fontWeight: 800 }}>{cell.value.toFixed(2)}</span>
                          </div>
                        </td>
                      );
                    })}
                    {row.length < 6 &&
                      Array.from({ length: 6 - row.length }).map((_, fillerIdx) => (
                        <td key={`f${fillerIdx}`} style={styles.td} />
                      ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}