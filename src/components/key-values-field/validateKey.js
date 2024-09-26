export const VALID_KEY_PATTERN = /^[a-zA-Z0-9_]{1}[a-zA-Z0-9_-]{0,126}$/;

const allowMutantKeys = { sendgrid_senders: true };

export default (value, allValues, pbjName) => {
  if (value === undefined || value === null || !`${value}`.length) {
    return 'Required';
  }

  if (!allowMutantKeys[pbjName] && !VALID_KEY_PATTERN.test(value)) {
    return 'Only use letters, numbers and underscores.';
  }

  const used = (allValues[pbjName] || []).map(o => o && o.key).filter(v => v === value);
  if (used.length > 1) {
    return 'Duplicate Key';
  }

  return undefined;
};
