import isEmpty from 'lodash/isEmpty';

export default (state) => {
  const { ncr } = state;
  if (isEmpty(ncr.batchOperation)) {
    return null;
  }
  return ncr.batchOperation;
};
