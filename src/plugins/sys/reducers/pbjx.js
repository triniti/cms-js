import PicklistV1Mixin from '@triniti/schemas/triniti/sys/mixin/picklist/PicklistV1Mixin';
import resolveSchema from '@triniti/cms/utils/resolveSchema';
import { pbjxChannelNames } from '../constants';

const onGetPicklistResponse = (prevState = {}, action) => {
  const state = { ...prevState };
  if (action.ctx.channel === `${pbjxChannelNames.PICKLIST_PICKER_REQUEST}/${action.pbj.get('node').get('_id')}`) {
    // now that the picklist is in state, we can delete the channel
    delete state.pbjx[action.ctx.channel];
  }
  return state;
};

const onPicklistCreated = (prevState = {}, action) => {
  const state = { ...prevState };
  // remove any stale pbjx for previously nonexistent picklist
  delete state.pbjx[`${pbjxChannelNames.PICKLIST_PICKER_REQUEST}/${action.pbj.get('node').get('_id')}`];
  return state;
};

export default (rootReducer) => {
  const vendor = resolveSchema(PicklistV1Mixin, 'event', 'picklist-created').getCurie().getVendor();
  rootReducer.subscribe(`${vendor}:sys:request:get-picklist-response`, onGetPicklistResponse);
  rootReducer.subscribe(`${vendor}:sys:event:picklist-created`, onPicklistCreated);
};
