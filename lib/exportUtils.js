import * as XLSX from 'xlsx';

export const exportToExcel = (responses, formTitle) => {
  if (!responses || responses.length === 0) {
    throw new Error('No data to export');
  }

  // Parse responses and create worksheet data
  const worksheetData = responses.map((response, index) => {
    const parsedResponse = typeof response.jsonResponse === 'string' 
      ? JSON.parse(response.jsonResponse) 
      : response.jsonResponse;
    
    return {
      'Response #': index + 1,
      'Submitted At': response.createdAt,
      'Submitted By': response.createdBy || 'Anonymous',
      ...parsedResponse
    };
  });

  // Create workbook and worksheet
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(worksheetData);

  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Responses');

  // Generate filename
  const filename = `${formTitle.replace(/[^a-z0-9]/gi, '_')}_responses_${new Date().toISOString().split('T')[0]}.xlsx`;

  // Save file
  XLSX.writeFile(workbook, filename);
};

export const exportToCSV = (responses, formTitle) => {
  if (!responses || responses.length === 0) {
    throw new Error('No data to export');
  }

  // Parse responses and create CSV data
  const csvData = responses.map((response, index) => {
    const parsedResponse = typeof response.jsonResponse === 'string' 
      ? JSON.parse(response.jsonResponse) 
      : response.jsonResponse;
    
    return {
      'Response #': index + 1,
      'Submitted At': response.createdAt,
      'Submitted By': response.createdBy || 'Anonymous',
      ...parsedResponse
    };
  });

  // Convert to CSV
  const headers = Object.keys(csvData[0]);
  const csvContent = [
    headers.join(','),
    ...csvData.map(row => 
      headers.map(header => {
        const value = row[header] || '';
        // Escape commas and quotes
        return typeof value === 'string' && (value.includes(',') || value.includes('"')) 
          ? `"${value.replace(/"/g, '""')}"` 
          : value;
      }).join(',')
    )
  ].join('\n');

  // Download CSV
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${formTitle.replace(/[^a-z0-9]/gi, '_')}_responses_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};