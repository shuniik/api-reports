// src/helpers/number-formater.ts

export class NumberFormater {
  static withCommas(value: number | string): string {
    const num = Number(value);

    if (isNaN(num)) return '0';

    return num.toLocaleString('es-GT'); // Puedes cambiar 'en-US' por tu localización si necesitás
  }
}
