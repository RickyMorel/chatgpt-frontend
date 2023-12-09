import GetDataFromExcel from "./GetDataFromExcel";

class GetProductDataFromExcel extends GetDataFromExcel {

    static ExtractProductData = (productsJson) => {
        const stringsToFind = ["Nombre", "Precio", "Sabor", "Cantidad"];
        const headerIndexes = this.FindHeaderIndexes(productsJson[0], stringsToFind)
        productsJson.shift()
        let productData = []

        productsJson.forEach(jsonProduct => {
            const extractedPrice = this.ExtractPriceFromString(jsonProduct[headerIndexes[1]].toString())
            const newProduct = {
                name: jsonProduct[headerIndexes[0]],
                price: parseInt(extractedPrice), 
                flavourType: jsonProduct[headerIndexes[2]],
                amount: jsonProduct[headerIndexes[3]]
            }
            productData.push(newProduct)
        });
        return productData
    }

    static ExtractPriceFromString(priceString) {
        let newString = priceString.replaceAll(',', '')
        newString = newString.replaceAll('.', '')
        newString = newString.replace(/[a-zA-Z]/g, '')

        return newString
    }
}

export default GetProductDataFromExcel