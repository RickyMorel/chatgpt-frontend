class Utils {
    static formatDate(date) {
        const newDate = new Date(date);
        const year = newDate.getFullYear();
        const month = String(newDate.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
        const day = String(newDate.getDate()).padStart(2, '0');

        const formattedDate = `${day}-${month}-${year}`;
        return formattedDate
    }

    static getCutName(name, maxCharacterLength = 25) {
        let itemName = name
    
        if(itemName?.length > maxCharacterLength) {
            itemName = itemName.slice(0, maxCharacterLength) + "..."
        }

        return itemName
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
}

export default Utils