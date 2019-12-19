import getNode from '@triniti/cms/plugins/ncr/selectors/getNode';

export default (state) => Object.keys(state.raven.collaboration).reduce((acc, cur) => {
  const node = getNode(state, cur);
  if (node) {
    acc.push(node);
  }
  return acc;
}, []);
