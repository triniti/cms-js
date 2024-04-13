import { useSelector } from 'react-redux';
import getPolicy from '@triniti/cms/plugins/iam/selectors/getPolicy';

export default () => useSelector(getPolicy);
