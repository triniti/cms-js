import React from 'react';
import PropTypes from 'prop-types';
import noop from 'lodash/noop';

import { ButtonToolbar, Card } from '@triniti/admin-ui-plugin/components';
import Asset from '@triniti/cms/plugins/dam/components/asset';
import Message from '@gdbots/pbj/Message';

export default class LinkedAssetsElement extends React.Component {
  static propTypes = {
    asset: PropTypes.instanceOf(Message).isRequired,
    toolBarButton: PropTypes.node,
  };

  static defaultProps = {
    toolBarButton: null,
  };

  constructor(props) {
    super(props);

    this.state = {
      isHovering: false,
    };

    this.handleMouseOver = this.handleMouseOver.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
  }

  handleMouseOver() {
    this.setState({ isHovering: true });
  }

  handleMouseLeave() {
    this.setState({ isHovering: false });
  }

  render() {
    const { isHovering } = this.state;
    const { asset, toolBarButton } = this.props;

    return (
      <Card
        inverse
        shadow
        style={{ cursor: 'pointer' }}
        onFocus={noop}
        onMouseOver={this.handleMouseOver}
        onMouseLeave={this.handleMouseLeave}
      >
        <Asset
          key={asset.get('_id').toString()}
          asset={asset}
          isHovering={isHovering}
        />
        {!!toolBarButton && isHovering
          && (
            <ButtonToolbar style={{ position: 'absolute', right: '.5rem', top: '.5rem' }}>
              {toolBarButton}
            </ButtonToolbar>
          )}
      </Card>
    );
  }
}
