import getUser from '@triniti/cms/plugins/iam/selectors/getUser.js';

export default (state, asNodeRef = false) => {
  const user = getUser(state);
  const nodeRef = user.generateNodeRef();
  return asNodeRef ? nodeRef : nodeRef.toString();
};
