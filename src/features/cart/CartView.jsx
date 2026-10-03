import React, { useState } from 'react';
import { saleUseCase } from '../../application/use-cases/SaleUseCase.js';

export function CartView({ cart, onUpdateQuantity, onRemoveItem, onClearCart, onSaleCompleted }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const total = cart.getTotal();

  const handleCheckout = async () => {
    if (cart.items.length === 0) return;
    setError(null);
    setLoading(true);

    try {
      const sale = await saleUseCase.registerSale(cart.items);
      alert(`¡Venta registrada con éxito!\nID: ${sale.id}\nTotal: $${new Intl.NumberFormat('es-CO').format(sale.total)} COP`);
      onClearCart();
      if (onSaleCompleted) onSaleCompleted();
    } catch (err) {
      setError(err.message || 'Error al procesar la venta');
    } finally {
      setLoading(false);
    }
  };

  if (cart.items.length === 0) {
    return (
      <div className="cart-empty">
        <span className="empty-icon">🛒</span>
        <h3>El carrito está vacío</h3>
        <p>Agrega productos desde el catálogo para iniciar una venta.</p>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h2>Punto de Venta / Carrito</h2>

      {error && <div className="alert-error">{error}</div>}

      <div className="cart-table-wrapper">
        <table className="cart-table">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Precio Unit.</th>
              <th>Cantidad</th>
              <th>Subtotal</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {cart.items.map((item) => {
              const subtotal = item.product.price * item.quantity;
              return (
                <tr key={item.product.id}>
                  <td>
                    <strong>{item.product.name}</strong>
                    <div className="item-cat">{item.product.categoryName}</div>
                  </td>
                  <td>${new Intl.NumberFormat('es-CO').format(item.product.price)}</td>
                  <td>
                    <div className="qty-control">
                      <button
                        className="btn-qty"
                        onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        className="btn-qty"
                        onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                        disabled={item.quantity >= item.product.stock}
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td>${new Intl.NumberFormat('es-CO').format(subtotal)}</td>
                  <td>
                    <button
                      className="btn-remove"
                      onClick={() => onRemoveItem(item.product.id)}
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="cart-summary">
        <div className="total-row">
          <span>Total a Pagar:</span>
          <strong>{total.format()}</strong>
        </div>
        <div className="cart-actions">
          <button className="btn btn-secondary" onClick={onClearCart} disabled={loading}>
            Vaciar Carrito
          </button>
          <button className="btn btn-primary btn-lg" onClick={handleCheckout} disabled={loading}>
            {loading ? 'Procesando Venta...' : 'Completar Venta'}
          </button>
        </div>
      </div>
    </div>
  );
}
