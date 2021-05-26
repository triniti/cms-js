import { callPbjx } from '@gdbots/pbjx/redux/actions';
import { camelCase, upperFirst } from 'lodash-es';
import { pbjxChannelNames } from '../../constants';
import cleanEditor from '../../actions/cleanEditor';
import copyBlock from '../../actions/copyBlock';
import dirtyEditor from '../../actions/dirtyEditor';
import storeEditor from '../../actions/storeEditor';
import schemas from './schemas';


export default (dispatch, { formName }) => ({
  handleCleanEditor: () => dispatch(cleanEditor(formName)),
  handleCopyBlock: (block) => dispatch(copyBlock(block)),
  handleDirtyEditor: () => dispatch(dirtyEditor(formName)),
  handleStoreEditor: (editorState) => dispatch(storeEditor(formName, editorState)),
  handleGetNode: (nodeRef) => {
    const schema = schemas[`get${upperFirst(camelCase(nodeRef.getLabel()))}NodeRequest`];
    if (schema) {
      return dispatch(callPbjx(schema.createMessage().set('node_ref', nodeRef), pbjxChannelNames.NODE_REQUEST));
    }
    return Promise.resolve();
  },
});
