import Asset from '@triniti/cms/plugins/dam/components/asset/index';
import noop from 'lodash/noop';
import Message from '@gdbots/pbj/Message';
import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { ButtonToolbar } from '@triniti/admin-ui-plugin/components';

import ToolbarButton from './ToolbarButton';

export default class ButtonToolbarAsset extends React.Component {
  static propTypes = {
    gallerySequence: PropTypes.number,
    node: PropTypes.instanceOf(Message).isRequired,
    disabled: PropTypes.bool.isRequired,
    onEditAsset: PropTypes.func.isRequired,
    onEditSequence: PropTypes.func,
    onRemoveAsset: PropTypes.func.isRequired,
    showEditSequence: PropTypes.bool,
  };

  static defaultProps = {
    gallerySequence: 0,
    onEditSequence: noop,
    showEditSequence: false,
  };

  constructor(props) {
    super(props);

    this.state = {
      isHovering: false,
    };

    this.handleMouseLeave = this.handleMouseLeave.bind(this);
    this.handleMouseOver = this.handleMouseOver.bind(this);
  }

  handleMouseLeave() {
    this.setState({ isHovering: false });
  }

  handleMouseOver() {
    this.setState({ isHovering: true });
  }

  render() {
    const {
      disabled,
      gallerySequence,
      node,
      onEditAsset,
      onEditSequence,
      onRemoveAsset,
      showEditSequence,
    } = this.props;
    const { isHovering } = this.state;
    return (
      <div
        onBlur={this.handleMouseLeave}
        onFocus={this.handleMouseOver}
        onMouseLeave={this.handleMouseLeave}
        onMouseOver={this.handleMouseOver}
      >
        <Asset
          asset={node}
          gallerySequence={gallerySequence}
          isHovering={!disabled && isHovering}
          isOverlayOnlyVisibleOnHover
          key={node.get('_id')}
          showEditSequence={showEditSequence}
        />
        {!disabled && isHovering && (
          <ButtonToolbar style={{ position: 'absolute', right: '.5rem', top: '.5rem' }}>
            {!showEditSequence && (
              <>
                <ToolbarButton icon="edit" id="media-edit" tooltip="Edit" onMouseDown={() => onEditAsset(node)} />
                <ToolbarButton icon="trash" id="media-remove" tooltip="Remove" onMouseDown={() => onRemoveAsset(node)} />
              </>
            )}
            {showEditSequence
              && <ToolbarButton icon="cog" id="seq-edit" tooltip="Set Sequence" onMouseDown={() => onEditSequence(node)} />}
          </ButtonToolbar>
        )}
      </div>
    );
  }
}
