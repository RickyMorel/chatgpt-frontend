import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import * as XLSX from 'xlsx';
import GetClientDataFromExcel from './GetClientDataFromExcel';

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
      GetDataResponse(jsonData)
    };

    reader.readAsBinaryString(file);
  }, []);

  const GetDataResponse = async (jsonData) => {
    const clientData = GetClientDataFromExcel.ExtractClientData(jsonData)
    showPopupFunc(await GetClientDataFromExcel.PostClientData(clientData))
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