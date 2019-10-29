import createReducer from '@triniti/app/createReducer';
import { actionTypes } from '../constants';

export const initialState = {
  isBatchEditOpen: false,
};

const {
  DISPLAY_BATCH_EDIT_REQUESTED,
} = actionTypes;


const onDisplayBatchEdit = (prevState, { display }) => {
  console.log('reducer:onDisplayBatchEdit', display);
  return {
    ...prevState,
    isBatchEditOpen: display,
  };
};

export default createReducer(initialState, {
  [DISPLAY_BATCH_EDIT_REQUESTED]: onDisplayBatchEdit,
});
