import updateNodeSelector from '@triniti/cms/plugins/ncr/screens/node/selector';
import { getFormValues } from 'redux-form';
import { formNames } from '../../constants';
import schemas from './schemas';

export default (state, ownProps) => updateNodeSelector(state, ownProps, {
  schemas,
  formName: formNames.GALLERY,
  formValues: getFormValues(formNames.GALLERY)(state),
});
