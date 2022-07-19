import pbjUrl, { expand } from '@gdbots/pbjx/pbjUrl';

const vars = node => ({
  label: node.schema().getQName().getMessage(),
  _id: node.get('_id').toString(),
});

export default (node, template) => {
  switch (template) {
    case 'edit':
      return expand('node.edit', vars(node));

    case 'view':
      return expand('node.view', vars(node));

    default:
      return pbjUrl(node, template);
  }
};
