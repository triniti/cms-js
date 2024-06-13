import { useSelector } from 'react-redux';
import getPolicy from '@triniti/cms/plugins/iam/selectors/getPolicy.js';

export default () => useSelector(getPolicy);
