import { STATUS_FULFILLED, STATUS_NONE, STATUS_PENDING, STATUS_REJECTED } from '@triniti/app/constants';

export const initialRequestState = {
  request: null,
  response: null,
  status: STATUS_NONE,
  exception: null,
};

export const initialCommandState = {
  command: null,
  status: STATUS_NONE,
  exception: null,
};

const createSlot = (state, channel, curie, defaultState) => {
  const curieStr = `${curie}`;
  /* eslint-disable no-param-reassign */
  state.pbjx = state.pbjx || {};
  state.pbjx[channel] = state.pbjx[channel] || {};
  state.pbjx[channel][curieStr] = { ...defaultState, ...state.pbjx[channel][curieStr] || {} };
  /* eslint-enable no-param-reassign */
  return state.pbjx[channel][curieStr];
};

const onRequestStarted = (prevState = {}, action) => {
  const state = { ...prevState };
  const { pbj } = action;
  const { channel } = action.ctx;
  const slot = createSlot(state, channel, pbj.schema().getCurie(), initialRequestState);

  slot.request = pbj.clone().freeze();
  slot.status = STATUS_PENDING;
  slot.exception = null;

  return state;
};

const onRequestFulfilled = (prevState = {}, action) => {
  const state = { ...prevState };
  const { pbj } = action;
  const { channel } = action.ctx;
  const requestCurie = pbj.get('ctx_request_ref').getCurie();
  const slot = createSlot(state, channel, requestCurie, initialRequestState);

  pbj.freeze();
  slot.request = pbj.get('ctx_request', slot.request);
  slot.response = action.pbj;
  slot.status = STATUS_FULFILLED;
  slot.exception = null;

  return state;
};

const onRequestRejected = (prevState = {}, action) => {
  const state = { ...prevState };
  const { pbj } = action;
  const { channel } = action.ctx;
  const slot = createSlot(state, channel, pbj.schema().getCurie(), initialRequestState);

  slot.request = pbj.clone().freeze();
  slot.status = STATUS_REJECTED;
  slot.exception = action.ctx.exception;

  return state;
};

const onCommandStarted = (prevState = {}, action) => {
  const state = { ...prevState };
  const { pbj } = action;
  const { channel } = action.ctx;
  const slot = createSlot(state, channel, pbj.schema().getCurie(), initialCommandState);

  slot.command = pbj.clone().freeze();
  slot.status = STATUS_PENDING;
  slot.exception = null;

  return state;
};

const onCommandFulfilled = (prevState = {}, action) => {
  const state = { ...prevState };
  const { pbj } = action;
  const { channel } = action.ctx;
  const slot = createSlot(state, channel, pbj.schema().getCurie(), initialCommandState);

  slot.command = pbj.clone().freeze();
  slot.status = STATUS_FULFILLED;
  slot.exception = null;

  return state;
};

const onCommandRejected = (prevState = {}, action) => {
  const state = { ...prevState };
  const { pbj } = action;
  const { channel } = action.ctx;
  const slot = createSlot(state, channel, pbj.schema().getCurie(), initialRequestState);

  slot.command = pbj.clone().freeze();
  slot.status = STATUS_REJECTED;
  slot.exception = action.ctx.exception;

  return state;
};

export default (rootReducer) => {
  rootReducer.subscribe('gdbots:pbjx:mixin:request.started', onRequestStarted);
  rootReducer.subscribe('gdbots:pbjx:mixin:response', onRequestFulfilled);
  rootReducer.subscribe('gdbots:pbjx:mixin:request.rejected', onRequestRejected);
  rootReducer.subscribe('gdbots:pbjx:mixin:command.started', onCommandStarted);
  rootReducer.subscribe('gdbots:pbjx:mixin:command.fulfilled', onCommandFulfilled);
  rootReducer.subscribe('gdbots:pbjx:mixin:command.rejected', onCommandRejected);
};
