/**
 * We don't want to ddos ourselves on accident, like for example
 * a co-worker who hasn't closed a browser tab since netscape navigator
 * and may in fact be powering the blockchain ledger with his immutable
 * browser history of tabs.  If every one of his tabs was sending
 * heartbeats for a given topic you'd get a lot of chatter.
 *
 * All this selector does is help us prevent another publish of his
 * heartbeat.  If we've already received one recently enough to not
 * warrant another one, then don't send it.
 *
 * @see publishFlow
 *
 * @param {Object}         state
 * @param {string}         topic
 * @param {NodeRef|string} userRef
 * @param {number}         threshold - how far back in seconds a user is considered alive
 *
 * @returns {boolean}
 */
export default ({ raven }, topic, userRef, threshold = 15) => {
  if (!raven.collaboration[topic]) {
    // not even on this topic, user must be dead to the world
    return false;
  }

  const ts = raven.collaboration[topic][`${userRef}`] || null;
  if (ts === null) {
    // topic exists but i'm not on it, heartbeat will join me
    return false;
  }

  const aliveAfter = Math.floor(Date.now() / 1000) - threshold;
  return ts > aliveAfter;
};
