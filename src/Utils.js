class Utils {
    static loginExemptPaths = [
      "/",
      "/login",
      "/clientOrderPlacing",
      "/clientCart",
      "/createAccount"
    ]

    static clientCartData = []
    static needsRuc = false
    static clientCartBotNumber = ''
    static ruc = ''
    static clientOrderPlacingInventory = []
    static lastSaveCallback = undefined
    static permanantBlockChatExplanationText = `<strong>Caso Bloquear:</strong><br/>En un Instituto de Inglés, se establece que la IA interactúe únicamente en el primer contacto con el cliente. Una vez que el cliente se registra como alumno, la IA deja de responder sus mensajes, bloqueando la conversación.<br/><strong>Caso No Bloquear:</strong><br/>En una panadería o restaurante, se requiere que la IA responda cada vez que el cliente se comunique, proporcionando información como precios o detalles de productos, sin bloquear la conversación.`
    static useInventoryExplinationText = `Se utiliza un catálogo de productos <strong>únicamente en el caso de que su negocio venda productos</strong>. Si su empresa solo ofrece servicios, como un instituto de pilates en el que WhatsBot únicamente responde consultas y agenda citas, no es necesario disponer del catálogo`
    static whatsappExplinationText = `Aquí ingresarás el número que deseas que WhatsBot utilice para responder`
    static businessDescriptionExplinationText = `Esto permite que WhatsBot entienda de qué se trata tu negocio y cuál será su rol en él`
    static loadProductsExplinationText = `Aqui cargaras el catalogo entero de tus productos, asi WhatsBot sabra que vender a tus clientes`
    static conversationExamplesExplinationText = `Le daras ejemplos a WhatsBot de como queres que le responda a tus clientes, asi WhatsBot podra imitar tu forma de responder.<strong> Empezarmos con 5</strong>, pero <strong>si quieres que WhatsBot responda bien en todos los casos</strong>, le vas a tener que <strong>dar mas ejemplos</strong>`
    static loadInventoryExplinationText = `Una vez que crees tus productos, debes especificar qué productos estarán disponibles en cada día`
    static questionsAndAnswersExplinationText = `Aqui cargaras todas las respuestas a preguntas que te suelen hacer tus clientes, como:<br/>-Cuando abren?<br/>-En cuanto tiempo llega mi pedido?<br/>-Trabajan en feriados?`
    static deativateBlockClientsToast = `Cuando quieras que WhatsBot empieze a responder a tus clientes🙋🏻‍♂️, tenes que desactivar el toggle✔️ "Bloquear WhatsBot". Se encuentra en el panel de Clientes => "Bloquear WhatsBot"`
    static transcribeConversationsToast = `Podés transcribir aquí tus conversaciones de WhatsApp con tus clientes🙋🏻‍♂️.\nAsí, WhatsBot podrá aprender de tus respuestas reales y responder como vos. Cuantos más ejemplos cargues, mejor respondera`

    static countries = [
      { code: '+595', flag: '🇵🇾', name: 'Paraguay' },
      { code: '+54', flag: '🇦🇷', name: 'Argentina' },
      { code: '+55', flag: '🇧🇷', name: 'Brazil' },
      { code: '+56', flag: '🇨🇱', name: 'Chile' },
      { code: '+57', flag: '🇨🇴', name: 'Colombia' },
      { code: '+52', flag: '🇲🇽', name: 'Mexico' },
      { code: '+598', flag: '🇺🇾', name: 'Uruguay' }
    ];

    static arraysEqual(arr1, arr2) {
      return JSON.stringify(arr1) == JSON.stringify(arr2);
    }

    static getSplitPhoneNumbers = (phoneNumber) => {
      const sortedCountries = [...this.countries].sort((a, b) => {
        const aLength = a.code.length - 1; // Exclude the '+' sign
        const bLength = b.code.length - 1;
        return bLength - aLength; // Sort by descending order of code length
      });
    
      for (const country of sortedCountries) {
        const codeDigits = country.code.slice(1); // Remove the '+' sign
        if (phoneNumber.startsWith(codeDigits)) {
          return {
            countryCode: country.code,
            rest: phoneNumber.slice(codeDigits.length)
          };
        }
      }
    
      return null; // Return null if no country code matches
    }

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

  static formatNumber = (number) => {
    return number.toLocaleString();
  };

  static glowingStyle = () => {
    return (
      <style jsx>{`
        @keyframes glow {
        0% {
            box-shadow: 0 0 10px 5px rgba(247, 191, 68, 0.8);
            filter: brightness(1.1);
        }
        50% {
            box-shadow: 0 0 30px 15px rgba(247, 191, 68, 0.9);
        }
        100% {
            box-shadow: 0 0 10px 5px rgba(247, 191, 68, 0.8);
        }
        }

        .glowing {
        animation: glow 1.5s infinite;
        position: relative;
        }
    `}</style>
    )
  }
}

export default Utils