export default ({ app }, name) => {
  return app.forms[name] || null;
};
