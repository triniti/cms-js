export default ({ iam }) => iam.auth.isAuthenticated && !!iam.auth.user;
