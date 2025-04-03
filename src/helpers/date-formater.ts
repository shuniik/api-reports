export class DateFormater {
  static formatter = new Intl.DateTimeFormat('es-ES', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
     hour: 'numeric',
     minute: 'numeric',
    // second: 'numeric',
     hour12: true
  });
  
  static getDate(date: Date): string{
      return this.formatter.format(date);  
    }

  }
