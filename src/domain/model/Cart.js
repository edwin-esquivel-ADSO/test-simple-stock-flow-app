import { Money } from './Money.js';

export class Cart {
  constructor(items = []) {
    this.items = items; // { product, quantity }
  }

  addItem(product, quantity = 1) {
    if (quantity <= 0) return this;
    const existingIndex = this.items.findIndex(i => i.product.id === product.id);
    let newItems;
    if (existingIndex >= 0) {
      newItems = [...this.items];
      const newQty = Math.min(product.stock, newItems[existingIndex].quantity + quantity);
      newItems[existingIndex] = { ...newItems[existingIndex], quantity: newQty };
    } else {
      const initialQty = Math.min(product.stock, quantity);
      newItems = [...this.items, { product, quantity: initialQty }];
    }
    return new Cart(newItems);
  }

  updateQuantity(productId, quantity) {
    if (quantity <= 0) {
      return this.removeItem(productId);
    }
    const newItems = this.items.map(item => {
      if (item.product.id === productId) {
        return { ...item, quantity: Math.min(item.product.stock, quantity) };
      }
      return item;
    });
    return new Cart(newItems);
  }

  removeItem(productId) {
    return new Cart(this.items.filter(i => i.product.id !== productId));
  }

  getTotal() {
    return this.items.reduce(
      (acc, item) => acc.add(Money.of(item.product.price).multiply(item.quantity)),
      Money.of(0)
    );
  }

  clear() {
    return new Cart([]);
  }
}
