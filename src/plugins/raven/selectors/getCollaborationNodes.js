import getNode from 'plugins/ncr/selectors/getNode';

export default (state) => Object.keys(state.raven.collaborations).reduce((acc, cur) => {
  let node;
  if (cur !== 'general') {
    node = getNode(state, cur);
  }
  if (node) {
    acc.push(node);
  }
  return acc;
}, []);
