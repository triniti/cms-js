/**
 * Edits a custom atomic block based on our canvas block schema
 *
 * @param {ContentState} contentState - A ContentState instance of a DraftJs Editor.
 * @param {*}            data         - An object to use for the entity data payload.
 * @param {string}       entityKey    - The entity key of the draftJs block being edited.
 *
 * @returns {ContentState} a ContentState instance
 */

export default (contentState, data, entityKey) => contentState.mergeEntityData(entityKey, data);
