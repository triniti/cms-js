import { actionTypes, THEME_STORAGE_KEY } from '@triniti/cms/constants.js';

export default (theme) => {
  document.documentElement.setAttribute('data-bs-theme',(theme))
  localStorage.setItem(THEME_STORAGE_KEY, theme);
  return { type: actionTypes.THEME_CHANGED, theme };
};
