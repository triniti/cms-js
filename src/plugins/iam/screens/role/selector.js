import updateNodeSelector from '@triniti/cms/plugins/ncr/screens/node/selector';
import { formNames } from '../../constants';
import schemas from './schemas';

export default (state, ownProps) => updateNodeSelector(state, ownProps, {
  schemas,
  formName: formNames.ROLE,
});
