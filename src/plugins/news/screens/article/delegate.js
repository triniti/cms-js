import { ContentState, EditorState } from 'draft-js';
import { convertToCanvasBlocks, convertToEditorState } from '@triniti/cms/plugins/blocksmith/utils';
import { submit } from 'redux-form';
import AbstractDelegate from '@triniti/cms/plugins/ncr/screens/node/AbstractDelegate';
import storeEditor from '@triniti/cms/plugins/blocksmith/actions/storeEditor';
import swal from 'sweetalert2';
import schemas from './schemas';
import { formNames } from '../../constants';

class Delegate extends AbstractDelegate {
  constructor(dependencies) {
    super({
      schemas,
      formName: formNames.ARTICLE,
    }, dependencies);
  }

  handleSubmit(data, formDispatch, formProps) { // eslint-disable-line consistent-return
    const { blocksmithState, dispatch } = this.component.props;
    try {
      convertToCanvasBlocks(blocksmithState.editorState);
      return AbstractDelegate.prototype.handleSubmit.call(this, data, formDispatch, formProps);
    } catch (e1) {
      swal.fire({
        title: 'Error saving article - one or more blocks is invalid.',
        text: 'The invalid blocks cannot be saved. Would you like to save only the valid blocks?',
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        confirmButtonClass: 'btn btn-danger',
        cancelButtonClass: 'btn btn-secondary',
      }).then((result) => {
        if (!result.value) {
          return;
        }
        const validBlocks = [];
        blocksmithState.editorState.getCurrentContent().getBlockMap().forEach((contentBlock) => {
          const singleBlockEditorState = EditorState.push(
            EditorState.createEmpty(),
            ContentState.createFromBlockArray([contentBlock]),
          );
          try {
            const [canvasBlock] = convertToCanvasBlocks(singleBlockEditorState);
            validBlocks.push(canvasBlock);
          } catch (e2) {
            console.error(`[blocksmith] - ${e2}`);
          }
        });
        let newEditorState = convertToEditorState(validBlocks);
        newEditorState = EditorState.push(
          blocksmithState.editorState,
          newEditorState.getCurrentContent(),
        );
        dispatch(storeEditor(formProps.form, newEditorState));
        dispatch(submit(formProps.form));
      });
    }
  }
}

export { Delegate }; // to allow for site level customization
export default (dispatch, ownProps, dependencies) => new Delegate(dependencies);
