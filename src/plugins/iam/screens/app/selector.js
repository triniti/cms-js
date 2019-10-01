import updateScreenSelector from '@triniti/cms/plugins/ncr/screens/node/selector';
import schemas from './schemas';
import { formNames } from '../../constants';

export default (state, ownProps) => updateScreenSelector(state, ownProps, {
  schemas,
  formName: formNames.APP,
});
