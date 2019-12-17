import getNode from '@triniti/cms/plugins/ncr/selectors/getNode';

export default (state) => {
  const fakeArticle = 'acme:article:fake-article';
  const general = 'general';

  return Object.keys(state.raven.collaboration).map((nodeRef) => (nodeRef === fakeArticle || nodeRef === general ? null : getNode(state, nodeRef))).filter((node) => !!node);
};
