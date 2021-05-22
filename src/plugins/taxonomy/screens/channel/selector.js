import { getFormValues } from 'redux-form';
import nodeScreenSelector from '@triniti/cms/plugins/ncr/screens/node/selector';
import schemas from './schemas';
import { formNames } from '../../constants';

export default (state, ownProps) => nodeScreenSelector(state, ownProps, {
  schemas,
  formName: formNames.CHANNEL,
  formValues: getFormValues(formNames.CHANNEL)(state),
});
