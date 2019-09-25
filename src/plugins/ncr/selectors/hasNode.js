/**
 * Returns true if the given NodeRef is in the state.
 *
 * @param {Object}  state   - The entire redux state.
 * @param {NodeRef} nodeRef - A NodeRef instance.
 *
 * @returns {boolean}
 */
export default ({ ncr }, nodeRef) => {
  if (!nodeRef) {
    return false;
  }

  const label = nodeRef.getQName().getMessage();
  const id = nodeRef.getId();

  if (!ncr.nodes[label]) {
    return false;
  }

  return !!ncr.nodes[label][id];
};
