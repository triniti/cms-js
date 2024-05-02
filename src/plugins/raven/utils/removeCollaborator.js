import isEmpty from 'lodash-es/isEmpty.js';

/**
 * Collaborations Eg:
 * {
 *  nodeRef: [userRef]
 * }
 *
 * @param {*} collaborations
 * @param {String} nodeRef
 * @param {String} userRef
 * @returns {*}
 */
const removeCollaborator = (collaborations, nodeRef, userRef) => {
  if (!collaborations[nodeRef]) {
    return collaborations;
  }
  const userRefIndex = collaborations[nodeRef].indexOf(userRef);
  collaborations[nodeRef].splice(userRefIndex, 1);
  if (isEmpty(collaborations[nodeRef])) {
    delete collaborations[nodeRef];
  }
  return collaborations;
};

export default removeCollaborator;
