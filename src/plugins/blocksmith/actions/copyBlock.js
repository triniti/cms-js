import { actionTypes } from '../constants';

export default (block) => ({
  type: actionTypes.BLOCK_COPIED,
  block,
});
