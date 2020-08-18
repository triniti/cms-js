import { ActionButton, Icon } from '@triniti/admin-ui-plugin/components';
import { connect } from 'react-redux';
import AbstractNodeScreen from '@triniti/cms/plugins/ncr/screens/node';
import artifactUrl from '@triniti/cms/plugins/ovp/utils/artifactUrl';
import AssetId from '@triniti/schemas/triniti/dam/AssetId';
import createDelegateFactory from '@triniti/app/createDelegateFactory';
import damUrl from '@triniti/cms/plugins/dam/utils/damUrl';
import memoize from 'lodash/memoize';
import React from 'react';
import UncontrolledTooltip from '@triniti/cms/plugins/common/components/uncontrolled-tooltip';
import delegateFactory from './delegate';
import Form from './Form';
import getBadgeConfigFn from './getBadgeConfig';
import schemas from './schemas';
import selector from './selector';
import { hasVariants } from '../../variants';

const getBadgeConfig = memoize(getBadgeConfigFn);

class AssetScreen extends AbstractNodeScreen {
  renderAdditionalPrimaryActions() {
    const { nodeRef } = this.props;
    const url = nodeRef.getLabel() === 'video-asset'
      ? artifactUrl(nodeRef, 'original')
      : damUrl(nodeRef);

    return (
      <ActionButton
        key="download"
        onClick={() => { window.open(url, '_blank'); }}
        text="Download"
      />
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
