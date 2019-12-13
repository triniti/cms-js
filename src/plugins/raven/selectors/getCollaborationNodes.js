import getNode from '@triniti/cms/plugins/ncr/selectors/getNode';

export default (state) => Object.keys(state.raven.collaboration).map((nodeRef) => (nodeRef === 'acme:article:fake-article' || nodeRef === 'general' ? null : getNode(state, nodeRef))).filter((node) => !!node);
