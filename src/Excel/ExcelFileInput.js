import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import * as XLSX from 'xlsx';
import GetClientDataFromExcel from './GetClientDataFromExcel';
import GetProductDataFromExcel from './GetProductDataFromExcel';

function ExcelFileInput({dataTypeName, showPopupFunc}) {
  const [excelData, setExcelData] = useState(null);
  const [popup, setPopup] = useState(null);
  
  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];

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

    if(clientData[0].address == undefined) {showPopupFunc(new Error("No se encontro 'Domicilio' en el excel"))}
    else if(clientData[0].phoneNumber == undefined) {showPopupFunc(new Error("No se encontro 'Numero' en el excel"))}
    else if(clientData[0].name == undefined) {showPopupFunc(new Error("No se encontro 'Nombre' en el excel"))}

    showPopupFunc(await GetClientDataFromExcel.PostData('http://localhost:3000/client-crud/createMany', clientData))
  }

  const GetProductDataResponse = async (jsonData) => {
    const productData = GetProductDataFromExcel.ExtractProductData(jsonData)

    if(productData[0].price == undefined) {showPopupFunc(new Error("No se encontro 'Precio' en el excel"))}
    else if(productData[0].flavourType == undefined) {showPopupFunc(new Error("No se encontro 'Sabor' en el excel"))}
    else if(productData[0].name == undefined) {showPopupFunc(new Error("No se encontro 'Nombre' en el excel"))}

    showPopupFunc(await GetClientDataFromExcel.PostData('http://localhost:3000/inventory/resetItems', productData))
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div>
      <main>
        <div {...getRootProps()} style={dropzoneStyle}>
          <input {...getInputProps()} />
          {isDragActive ? (
            <p>Drop the Excel file here...</p>
          ) : (
            <p>Agregué el Excel de {dataTypeName}</p>
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
};

export default ExcelFileInput;