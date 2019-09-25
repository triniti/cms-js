import getNode from '@triniti/cms/plugins/ncr/selectors/getNode';
import isGranted from '@triniti/cms/plugins/iam/selectors/isGranted';

export default (state, { isEditMode, nodeRef, schemas }) => {
  const node = getNode(state, nodeRef);

  return {
    canRename: isEditMode && isGranted(state, schemas.renameNode.getCurie().toString()),
    initialSlug: node ? node.get('slug') : '',
  };
};
