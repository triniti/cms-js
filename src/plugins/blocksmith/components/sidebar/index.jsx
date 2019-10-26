import PropTypes from 'prop-types';
import React from 'react';

import { localize } from '@triniti/cms/plugins/utils/services/Localization';
import sidebarSections, { vendorButtonTypes } from '@triniti/cms/plugins/blocksmith/components/sidebar/config';
import {
  Button,
  Icon,
  Input,
  InputGroup,
  InputGroupAddon,
  Popover,
  PopoverBody,
  PopoverHeader,
  ScrollableContainer,
} from '@triniti/admin-ui-plugin/components';
import UncontrolledTooltip from '@triniti/cms/plugins/common/components/uncontrolled-tooltip';

import { blockParentNode } from '../../utils';
import { getAllButtons } from '../../resolver';
import './styles.scss';

const buttons = getAllButtons();
const sidebarSectionsWithVendor = [{
  header: localize(buttons[0].schema.getId().getVendor()),
  matchRegEx: new RegExp(`^(${vendorButtonTypes.join('|')})`),
  doesMatch: true,
  replaceRegEx: /block/,
}].concat(sidebarSections);

export default class Sidebar extends React.Component {
  static propTypes = {
    isHoverInsertMode: PropTypes.bool,
    isOpen: PropTypes.bool.isRequired,
    onHoverInsert: PropTypes.func.isRequired,
    onToggleBlockModal: PropTypes.func.isRequired,
    onToggleSidebar: PropTypes.func.isRequired,
    popoverRef: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
    resetFlag: PropTypes.number.isRequired,
  };

  static defaultProps = {
    isHoverInsertMode: false,
  };

  constructor(props) {
    super(props);

    this.state = {
      q: '',
    };

    this.handleClick = this.handleClick.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { q } = this.state;
    const { resetFlag } = this.props;
    this.setState({
      q: nextProps.resetFlag !== resetFlag ? '' : q,
    });
  }

  handleClick(schema) {
    const {
      onHoverInsert,
      onToggleBlockModal,
      onToggleSidebar,
    } = this.props;
    if (schema.getId().getMessage() === 'text-block') {
      onHoverInsert();
      onToggleSidebar();
    } else {
      onToggleBlockModal(schema.createMessage(), true); // true is for isFreshBlock prop
    }
  }

  handleSearch({ target: { value: q } }) {
    this.setState({ q });
  }

  render() {
    const { q } = this.state;
    const {
      isHoverInsertMode,
      isOpen,
      onToggleSidebar: handleToggleSidebar,
      onHoverInsert: handleHoverInsert,
      popoverRef,
    } = this.props;

    const availableButtons = sidebarSectionsWithVendor
      .map(({ doesMatch, header, matchRegEx, replaceRegEx }) => ({
        filteredButtons: buttons
          .filter(({ schema }) => `${schema.getCurie().getMessage()} ${header.toLowerCase()}`.indexOf(q.toLowerCase()) !== -1)
          .filter(({ schema }) => (`${schema.getCurie().getMessage()}`.match(matchRegEx) ? doesMatch : !doesMatch)),
        header,
        replaceRegEx,
      }))
      .filter(({ filteredButtons }) => filteredButtons.length) // remove sections with no buttons
      .map(({ filteredButtons, header, replaceRegEx }) => (
        <div className="popover-section-holder" key={header}>
          <PopoverHeader className="text-center">{ header }</PopoverHeader>
          <PopoverBody>
            <div className="popover-row">
              {
                filteredButtons.map(({ Button: ButtonComponent, schema }) => (
                  <ButtonComponent
                    key={schema.getCurie().getMessage()}
                    message={schema.getCurie().getMessage()}
                    onClick={() => this.handleClick(schema)}
                    replaceRegEx={replaceRegEx}
                    className="button-icon-group"
                  />
                ))
              }
            </div>
          </PopoverBody>
        </div>
      ));

    const blockWidth = blockParentNode.get() ? blockParentNode.get().offsetWidth : 0;

    return (
      <div
        onMouseDown={(e) => e.preventDefault()}
        role="presentation"
      >
        <Button id="sidebar-button" onClick={handleToggleSidebar} color="hover">
          <Icon
            id="sidebar-icon"
            style={{ transform: `rotate(${isOpen ? 45 : 0}deg)` }}
            size="xl"
            color={isHoverInsertMode ? 'success' : 'gray-900'}
            imgSrc="plus-outline"
            alt="add new block"
          />
        </Button>
        <UncontrolledTooltip key="tooltip" placement="left" target="sidebar-icon">
          Add new block
        </UncontrolledTooltip>
        {
          isHoverInsertMode
          && (
            <div
              id="hover-insert-mode-indicator"
              onClick={handleHoverInsert}
              role="presentation"
              style={{ width: blockWidth, right: `calc(0.25rem - ${blockWidth}px)` }}
            />
          )
        }
        <Popover
          className="sidebar-scrollable"
          isOpen={isOpen}
          placement="auto"
          target="sidebar-button"
          toggle={handleToggleSidebar}
          innerRef={popoverRef}
        >
          <PopoverHeader>
            <InputGroup>
              <Input
                autoComplete="off"
                className="form-control"
                name="q"
                onChange={this.handleSearch}
                placeholder="Search Blocks..."
                theme="white"
                type="search"
                value={q}
                autoFocus
              />
              <InputGroupAddon addonType="append">
                <Button color="secondary">
                  <Icon imgSrc="search" className="mr-0" />
                </Button>
              </InputGroupAddon>
            </InputGroup>
          </PopoverHeader>
          <ScrollableContainer>
            {
              availableButtons.length
                ? availableButtons
                : (
                  <div className="popover-section-holder">
                    <PopoverHeader className="text-center">No blocks found</PopoverHeader>
                    <PopoverBody className="text-center">Please refine your search</PopoverBody>
                  </div>
                )
            }
          </ScrollableContainer>
        </Popover>
      </div>
    );
  }
}
