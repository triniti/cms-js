import { actionTypes, THEME_STORAGE_KEY } from 'constants';

export default app => {
  const theme = localStorage.getItem(THEME_STORAGE_KEY) || 'light';
  document.documentElement.setAttribute('data-bs-theme',(theme))
  return { type: actionTypes.APP_STARTED, app };
};
