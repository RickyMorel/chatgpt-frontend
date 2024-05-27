import * as XLSX from 'xlsx';

class ExcelOutputUtils {
    static convertIsidoraProductsToExcel = (isidoraData) => {
        let allProducts = []
        isidoraData.forEach(product => {
          let tagsString =product.tags.join(", ")
          
          let newProduct = {...product}
          newProduct.tags = tagsString
         
          let excelEntry = [newProduct.name, newProduct.code, newProduct.price, newProduct.tags, newProduct.amount,
            newProduct.description, newProduct.imageLink, newProduct.catalogueLink]

          allProducts.push(excelEntry)
        });
    
        console.log("allProducts", allProducts)

        return allProducts
      }

      static handleDownload = (data) => {
        if(!data) {return}
    
        const ws = XLSX.utils.aoa_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    
        // Save the workbook to a file
        XLSX.writeFile(wb, 'pedidos.xlsx');
      };
}

export default ExcelOutputUtils;