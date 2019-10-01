import Policy from '../Policy';

export default ({ iam }) => (
  iam.auth.policy || new Policy()
);
