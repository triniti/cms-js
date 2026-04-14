export const VALID_KEY_PATTERN = /^[a-zA-Z0-9_]{1}[a-zA-Z0-9_-]{0,126}$/;

export default (value, keyValue, relaxValidation = false) => {
  if (value === undefined || value === null || !`${value}`.length) {
    return 'Required';
  }

  if (!relaxValidation && !VALID_KEY_PATTERN.test(value)) {
    return 'Only use letters, numbers and underscores.';
  }

  const used = (keyValue || []).map(o => o && o.key).filter(v => v === value);
  if (used.length > 1) {
    return 'Duplicate Key';
  }

  return undefined;
};
