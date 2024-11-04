class Utils {
    static loginExemptPaths = [
      "/",
      "/clientOrderPlacing",
      "/clientCart"
    ]

    static clientCartData = []

    static formatDate(date) {
        const newDate = new Date(date);
        const year = newDate.getFullYear();
        const month = String(newDate.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
        const day = String(newDate.getDate()).padStart(2, '0');

        const formattedDate = `${day}-${month}-${year}`;
        return formattedDate
    }

    static isAuthenticated() {
      return window?.token?.length > 0
    }

    
    static sortByName = (a, b, property) => {

      if(!property) {
          if (a < b) return -1;
          if (a > itemB) return 1;
          return 0;
      }

      const itemA = a[property].toLowerCase();
      const itemB = b[property].toLowerCase();
      if (itemA < itemB) return -1;
      if (itemA > itemB) return 1;
      return 0;
    }

    static getCutName(name, maxCharacterLength = 25) {
        let itemName = name
    
        if(itemName?.length > maxCharacterLength) {
            itemName = itemName.slice(0, maxCharacterLength) + "..."
        }

        return itemName
    }

    static getWeekName = (dayIndex) => {
      const weekNames = [
        "Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado",
        "Domingo"
      ];

      return weekNames[dayIndex]
    }

    static hexToRgba(hex, alpha) {
        let r = 0, g = 0, b = 0;

        // 3 digits
        if (hex.length === 4) {
          r = parseInt(hex[1] + hex[1], 16);
          g = parseInt(hex[2] + hex[2], 16);
          b = parseInt(hex[3] + hex[3], 16);
        }

        // 6 digits
        else if (hex.length === 7) {
          r = parseInt(hex[1] + hex[2], 16);
          g = parseInt(hex[3] + hex[4], 16);
          b = parseInt(hex[5] + hex[6], 16);
        }
        
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    };

    static areSameDay(date1, date2) {
      if (!(date1 instanceof Date) || !(date2 instanceof Date)) {
          throw new Error('Both arguments must be Date objects.');
      }
  
      return date1.getFullYear() === date2.getFullYear() &&
             date1.getMonth() === date2.getMonth() &&
             date1.getDate() === date2.getDate();
    }

    static getDayIndex(date) {
      const dayIndex = date.getDay()

      let translatedMondayDayIndex = dayIndex - 1

      if(translatedMondayDayIndex == -1) {translatedMondayDayIndex = 6}

      return translatedMondayDayIndex
    }

    static getWeekRange() {
      const today = new Date();
      
      // Get the current day of the week (0 - Sunday, 6 - Saturday)
      const dayOfWeek = today.getDay();
  
      // Calculate the difference to the start of the week (Sunday)
      const diffToStartOfWeek = dayOfWeek; // Sunday is 0, so no need to add 1
      
      // Calculate the difference to the end of the week (Saturday)
      const diffToEndOfWeek = 6 - dayOfWeek; // Saturday is 6
  
      // Get the start and end dates
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - diffToStartOfWeek);
  
      const endOfWeek = new Date(today);
      endOfWeek.setDate(today.getDate() + diffToEndOfWeek);
  
      return {
          startOfWeek,
          endOfWeek
      };
  }

  static formatDateShort(date) {
    const options = { month: 'short', day: 'numeric' };
    return date?.toLocaleDateString('en-US', options).replace(",", " -");
  }

  static formatPrice = (numberString) => {
    const number = parseFloat(numberString);
  
    if (isNaN(number)) {
      return 'Invalid number';
    }
  
    const formattedNumber = new Intl.NumberFormat('es-PY', {
      style: 'currency',
      currency: 'PYG',
    }).format(number);
  
    return `${formattedNumber}`;
};
}

export default Utils