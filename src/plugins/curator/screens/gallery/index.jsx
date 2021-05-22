import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import AbstractNodeScreen from '@triniti/cms/plugins/ncr/screens/node';
import createDelegateFactory from '@triniti/app/createDelegateFactory';
import delegateFactory from '@triniti/cms/plugins/curator/screens/gallery/delegate';
import Form from '@triniti/cms/plugins/curator/screens/gallery/Form';
import selector from '@triniti/cms/plugins/curator/screens/gallery/selector';

class GalleryScreen extends AbstractNodeScreen {
  static propTypes = {
    ...AbstractNodeScreen.propTypes,
    formValues: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  };

  static defaultProps = {
    ...AbstractNodeScreen.defaultProps,
    formValues: {},
  };

  getForm() {
    return Form;
  }

  getFormRenderProps() {
    const { formValues, getNodeRequestState } = this.props;
    return { formValues, getNodeRequestState };
  }

  getTabs() {
    const { delegate } = this.props;
    return [
      'details',
      delegate.getSchemas().node.hasMixin('triniti:common:mixin:custom-code') && 'code',
      'taxonomy',
      this.props.delegate.getSchemas().node.hasMixin('triniti:common:mixin:seo') && 'seo',
      'media',
    ];
  }
}

export default connect(selector, createDelegateFactory(delegateFactory))(GalleryScreen);
