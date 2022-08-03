import { useSelector } from 'react-redux';
import getPolicy from 'plugins/iam/selectors/getPolicy';

export default () => useSelector(getPolicy);
