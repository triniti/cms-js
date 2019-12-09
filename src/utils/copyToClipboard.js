/**
 * Copy provided text to user's clipboard. This only works if called as a result of a
 * user action (click, etc.)
 *
 * @param {string}  str - the string to copy into the clipboard
 */
export default (str) => {
  const el = document.createElement('textarea');
  el.value = str;
  el.setAttribute('readonly', '');
  el.style.position = 'absolute';
  el.style.left = '-9999px';
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
};
