import { INJECT } from '@triniti/app/constants';
import renameNode from '../../actions/renameNode';
import { serviceIds } from '../../constants';

const delegate = (dispatch, ownProps, { sluggableForms }) => ({
  /**
   * @returns {Object} - default SluggableForms config is set in Plugin's index file
   */
  getSluggableConfig: (formName) => sluggableForms[formName] || sluggableForms.default,

  /**
   * @param {String} initialSlug
   * @param {String} newSlug
   */
  handleRename: (initialSlug, newSlug) => {
    const { schemas, nodeRef } = ownProps;

    const command = schemas.renameNode.createMessage({
      node_ref: nodeRef,
      old_slug: initialSlug,
      new_slug: newSlug,
    });

    dispatch(renameNode(command, { schemas }));
  },
});

delegate[INJECT] = {
  [serviceIds.SLUGGABLE_FORMS]: 'sluggableForms',
};

export default delegate;
