import updateScreenSelector from '@triniti/cms/plugins/ncr/screens/node/selector';
import { formNames } from '../../constants';
import schemas from './schemas';

export default (state, ownProps) => updateScreenSelector(state, ownProps, {
  schemas,
  formName: formNames.VIDEO,
});
