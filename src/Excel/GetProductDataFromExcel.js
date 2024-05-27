import ExcelProductItem from "./ExcelProductItem";
import GetDataFromExcel from "./GetDataFromExcel";

class GetProductDataFromExcel extends GetDataFromExcel {

    static ExtractProductData = (productsJson) => {
        const stringsToFind = ["Nombre", "Codigo", "Precio", "Etiquetas", "Cantidad", "Descripcion", "ImagenURL", "CatalogoURL"];
        const headerIndexes = this.FindHeaderIndexes(productsJson[0], stringsToFind)
        productsJson.shift()
        let productData = []

        productsJson.forEach(jsonProduct => {
            const extractedPrice = jsonProduct[headerIndexes[2]] ? this.ExtractPriceFromString(jsonProduct[headerIndexes[2]].toString()) : undefined
            const tagsArray = jsonProduct[headerIndexes[3]] ? this.ExtractTagsFromString(jsonProduct[headerIndexes[3]].toString()) : undefined
            
            const newProduct = new ExcelProductItem(
                jsonProduct[headerIndexes[0]], 
                jsonProduct[headerIndexes[1]],
                jsonProduct[headerIndexes[5]],
                parseInt(extractedPrice),
                tagsArray,
                jsonProduct[headerIndexes[4]],
                jsonProduct[headerIndexes[6]],
                jsonProduct[headerIndexes[7]]
            )

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

    static ExtractTagsFromString(tagsString) {
        let tagsArray = tagsString.split(',')
        let tagsArrayFiltered = []

        tagsArray.forEach(tag => {
            tagsArrayFiltered.push(tag.trim())
        });

        return tagsArrayFiltered
    }
}

export default GetProductDataFromExcel