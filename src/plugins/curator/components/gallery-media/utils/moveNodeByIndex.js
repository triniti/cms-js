export default (oldIndex, newIndex, nodesToReorder = []) => {
  const nodes = nodesToReorder.slice();
  if (!nodes[oldIndex] || !nodes[newIndex]) {
    return nodes;
  }

  nodes.splice(newIndex, 0, nodes.splice(oldIndex, 1)[0]);

  return nodes;
};
