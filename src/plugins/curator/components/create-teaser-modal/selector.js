import get from 'lodash/get';
import { getFormValues } from 'redux-form';
import createNodeModalSelector from '@triniti/cms/plugins/ncr/components/create-node-modal/selector';
import ArticleTeaserV1Mixin from '@triniti/schemas/triniti/curator/mixin/article-teaser/ArticleTeaserV1Mixin';
import CategoryTeaserV1Mixin from '@triniti/schemas/triniti/curator/mixin/category-teaser/CategoryTeaserV1Mixin';
import ChannelTeaserV1Mixin from '@triniti/schemas/triniti/curator/mixin/channel-teaser/ChannelTeaserV1Mixin';
import GalleryTeaserV1Mixin from '@triniti/schemas/triniti/curator/mixin/gallery-teaser/GalleryTeaserV1Mixin';
import LinkTeaserV1Mixin from '@triniti/schemas/triniti/curator/mixin/link-teaser/LinkTeaserV1Mixin';
import PageTeaserV1Mixin from '@triniti/schemas/triniti/curator/mixin/page-teaser/PageTeaserV1Mixin';
import PersonTeaserV1Mixin from '@triniti/schemas/triniti/curator/mixin/person-teaser/PersonTeaserV1Mixin';
import PollTeaserV1Mixin from '@triniti/schemas/triniti/curator/mixin/poll-teaser/PollTeaserV1Mixin';
import TimelineTeaserV1Mixin from '@triniti/schemas/triniti/curator/mixin/timeline-teaser/TimelineTeaserV1Mixin';
import VideoTeaserV1Mixin from '@triniti/schemas/triniti/curator/mixin/video-teaser/VideoTeaserV1Mixin';
import getNode from '@triniti/cms/plugins/ncr/selectors/getNode';
import { formNames } from '../../constants';

/**
 * @param {Object} state     - The entire redux state.
 * @param {Object} ownProps  - Props given to the screen.
 *
 * @returns {Object}
 */
export default (state, ownProps) => {
  const formValues = getFormValues(formNames.CREATE_TEASER)(state);
  let requiredFields = [];

  let targetRef;
  switch (get(formValues, 'type.value')) {
    case ArticleTeaserV1Mixin.findOne().getCurie().getMessage():
    case GalleryTeaserV1Mixin.findOne().getCurie().getMessage():
    case PageTeaserV1Mixin.findOne().getCurie().getMessage():
    case PollTeaserV1Mixin.findOne().getCurie().getMessage():
    case VideoTeaserV1Mixin.findOne().getCurie().getMessage():
      targetRef = get(formValues, 'targetRefs[0]');
      requiredFields = ['targetRefs[0]'];
      break;
    case CategoryTeaserV1Mixin.findOne().getCurie().getMessage():
    case ChannelTeaserV1Mixin.findOne().getCurie().getMessage():
    case PersonTeaserV1Mixin.findOne().getCurie().getMessage():
    case TimelineTeaserV1Mixin.findOne().getCurie().getMessage():
      targetRef = get(formValues, 'targetRefs[0]');
      requiredFields = ['targetRefs'];
      break;
    case LinkTeaserV1Mixin.findOne().getCurie().getMessage():
      requiredFields = ['linkUrl', 'title'];
      break;
    default:
      break;
  }

  const results = createNodeModalSelector(state, ownProps, {
    formName: formNames.CREATE_TEASER,
    requiredFields,
  });
  results.formValues = formValues;

  if (targetRef) {
    results.target = getNode(state, targetRef);
  }

  return results;
};
