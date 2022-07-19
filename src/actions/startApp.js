import { actionTypes, THEME_STORAGE_KEY } from 'constants';

export default app => {
  const theme = localStorage.getItem(THEME_STORAGE_KEY) || 'theme-light';
  document.body.classList.add(theme);
  return { type: actionTypes.APP_STARTED, app };
};
