import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import * as XLSX from 'xlsx';
import { usePopup } from '../Popups/PopupProvider';
import ExcelOutputUtils from './ExcelOutputUtils';
import GetClientDataFromExcel from './GetClientDataFromExcel';
import GetProductDataFromExcel from './GetProductDataFromExcel';

function ExcelFileInput({dataTypeName, setIsLoading}) {
  const [excelData, setExcelData] = useState(null);
  const [popup, setPopup] = useState(null);
  const { showPopup } = usePopup();
  
  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    setIsLoading(true)

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
      
      setExcelData(jsonData);

      if(dataTypeName == "productos") {
        GetProductDataResponse(jsonData)
      }
      else if(dataTypeName == "clientes") {
        GetClientDataResponse(jsonData)
      }
    };

    reader.readAsBinaryString(file);
  }, []);

  const GetClientDataResponse = async (jsonData) => {
    const clientData = GetClientDataFromExcel.ExtractClientData(jsonData)

    if(clientData[0].address == undefined) {showPopup(new Error("No se encontro 'Domicilio' en el excel")); setIsLoading(false); return}
    else if(clientData[0].phoneNumber == undefined) {showPopup(new Error("No se encontro 'Numero' en el excel")); setIsLoading(false); return}
    else if(clientData[0].name == undefined) {showPopup(new Error("No se encontro 'Nombre' en el excel")); setIsLoading(false); return}

    const response = await GetClientDataFromExcel.PostData(`${process.env.REACT_APP_HOST_URL}/client-crud/createMany`, clientData)

    setIsLoading(false)
    showPopup(response)
  }

  const GetProductDataResponse = async (jsonData) => {
    const productData = GetProductDataFromExcel.ExtractProductData(jsonData)

    if(productData[0].price == undefined) {showPopup(new Error("No se encontro 'Precio' en el excel")); setIsLoading(false); return}
    else if(productData[0].tags == undefined) {showPopup(new Error("No se encontro 'Etiquetas' en el excel")); setIsLoading(false); return}
    else if(productData[0].name == undefined) {showPopup(new Error("No se encontro 'Nombre' en el excel")); setIsLoading(false); return}

    const chunkSize = 80

    let response = undefined

    console.log("productDadta", productData)

    //Split product array into chunks if it is too big
    if(productData.length > chunkSize) {
      const chunkedArray = [];
      for (let i = 0; i < productData.length; i += chunkSize) {
          chunkedArray.push(productData.slice(i, i + chunkSize));
      }

      console.log("chunks", chunkedArray)

      response = await GetClientDataFromExcel.PostData(`${process.env.REACT_APP_HOST_URL}/inventory/resetItems`, chunkedArray[0])

      for (let i = 1; i < chunkedArray.length; i++) {
        const chunk = chunkedArray[i];

        response = await GetClientDataFromExcel.PostData(`${process.env.REACT_APP_HOST_URL}/inventory/addItems`, chunk)
      }
    }
    else {
      response = await GetClientDataFromExcel.PostData(`${process.env.REACT_APP_HOST_URL}/inventory/resetItems`, productData)
    }

    setIsLoading(false)
    showPopup(response)
  }

  const GenerateIsidoraProductExcel = async (jsonData) => {
    const productData = GetProductDataFromExcel.ExtractProductData(jsonData)

    if(productData[0].price == undefined) {showPopup(new Error("No se encontro 'Precio' en el excel")); setIsLoading(false); return}
    else if(productData[0].tags == undefined) {showPopup(new Error("No se encontro 'Etiquetas' en el excel")); setIsLoading(false); return}
    else if(productData[0].name == undefined) {showPopup(new Error("No se encontro 'Nombre' en el excel")); setIsLoading(false); return}

    let uniqueObjects = {};

    productData.forEach(item => {
        if (uniqueObjects[item.name]) {
          // Merge tags if the object name already exists
          uniqueObjects[item.name].tags = Array.from(new Set([...uniqueObjects[item.name].tags, item.tags ? item.tags[0] : ""]));
          uniqueObjects[item.name].tags = uniqueObjects[item.name].tags.filter(x => x.includes("Variante agotada o no disponible") == false && x.length > 0)

          FilterIsidoraTag(uniqueObjects[item.name]);
        } else {
          item.tags = item.tags ?? []

          FilterIsidoraTag(item);
          uniqueObjects[item.name] = { ...item };
        }
    });

    let filteredData = Object.values(uniqueObjects);

    let i = 0
    for(let product of filteredData) {
      const response = await GetClientDataFromExcel.PostData(`${process.env.REACT_APP_HOST_URL}/inventory/getIsidoraItemDescription`, product)
      filteredData[i].description = response.data

      console.log("response", response.data)
      i++
    }

    let excelData = ExcelOutputUtils.convertIsidoraProductsToExcel(filteredData)
    ExcelOutputUtils.handleDownload(excelData)

    //const response = await GetClientDataFromExcel.PostData(`${process.env.REACT_APP_HOST_URL}/inventory/resetItems`, productData)

    setIsLoading(false)
    //showPopup(response)
  }

  const FilterIsidoraTag = (item) => {
    item.tags = item.tags.filter(x => 
      x.includes("Variante agotada o no disponible") == false)

    for (let i = 0; i < item.tags.length; i++) {
      let tag = item.tags[i];

      if (tag.includes("P") == true) { tag = "pequeño"; }
      else if (tag.includes("M") == true) { tag = "mediano"; }
      else if (tag.includes("G") == true) { tag = "grande"; }
      else if (tag.includes("XP") == true) { tag = "extra pequeño"; }

      item.tags[i] = tag;
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div>
      <main>
        <div className="valign-wrapper" {...getRootProps()} style={dropzoneStyle}>
          <input {...getInputProps()} />
          {isDragActive ? (
            <p>Drop the Excel file here...</p>
          ) : (
            <div className='center-align'>
              <p>Agregué el Excel de {dataTypeName}</p>
            </div>
          )}
        </div>
      </main>
      {popup && ({popup})}
    </div>
  );
}

const dropzoneStyle = {
  border: '2px dashed #cccccc',
  borderRadius: '4px',
  padding: '20px',
  textAlign: 'center',
  cursor: 'pointer',
  width: '100%', // Adjust the width as needed
  height: '200px', // Adjust the height to match the width
};


export default ExcelFileInput;
