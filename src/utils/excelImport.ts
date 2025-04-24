export async function importExcelData(file: File): Promise<any[]> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to import data');
  }

  return response.json();
} 