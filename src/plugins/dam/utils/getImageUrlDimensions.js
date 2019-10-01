export default (imgUrl) => new Promise((resolve, reject) => {
  const img = new Image();

  const interval = setInterval(() => {
    const width = img.naturalWidth;
    const height = img.naturalHeight;
    if (width && height) {
      clearInterval(interval);
      resolve({ width, height });
    }
  }, 10);

  img.onerror = () => {
    clearInterval(interval);
    reject(new Error('Error loading image'));
  };

  img.src = imgUrl;
});
