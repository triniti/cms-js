import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import AbstractNodeScreen from '@triniti/cms/plugins/ncr/screens/node';
import createDelegateFactory from '@triniti/app/createDelegateFactory';
import { Icon } from '@triniti/admin-ui-plugin/components';
import UncontrolledTooltip from '@triniti/cms/plugins/common/components/uncontrolled-tooltip';
import getBadgeConfig from './getBadgeConfig';
import delegateFactory from './delegate';
import Form from './Form';
import selector from './selector';

class TeaserScreen extends AbstractNodeScreen {
  static propTypes = {
    ...AbstractNodeScreen.propTypes,
    formValues: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  };

  static defaultProps = {
    ...AbstractNodeScreen.defaultProps,
    formValues: {},
  };

  getBadge() {
    const badgeConfig = getBadgeConfig(this.props.schema.getCurie().getMessage());
    if (!badgeConfig) {
      return null;
    }

    return ([
      <Icon
        alert
        color="dark"
        id="badge-tooltip"
        imgSrc={badgeConfig.imgSrc}
        key="a"
        size="xs"
        style={{ marginRight: '0.5rem' }}
      />,
      <UncontrolledTooltip placement="bottom" target="badge-tooltip" key="b">
        {badgeConfig.tooltipText}
      </UncontrolledTooltip>,
    ]);
  }

  getForm() {
    return Form;
  }

  getFormRenderProps() {
    const { formValues, getNodeRequestState } = this.props;
    return {
      formValues,
      getNodeRequestState,
      type: this.props.match.params.type,
    };
  }

  getTabs() {
    return [
      'details',
      'taxonomy',
      this.props.schema.hasMixin('triniti:common:mixin:seo') && 'seo',
    ];
  }
}

export default connect(selector, createDelegateFactory(delegateFactory))(TeaserScreen);
