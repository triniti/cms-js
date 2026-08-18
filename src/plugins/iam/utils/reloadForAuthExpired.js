let reloading = false;

export default () => {
  if (reloading) {
    return;
  }
  reloading = true;
  window.location.reload();
};
