export default (activeHashName) => ({ dam }) => (
  activeHashName
    ? dam.uploader.files[activeHashName].asset
    : null
);
