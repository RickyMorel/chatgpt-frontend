class Utils {
    static formatDate(date) {
        const newDate = new Date(date);
        const year = newDate.getFullYear();
        const month = String(newDate.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
        const day = String(newDate.getDate()).padStart(2, '0');

        const formattedDate = `${day}-${month}-${year}`;
        console.log("formattedDate", formattedDate)
        return formattedDate
    }
}

export default Utils