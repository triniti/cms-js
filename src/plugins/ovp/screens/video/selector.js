import { getFormValues } from 'redux-form';
import getNode from '@triniti/cms/plugins/ncr/selectors/getNode';
import updateScreenSelector from '@triniti/cms/plugins/ncr/screens/node/selector';
import { formNames } from '../../constants';
import schemas from './schemas';

export default (state, ownProps) => {
  const updateScreenSelection = updateScreenSelector(state, ownProps, {
    schemas,
    formName: formNames.VIDEO,
  });
  const node = getNode(state, updateScreenSelection.nodeRef);
  return {
    ...updateScreenSelection,
    mezzanine: node && node.has('mezzanine_ref') ? getNode(state, node.get('mezzanine_ref')) : null,
    formValues: getFormValues(formNames.VIDEO)(state),
  };
};
