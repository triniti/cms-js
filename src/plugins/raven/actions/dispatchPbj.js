import ObjectSerializer from '@gdbots/pbj/serializers/ObjectSerializer.js';

export default (worker, rawPbj) => async (dispatch, getState, app) => {
  let pbj;

  try {
    pbj = await ObjectSerializer.deserialize(rawPbj);
    pbj.freeze();
  } catch (e) {
    console.error('raven/dispatchPbj deserialize failed', e, rawPbj);
    return;
  }

  await app.getPbjx().publish(pbj);
  const event = new CustomEvent('pbjx.publish', { detail: pbj });
  worker.dispatchEvent(event);
};
