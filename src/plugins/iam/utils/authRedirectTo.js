const key = 'iam.auth.redirectTo';

const get = () => localStorage.getItem(key) || '/';
const set = (redirectTo) => localStorage.setItem(key, redirectTo);
const clear = () => localStorage.removeItem(key);

export default { get, set, clear };
