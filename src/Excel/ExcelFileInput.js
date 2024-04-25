import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import * as XLSX from 'xlsx';
import { usePopup } from '../Popups/PopupProvider';
import GetClientDataFromExcel from './GetClientDataFromExcel';
import GetProductDataFromExcel from './GetProductDataFromExcel';

function ExcelFileInput({dataTypeName}) {
  const [excelData, setExcelData] = useState(null);
  const [popup, setPopup] = useState(null);
  const { showPopup } = usePopup();
  
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

    if(clientData[0].address == undefined) {showPopup(new Error("No se encontro 'Domicilio' en el excel")); return}
    else if(clientData[0].phoneNumber == undefined) {showPopup(new Error("No se encontro 'Numero' en el excel")); return}
    else if(clientData[0].name == undefined) {showPopup(new Error("No se encontro 'Nombre' en el excel")); return}

    showPopup(await GetClientDataFromExcel.PostData(`${process.env.REACT_APP_HOST_URL}/client-crud/createMany`, clientData))
  }

  const GetProductDataResponse = async (jsonData) => {
    const productData = GetProductDataFromExcel.ExtractProductData(jsonData)

    if(productData[0].price == undefined) {showPopup(new Error("No se encontro 'Precio' en el excel")); return}
    else if(productData[0].flavourType == undefined) {showPopup(new Error("No se encontro 'Sabor' en el excel")); return}
    else if(productData[0].name == undefined) {showPopup(new Error("No se encontro 'Nombre' en el excel")); return}

    showPopup(await GetClientDataFromExcel.PostData(`${process.env.REACT_APP_HOST_URL}/inventory/resetItems`, productData))
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