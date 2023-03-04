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
const addCollaborator = (collaborations, nodeRef, userRef) => {
  if (!collaborations[nodeRef]) {
    collaborations[nodeRef] = [];
  }
  const userRefIndex = collaborations[nodeRef].indexOf(userRef);
  if (userRefIndex === -1) {
    collaborations[nodeRef].push(userRef);
  }
  return collaborations;
};

export default addCollaborator;