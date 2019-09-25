/**
 * Simple preventDefault. Attached as an event listener to dragover events (which must be done to
 * enable drop events, see code in https://developer.mozilla.org/en-US/docs/Web/Events/dragover)
 * Included as a function here so it will have a reference and can later be removed.
 *
 * @param {*} e - an event
 */

export default (e) => e.preventDefault();
