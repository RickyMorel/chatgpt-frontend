import React from 'react';
import * as XLSX from 'xlsx';

function ExcelFileOutput() {
    const handleDownload = () => {
        // Create a sample workbook
        const data = [
          ['Name', 'Age', 'Country'],
          ['John Doe', 25, 'USA'],
          ['Jane Smith', 30, 'Canada'],
          ['Bob Johnson', 22, 'UK'],
        ];
    
        const ws = XLSX.utils.aoa_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    
        // Save the workbook to a file
        XLSX.writeFile(wb, 'sample.xlsx');
      };
    
      return (
        <div>
          <button onClick={handleDownload}>Descargar pedidos</button>
        </div>
      );
}

export default ExcelFileOutput
