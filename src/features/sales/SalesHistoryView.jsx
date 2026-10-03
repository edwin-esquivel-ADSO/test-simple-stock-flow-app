import React, { useState, useEffect } from 'react';
import { saleUseCase } from '../../application/use-cases/SaleUseCase.js';

export function SalesHistoryView() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSale, setSelectedSale] = useState(null);

  const loadSales = async () => {
    setLoading(true);
    try {
      const data = await saleUseCase.getSales(1, 50);
      setSales(data.items || []);
    } catch (err) {
      setError(err.message || 'Error al cargar ventas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSales();
  }, []);

  return (
    <div className="history-container">
      <h2>Historial de Ventas</h2>
      <p className="subtitle">Registro inmutable de transacciones completadas</p>

      {error && <div className="alert-error">{error}</div>}

      {loading ? (
        <div className="loading">Cargando transacciones...</div>
      ) : sales.length === 0 ? (
        <div className="empty-state">No hay ventas registradas aún.</div>
      ) : (
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID Venta</th>
                <th>Fecha y Hora</th>
                <th>Vendedor</th>
                <th>Líneas</th>
                <th>Total (COP)</th>
                <th>Detalle</th>
              </tr>
            </thead>
            <tbody>
              {sales.map((s) => (
                <tr key={s.id}>
                  <td><code>{s.id.substring(0, 8)}...</code></td>
                  <td>{new Date(s.soldAt).toLocaleString('es-CO')}</td>
                  <td><span className="badge-user">{s.soldByUsername}</span></td>
                  <td>{s.items.length} ítems</td>
                  <td><strong>${new Intl.NumberFormat('es-CO').format(s.total)}</strong></td>
                  <td>
                    <button className="btn btn-secondary btn-sm" onClick={() => setSelectedSale(s)}>
                      Ver
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedSale && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <h3>Detalle de Venta</h3>
            <p><strong>ID:</strong> {selectedSale.id}</p>
            <p><strong>Fecha:</strong> {new Date(selectedSale.soldAt).toLocaleString('es-CO')}</p>
            <p><strong>Vendedor:</strong> {selectedSale.soldByUsername}</p>

            <table className="modal-table">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Cant.</th>
                  <th>Precio Unit.</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {selectedSale.items.map((i) => (
                  <tr key={i.id}>
                    <td>{i.productName}</td>
                    <td>{i.quantity}</td>
                    <td>${new Intl.NumberFormat('es-CO').format(i.unitPrice)}</td>
                    <td>${new Intl.NumberFormat('es-CO').format(i.subtotal)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="modal-total">
              Total: <strong>${new Intl.NumberFormat('es-CO').format(selectedSale.total)} COP</strong>
            </div>

            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setSelectedSale(null)}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
