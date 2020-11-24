import { validateBlocks } from '@triniti/cms/plugins/blocksmith/utils';
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
    const { isValid, validEditorState } = validateBlocks(blocksmithState.editorState);

    if (isValid) {
      return AbstractDelegate.prototype.handleSubmit.call(this, data, formDispatch, formProps);
    }

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
        return; // do nothing, user canceled
      }
      dispatch(storeEditor(formProps.form, validEditorState));
      dispatch(submit(formProps.form));
    });
  }
}

export { Delegate }; // to allow for site level customization
export default (dispatch, ownProps, dependencies) => new Delegate(dependencies);
