import React, { useState } from 'react';
import { reportUseCase } from '../../application/use-cases/ReportUseCase.js';

export function ReportView() {
  const today = new Date();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);

  const [from, setFrom] = useState(firstDay.toISOString().substring(0, 10));
  const [to, setTo] = useState(today.toISOString().substring(0, 10));
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGenerate = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const fromIso = `${from}T00:00:00Z`;
      const toIso = `${to}T23:59:59Z`;
      const data = await reportUseCase.getSalesReport(fromIso, toIso);
      setReport(data);
    } catch (err) {
      setError(err.message || 'Error al generar reporte');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="report-container">
      <h2>Reporte Consolidado de Ventas</h2>
      <p className="subtitle">Consulta inmutable agrupada por producto y categoría congelada</p>

      <form onSubmit={handleGenerate} className="report-form">
        <div className="form-row">
          <div className="form-group">
            <label>Desde (Fecha Inicial)</label>
            <input
              type="date"
              required
              value={from}
              onChange={(e) => setFrom(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Hasta (Fecha Final)</label>
            <input
              type="date"
              required
              value={to}
              onChange={(e) => setTo(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary btn-generate" disabled={loading}>
            {loading ? 'Consultando...' : 'Generar Reporte'}
          </button>
        </div>
      </form>

      {error && <div className="alert-error">{error}</div>}

      {report && (
        <div className="report-results">
          <div className="kpi-grid">
            <div className="kpi-card">
              <span className="kpi-label">Ventas en el período</span>
              <strong className="kpi-value">{report.salesCount}</strong>
            </div>
            <div className="kpi-card">
              <span className="kpi-label">Total Facturado</span>
              <strong className="kpi-value">
                ${new Intl.NumberFormat('es-CO').format(report.grandTotal)} {report.currency}
              </strong>
            </div>
          </div>

          <h3>Desglose por Producto (Ordenado por Facturación)</h3>
          {report.rows.length === 0 ? (
            <div className="empty-state">No se registraron ventas en el rango seleccionado.</div>
          ) : (
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Categoría</th>
                    <th>Unidades Vendidas</th>
                    <th>Facturación ({report.currency})</th>
                  </tr>
                </thead>
                <tbody>
                  {report.rows.map((row) => (
                    <tr key={`${row.productId}-${row.categoryName}`}>
                      <td><strong>{row.productName}</strong></td>
                      <td><span className="badge-cat">{row.categoryName}</span></td>
                      <td>{row.unitsSold}</td>
                      <td><strong>${new Intl.NumberFormat('es-CO').format(row.revenue)}</strong></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
