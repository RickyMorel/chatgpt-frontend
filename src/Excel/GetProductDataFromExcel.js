import GetDataFromExcel from "./GetDataFromExcel";

class GetProductDataFromExcel extends GetDataFromExcel {

    static ExtractProductData = (productsJson) => {
        const stringsToFind = ["Nombre", "Codigo", "Precio", "Sabor", "Cantidad"];
        const headerIndexes = this.FindHeaderIndexes(productsJson[0], stringsToFind)
        productsJson.shift()
        let productData = []

        productsJson.forEach(jsonProduct => {
            const extractedPrice = jsonProduct[headerIndexes[2]] ? this.ExtractPriceFromString(jsonProduct[headerIndexes[2]].toString()) : undefined
            console.log("jsonProduct[headerIndexes[2]]", jsonProduct[headerIndexes[2]])
            const newProduct = {
                name: jsonProduct[headerIndexes[0]],
                code: jsonProduct[headerIndexes[1]],
                price: parseInt(extractedPrice), 
                flavourType: jsonProduct[headerIndexes[3]],
                amount: jsonProduct[headerIndexes[4]]
            }
            productData.push(newProduct)
        });
        console.log("productData", productData)
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