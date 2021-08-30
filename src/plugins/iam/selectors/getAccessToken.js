import { ACCESS_TOKEN_STORAGE_KEY } from '@gdbots/pbjx/constants';

export default () => localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
