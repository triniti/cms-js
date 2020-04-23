import AbstractDelegate from '@triniti/cms/plugins/ncr/components/create-node-modal/AbstractDelegate';
import { formNames } from '../../constants';
import schemas from './schemas';

class Delegate extends AbstractDelegate {
  constructor(dependencies) {
    super({
      schemas,
      formName: formNames.CREATE_TEASER,
    }, dependencies);
  }

  /**
   * @inheritdoc
   */
  handleSubmit(data, formDispatch, formProps) {
    // Copy image to primary image when an asset teaser is created.
    const dataImageRef = data.type.value === 'asset-teaser' ? { ...data, imageRef: data.targetRef } : data;

    return super.handleSubmit(dataImageRef, formDispatch, formProps);
  }
}

export { Delegate }; // to allow for site level customization
export default (dispatch, ownProps, dependencies) => new Delegate(dependencies);
