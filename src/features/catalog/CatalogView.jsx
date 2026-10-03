import React, { useState, useEffect } from 'react';
import { catalogUseCase } from '../../application/use-cases/CatalogUseCase.js';

export function CatalogView({ user, onAddToCart }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCat, setSelectedCat] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Admin create product modal state
  const [showModal, setShowModal] = useState(false);
  const [newProdName, setNewProdName] = useState('');
  const [newProdPrice, setNewProdPrice] = useState('');
  const [newProdStock, setNewProdStock] = useState('');
  const [newProdCat, setNewProdCat] = useState('');

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [cats, prods] = await Promise.all([
        catalogUseCase.getCategories(),
        catalogUseCase.getProducts({ categoryId: selectedCat || undefined }),
      ]);
      setCategories(cats || []);
      setProducts(prods.items || []);
      if (!newProdCat && cats && cats.length > 0) {
        setNewProdCat(cats[0].id);
      }
    } catch (err) {
      setError(err.message || 'Error al cargar catálogo');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedCat]);

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    try {
      await catalogUseCase.createProduct({
        name: newProdName,
        price: parseFloat(newProdPrice),
        stock: parseInt(newProdStock, 10),
        categoryId: newProdCat,
      });
      setShowModal(false);
      setNewProdName('');
      setNewProdPrice('');
      setNewProdStock('');
      loadData();
    } catch (err) {
      alert(err.message || 'Error al crear producto');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Dar de baja este producto?')) return;
    try {
      await catalogUseCase.deleteProduct(id);
      loadData();
    } catch (err) {
      alert(err.message || 'Error al dar de baja');
    }
  };

  return (
    <div className="catalog-container">
      <div className="section-header">
        <div>
          <h2>Catálogo de Productos</h2>
          <p className="subtitle">Inventario disponible en tiempo real</p>
        </div>
        {user.role === 'admin' && (
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            + Nuevo Producto
          </button>
        )}
      </div>

      <div className="filters-bar">
        <select value={selectedCat} onChange={(e) => setSelectedCat(e.target.value)}>
          <option value="">Todas las Categorías</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {error && <div className="alert-error">{error}</div>}

      {loading ? (
        <div className="loading">Cargando inventario...</div>
      ) : products.length === 0 ? (
        <div className="empty-state">No hay productos en esta categoría.</div>
      ) : (
        <div className="products-grid">
          {products.map((p) => (
            <div key={p.id} className="product-card">
              <div className="product-badge">{p.categoryName}</div>
              <h3>{p.name}</h3>
              <div className="product-price">
                ${new Intl.NumberFormat('es-CO').format(p.price)} COP
              </div>
              <div className="product-stock">
                Stock: <strong>{p.stock}</strong> unidades
              </div>

              <div className="card-actions">
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => onAddToCart(p)}
                  disabled={p.stock <= 0}
                >
                  {p.stock > 0 ? '🛒 Agregar' : 'Agotado'}
                </button>
                {user.role === 'admin' && (
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(p.id)}
                  >
                    Baja
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <h3>Nuevo Producto</h3>
            <form onSubmit={handleCreateProduct}>
              <div className="form-group">
                <label>Nombre</label>
                <input
                  type="text"
                  required
                  value={newProdName}
                  onChange={(e) => setNewProdName(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Precio (COP)</label>
                <input
                  type="number"
                  required
                  min="1"
                  step="0.01"
                  value={newProdPrice}
                  onChange={(e) => setNewProdPrice(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Stock inicial</label>
                <input
                  type="number"
                  required
                  min="0"
                  value={newProdStock}
                  onChange={(e) => setNewProdStock(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Categoría</label>
                <select
                  value={newProdCat}
                  onChange={(e) => setNewProdCat(e.target.value)}
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="modal-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
