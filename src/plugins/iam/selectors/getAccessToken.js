//export default ({ iam }) => iam.accessToken;
import { ACCESS_TOKEN_STORAGE_KEY } from '@gdbots/pbjx/constants.js';

export default () => localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
