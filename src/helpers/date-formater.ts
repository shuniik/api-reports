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

    static getMonthYear(date: Date | string): string {
      if (!date) return '';
      const d = new Date(date);
      const month = `${d.getMonth() + 1}`.padStart(2, '0'); 
      const year = d.getFullYear();
      return `${month}/${year}`;
    }

  }
