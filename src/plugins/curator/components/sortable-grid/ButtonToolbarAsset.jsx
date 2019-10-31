import Asset from '@triniti/cms/plugins/dam/components/asset/index';
import noop from 'lodash/noop';
import Message from '@gdbots/pbj/Message';
import PropTypes from 'prop-types';
import React from 'react';
import { ButtonToolbar, Checkbox } from '@triniti/admin-ui-plugin/components';

import ToolbarButton from './ToolbarButton';

export default class ButtonToolbarAsset extends React.Component {
  static propTypes = {
    multiSelect: PropTypes.bool,
    isSelected: PropTypes.bool,
    node: PropTypes.instanceOf(Message).isRequired,
    disabled: PropTypes.bool.isRequired,
    onEditAsset: PropTypes.func.isRequired,
    onEditSequence: PropTypes.func,
    onSelect: PropTypes.func,
    onRemoveAsset: PropTypes.func.isRequired,
    showEditSequence: PropTypes.bool,
  };

  static defaultProps = {
    multiSelect: false,
    isSelected: false,
    onEditSequence: noop,
    onSelect: noop,
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
      isSelected,
      multiSelect,
      node,
      onEditAsset,
      onEditSequence,
      onRemoveAsset,
      onSelect,
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
          isHovering={!disabled && isHovering}
          isOverlayOnlyVisibleOnHover
          key={node.get('_id')}
          showEditSequence={showEditSequence}
        />
        {!disabled && !isHovering && multiSelect && isSelected && !showEditSequence && (
          <ButtonToolbar style={{ position: 'absolute', left: '0', top: '0', padding: '.5rem', width: '100%', justifyContent: 'space-between', minHeight: '44px' }}>
            <>
              <Checkbox checked={isSelected} onChange={() => onSelect(node)} />
            </>
          </ButtonToolbar>
        )}
        {!disabled && isHovering && (
          <ButtonToolbar style={{ position: 'absolute', left: '0', top: '0', padding: '.5rem', width: '100%', justifyContent: 'space-between', minHeight: '44px' }}>
            {!showEditSequence && (
              <>
                {multiSelect && <Checkbox checked={isSelected} onChange={() => onSelect(node)} />}
                <div>
                  <ToolbarButton icon="edit" id="media-edit" tooltip="Edit" onMouseDown={() => onEditAsset(node)} />
                  <ToolbarButton icon="trash" id="media-remove" tooltip="Remove" onMouseDown={() => onRemoveAsset(node)} />
                </div>
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
