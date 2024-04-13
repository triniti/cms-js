import { actionTypes, THEME_STORAGE_KEY } from '@triniti/cms/constants';

export default (theme) => {
  const lastTheme = localStorage.getItem(THEME_STORAGE_KEY) || 'theme-light';
  document.body.classList.add(theme);
  document.body.classList.remove(lastTheme);
  localStorage.setItem(THEME_STORAGE_KEY, theme);
  return { type: actionTypes.THEME_CHANGED, theme };
};
