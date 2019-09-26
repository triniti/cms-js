import AbstractDelegate from '@triniti/cms/plugins/ncr/screens/node/AbstractDelegate';
import clearResponse from '@triniti/cms/plugins/pbjx/actions/clearResponse';
import schemas from './schemas';
import { formNames } from '../../constants';

class Delegate extends AbstractDelegate {
  constructor(dependencies) {
    super({
      schemas,
      formName: formNames.PICKLIST,
    }, dependencies);
  }

  /**
   * Clear previous picklist-picker response
   * @param data
   * @param formDispatch
   * @param formProps
   * @returns {Promise<void>}
   */
  async handleSubmit(data, formDispatch, formProps) {
    // fixme: figure out what is killing babel here
    // await super.handleSubmit(data, formDispatch, formProps);
    // const { nodeRef } = this.component.props;
    // this.dispatch(clearResponse(schemas.getNodeRequest.getCurie(), nodeRef.getId().toString()));
  }
}

export { Delegate }; // to allow for site level customization
export default (dispatch, ownProps, dependencies) => new Delegate(dependencies);
