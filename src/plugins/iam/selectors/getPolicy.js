import Policy from '@triniti/cms/plugins/iam/Policy.js';

const emptyPolicy = new Policy;

export default ({ iam }) => iam.policy || emptyPolicy;
