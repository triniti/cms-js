export default (state, ownProps) => {
  const { iam } = state;
  const { location } = ownProps;

  return {
    isAuthenticated: iam.auth.isAuthenticated && !!iam.auth.user,
    location,
  };
};
