import Policy from 'plugins/iam/Policy';

const emptyPolicy = new Policy;

export default ({ iam }) => iam.policy || emptyPolicy;
