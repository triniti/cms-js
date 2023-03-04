import sortedUniq from 'lodash-es/sortedUniq';

/**
 * Returns an object formatted for redux
 * injestion. We remove the timestamps and
 * and stale users here.
 * 
 * @param {*} data
 * @param {Integer} threshold
 * @returns {Object}
 */
export default (collaborations, threshold = 15) => {
  const simpleCollaborations = {
    // nodeRef: [userRef]
  };

  // this prevents us from ever showing a collaborator who
  // hasn't sent a heartbeat within X seconds
  const aliveAfter = Math.floor(Date.now() / 1000) - threshold;

  Object.keys(collaborations).map(topic => {
    const userRefs = Object.keys(collaborations[topic]);
    if (!userRefs.length) {
      return;
    }
    simpleCollaborations[topic] = [];
    for (let i = 0; i < userRefs.length; i++) {
      const userRef = userRefs[i];
      if (collaborations[topic][userRefs] > aliveAfter) {
        simpleCollaborations[topic].push(userRef);
      }
    }
    
    // clear topic if no one was alive in it
    if (!simpleCollaborations[topic].length) {
      delete simpleCollaborations[topic];
    } else {
      simpleCollaborations[topic].sort();
      simpleCollaborations[topic] = sortedUniq(simpleCollaborations[topic]);
    }
  });
  return simpleCollaborations;
};