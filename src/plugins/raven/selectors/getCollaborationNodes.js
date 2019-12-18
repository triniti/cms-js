import getNode from '@triniti/cms/plugins/ncr/selectors/getNode';
import { collaborationTopics } from '../constants';

export default (state) => Object.keys(state.raven.collaboration).map((nodeRef) => (nodeRef === collaborationTopics.FAKE_ARTICLE || nodeRef === collaborationTopics.GENERAL ? null : getNode(state, nodeRef))).filter((node) => node);
