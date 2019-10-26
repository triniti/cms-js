import { callPbjx } from '@gdbots/pbjx/redux/actions';
import { change } from 'redux-form';
import schemas from './schemas';
import { pbjxChannel, formNames } from '../../constants';

export default (dispatch, { contentRef }) => ({
  /**
   * search article notification for this node
   */
  handleSearchNotification: () => {
    dispatch(callPbjx(
      schemas.searchNodes.createMessage({
        content_ref: contentRef,
        sort: schemas.searchNodesSort.CREATED_AT_DESC,
      }),
      pbjxChannel.ARTICLE_NOTIFICATIONS,
    ));
  },

  /**
   * Since this popup modal will opens from the current article
   * The UI should set the contentRef to the articleRef
   *
   * Use async-await to ensure picker component being loaded in dom before change value
   */
  handleInitCreateNotificationForm: async () => {
    await dispatch(
      change(formNames.CREATE_NOTIFICATION, 'type', { label: 'Article', value: 'article' }),
    );
    await dispatch(change(formNames.CREATE_NOTIFICATION, 'contentRefs', [contentRef]));
  },
});
