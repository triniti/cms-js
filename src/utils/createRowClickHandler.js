import nodeUrl from '@triniti/cms/plugins/ncr/nodeUrl.js';

export default (navigate, node) => {
  return (e) => {
    // Do nothing if element contains `data-ignore-row-click` attribute
    if (e.target.closest('[data-ignore-row-click]')) {
      return;
    }
    navigate(nodeUrl(node, 'view'));
  }
}