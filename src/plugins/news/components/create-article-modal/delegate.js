import { SUFFIX_WARN_FORM } from '@triniti/app/constants';
import AbstractDelegate from '@triniti/cms/plugins/ncr/components/create-node-modal/AbstractDelegate';
import get from 'lodash/get';
import { formNames, formRules } from '../../constants';
import schemas from './schemas';

class Delegate extends AbstractDelegate {
  constructor(dependencies) {
    super({
      schemas,
      formName: formNames.CREATE_ARTICLE,
      updateFormName: formNames.ARTICLE,
    }, dependencies);

    this.handleWarn = this.handleWarn.bind(this);
  }

  /**
   * @link https://redux-form.com/7.4.2/docs/api/reduxform.md
   *
   * @param {Object} values
   * @param {Object} formProps
   *
   * @returns {Object}
   */
  handleWarn(values, formProps) {
    if (!get(this.config, 'schemas.node') && !get(formProps, 'schemas.node')) {
      return null;
    }

    const { title } = values;
    if (!title || title.length < formRules.TITLE_LENGTH_LIMIT - 15) {
      return null;
    }

    const formEvent = this.createFormEvent(values, formProps);
    this.pbjx.trigger(formEvent.getMessage(), SUFFIX_WARN_FORM, formEvent);

    return formEvent.getWarnings();
  }
}

export { Delegate }; // to allow for site level customization
export default (dispatch, ownProps, dependencies) => new Delegate(dependencies);
