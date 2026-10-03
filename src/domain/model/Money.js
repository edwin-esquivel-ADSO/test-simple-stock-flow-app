export class Money {
  constructor(amount, currency = 'COP') {
    this.amount = Math.round(Number(amount) * 100) / 100;
    this.currency = currency;
  }

  static of(amount, currency = 'COP') {
    return new Money(amount, currency);
  }

  format() {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: this.currency,
      minimumFractionDigits: 2,
    }).format(this.amount);
  }

  add(other) {
    return new Money(this.amount + other.amount, this.currency);
  }

  multiply(qty) {
    return new Money(this.amount * qty, this.currency);
  }
}
