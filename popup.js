const fileInput = document.getElementById('file-input');
const myDiv = document.getElementById('output');
const saveButton = document.getElementById('save-button');
const convertButton = document.getElementById('convert-button');

saveButton.disabled = true;

function convertToJSON() {
  const file = fileInput.files[0];

  if (!file) {
    myDiv.innerText = 'No file selected';
    saveButton.disabled = true;
    return;
  }

  const reader = new FileReader();

  if (file.type === 'application/vnd.ms-excel' || file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 
  file.type === 'text/csv') {
    reader.onload = function() {
      const data = new Uint8Array(reader.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);

      if (jsonData.length > 0) {
        myDiv.innerText = JSON.stringify(jsonData, null, 2);
        saveButton.disabled = false;
      } else {
        myDiv.innerText = 'No data to display';
        saveButton.disabled = true;
      }
    };

    reader.readAsArrayBuffer(file);
  } else {
    myDiv.textContent = 'Invalid file type';
    saveButton.disabled = true;
  }
}

fileInput.addEventListener('change', () => {
  convertButton.disabled = false;
});

convertButton.addEventListener('click', () => {
  convertToJSON();
});

saveButton.addEventListener('click', () => {
  const blob = new Blob([myDiv.innerText], {type: 'text/plain'});
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', 'data.json');

  document.body.appendChild(link);

  link.click();

  URL.revokeObjectURL(url);
  link.remove();
});