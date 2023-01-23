export default (file) => new Promise((resolve) => {
  const reader = new FileReader();
  reader.onloadend = (e) => {
    const arr = (new Uint8Array(e.target.result)).subarray(0, 4);
    let header = '';
    for (let i = 0; i < arr.length; i += 1) {
      header += arr[i].toString(16);
    }
    resolve(header);
  };
  reader.readAsArrayBuffer(file.slice(0, 4));
});
