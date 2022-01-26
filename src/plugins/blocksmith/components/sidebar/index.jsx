import PropTypes from 'prop-types';
import React from 'react';
import sortBy from 'lodash/sortBy';
import sortedUniqBy from 'lodash/sortedUniqBy';

import { localize } from '@triniti/cms/plugins/utils/services/Localization';
import buttonConfig from '@triniti/cms/plugins/blocksmith/components/sidebar/config';
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


const allButtons = getAllButtons();
const availableButtons = (() => {
  const { enableOther, groups: buttonGroups } = buttonConfig;
  const usedButtons = [];
  const selectedButtonGroups = buttonGroups
    .map(({ header, buttons }) => {
      const buttonList = [];
      buttons.forEach((item, index) => {
        const button = allButtons.filter(({ schema }) => `${schema.getCurie().getMessage()}` === item);
        buttonList[index] = button[0];
        usedButtons.push(item);
      });
      return {
        header,
        buttons: buttonList,
      }
    });
  
  if (enableOther) {
    return selectedButtonGroups.concat({
      header: 'Other',
      buttons: allButtons.filter((item) => !usedButtons.includes(`${item.schema.getCurie().getMessage()}`)),
    });
  }

  return selectedButtonGroups;
})();

/**
 * Search Button Groups
 *
 * Sorts buttons in alphabetical order, dedupes, and filters results by
 * user query string.
 *
 * @param buttonGroups 
 * @param q 
 */
const searchButtonGroups = (buttonGroups, q) => {
  if (!q) {
    return buttonGroups;
  }

  let buttons = [];
  buttonGroups.forEach(buttonGroup => {
    buttons = [...buttons, ...buttonGroup.buttons];
  });
  buttons = sortBy(buttons, [({ schema }) => `${schema.getCurie().getMessage()}`]);
  buttons = sortedUniqBy(buttons, ({ schema }) => `${schema.getCurie().getMessage()}`);
  buttons = buttons.filter(({ schema }) => `${schema.getCurie().getMessage()}`.indexOf(q.toLowerCase()) > -1);
  return [{
    header: 'Results',
    buttons,
  }];
}

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
    
    const buttonSelection = searchButtonGroups(availableButtons, q)
      .map(({ buttons, header }) => (
        <div className="popover-section-holder" key={header}>
          <PopoverHeader className="text-center">{ localize(header) }</PopoverHeader>
          <PopoverBody>
            <div className="popover-row">
              {
                buttons.map(({ Button: ButtonComponent, schema }) => (
                  <ButtonComponent
                    key={schema.getCurie().getMessage()}
                    message={schema.getCurie().getMessage()}
                    onClick={() => this.handleClick(schema)}
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
              buttonSelection.length
                ? buttonSelection
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
