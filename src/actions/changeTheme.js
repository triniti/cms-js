import { actionTypes, THEME_STORAGE_KEY } from 'constants';

export default (theme) => {
  const lastTheme = localStorage.getItem(THEME_STORAGE_KEY) || 'light';
  document.documentElement.setAttribute('data-bs-theme',(theme))
  localStorage.setItem(THEME_STORAGE_KEY, theme);
  return { type: actionTypes.THEME_CHANGED, theme };
};
