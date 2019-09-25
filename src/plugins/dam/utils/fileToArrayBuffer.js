export default (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();

  reader.addEventListener('loadend', (e) => {
    resolve(e.target.result);
  });

  reader.addEventListener('error', (e) => {
    console.error('There was an error reading in file', e); // eslint-disable-line no-console
    reject(e);
  });

  reader.readAsArrayBuffer(file);
});
