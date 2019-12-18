import getNode from '@triniti/cms/plugins/ncr/selectors/getNode';
import { nodeRefs } from '../constants';

export default (state) => Object.keys(state.raven.collaboration).map((nodeRef) => (nodeRef === nodeRefs.FAKE_ARTICLE || nodeRef === nodeRefs.GENERAL ? null : getNode(state, nodeRef))).filter((node) => !!node);
