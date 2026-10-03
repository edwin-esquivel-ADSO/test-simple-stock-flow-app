import React, { useState, useEffect } from 'react';
import { authUseCase } from './application/use-cases/AuthUseCase.js';
import { Cart } from './domain/model/Cart.js';
import { LoginView } from './features/auth/LoginView.jsx';
import { CatalogView } from './features/catalog/CatalogView.jsx';
import { CartView } from './features/cart/CartView.jsx';
import { SalesHistoryView } from './features/sales/SalesHistoryView.jsx';
import { ReportView } from './features/reports/ReportView.jsx';

export default function App() {
  const [user, setUser] = useState(authUseCase.getCurrentUser());
  const [activeTab, setActiveTab] = useState('catalog');
  const [cart, setCart] = useState(new Cart([]));

  useEffect(() => {
    const handleUnauthorized = () => {
      setUser(null);
    };
    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, []);

  const handleLoginSuccess = (userData) => {
    setUser({
      username: userData.username,
      role: userData.role,
    });
  };

  const handleLogout = () => {
    authUseCase.logout();
    setUser(null);
    setCart(new Cart([]));
  };

  const handleAddToCart = (product) => {
    setCart(prev => prev.addItem(product, 1));
  };

  const handleUpdateQuantity = (productId, qty) => {
    setCart(prev => prev.updateQuantity(productId, qty));
  };

  const handleRemoveItem = (productId) => {
    setCart(prev => prev.removeItem(productId));
  };

  const handleClearCart = () => {
    setCart(new Cart([]));
  };

  if (!user) {
    return <LoginView onLoginSuccess={handleLoginSuccess} />;
  }

  const cartItemCount = cart.items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <div className="app-layout">
      <header className="app-header">
        <div className="container header-content">
          <div className="logo">
            <span className="logo-icon">📦</span>
            <h1>Simple Stock Flow</h1>
          </div>

          <nav className="main-nav">
            <button
              className={`nav-btn ${activeTab === 'catalog' ? 'active' : ''}`}
              onClick={() => setActiveTab('catalog')}
            >
              Catálogo
            </button>
            <button
              className={`nav-btn ${activeTab === 'cart' ? 'active' : ''}`}
              onClick={() => setActiveTab('cart')}
            >
              Carrito {cartItemCount > 0 && <span className="cart-badge">{cartItemCount}</span>}
            </button>
            <button
              className={`nav-btn ${activeTab === 'sales' ? 'active' : ''}`}
              onClick={() => setActiveTab('sales')}
            >
              Historial
            </button>
            <button
              className={`nav-btn ${activeTab === 'reports' ? 'active' : ''}`}
              onClick={() => setActiveTab('reports')}
            >
              Reportes
            </button>
          </nav>

          <div className="user-profile">
            <span className="user-info">
              {user.username} <span className="role-tag">{user.role}</span>
            </span>
            <button className="btn btn-secondary btn-sm" onClick={handleLogout}>
              Salir
            </button>
          </div>
        </div>
      </header>

      <main className="app-main">
        <div className="container">
          {activeTab === 'catalog' && (
            <CatalogView user={user} onAddToCart={handleAddToCart} />
          )}
          {activeTab === 'cart' && (
            <CartView
              cart={cart}
              onUpdateQuantity={handleUpdateQuantity}
              onRemoveItem={handleRemoveItem}
              onClearCart={handleClearCart}
              onSaleCompleted={() => setActiveTab('sales')}
            />
          )}
          {activeTab === 'sales' && <SalesHistoryView />}
          {activeTab === 'reports' && <ReportView />}
        </div>
      </main>
    </div>
  );
}
