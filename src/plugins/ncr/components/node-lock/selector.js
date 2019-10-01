import isGranted from '@triniti/cms/plugins/iam/selectors/isGranted';

export default (state, { schemas }) => {
  const canLock = schemas.lockNode && isGranted(state, `${schemas.lockNode.getCurie()}`);
  const canUnlock = schemas.unlockNode && isGranted(state, `${schemas.unlockNode.getCurie()}`);

  return {
    canLock,
    canUnlock,
  };
};
