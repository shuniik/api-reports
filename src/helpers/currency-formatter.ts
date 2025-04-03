export class CurrencyFormater {
  static format(currency: string, value: number): string {
      return new Intl.NumberFormat('es-GT', { 
        style: 'currency', 
        currency: currency 
      }).format(value);
  }
}