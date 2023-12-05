import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import * as XLSX from 'xlsx';

function ExcelFileInput({dataTypeName}) {
  const [excelData, setExcelData] = useState(null);
  
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
    };

    reader.readAsBinaryString(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div>
      <div {...getRootProps()} style={dropzoneStyle}>
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the Excel file here...</p>
        ) : (
          <p>Agregué el Excel de {dataTypeName}</p>
        )}
      </div>
      {excelData && (
        <div>
          <h4>Excel Data:</h4>
          <pre>{JSON.stringify(excelData, null, 2)}</pre>
        </div>
      )}
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