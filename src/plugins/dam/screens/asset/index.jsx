import memoize from 'lodash/memoize';
import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import AbstractNodeScreen from '@triniti/cms/plugins/ncr/screens/node';
import AssetId from '@triniti/schemas/triniti/dam/AssetId';
import createDelegateFactory from '@triniti/app/createDelegateFactory';
import UncontrolledTooltip from '@triniti/cms/plugins/common/components/uncontrolled-tooltip';
import { ActionButton, Icon } from '@triniti/admin-ui-plugin/components';
import damUrl from '../../utils/damUrl';
import delegateFactory from './delegate';
import Form from './Form';
import getBadgeConfigFn from './getBadgeConfig';
import schemas from './schemas';
import selector from './selector';
import { hasVariants } from '../../variants';

const getBadgeConfig = memoize(getBadgeConfigFn);

class AssetScreen extends AbstractNodeScreen {
  renderPrimaryActions() {
    const { nodeRef } = this.props;

    return (
      <>
        <ActionButton
          key="download"
          onClick={() => { window.open(damUrl(nodeRef), '_blank'); }}
          text="Download"
        />
        {super.renderPrimaryActions()}
      </>
    );
  }

  getBadge() {
    const badgeConfig = getBadgeConfig(this.props.match.params.type, schemas);
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
    return {
      type: this.props.match.params.type,
    };
  }

  getTabs() {
    const assetId = AssetId.fromString(this.props.nodeRef.id);
    const tabs = ['details', 'taxonomy'];
    if (hasVariants(assetId)) {
      tabs.push('variants');
    }
    return tabs;
  }
}

export default connect(selector, createDelegateFactory(delegateFactory))(AssetScreen);
