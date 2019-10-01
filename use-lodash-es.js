module.exports = () => ({
  visitor: {
    ImportDeclaration(path) {
      const { source } = path.node;
      source.value = source.value.replace(/^lodash($|\/)/, 'lodash-es$1');
    },
  },
});
