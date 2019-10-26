// todo: update this so it can work with a Field in addition to FieldArray

import { components } from 'react-select';
import { connect } from 'react-redux';
import { Select } from '@triniti/admin-ui-plugin/components';
import debounce from 'lodash/debounce';
import get from 'lodash/get';
import Message from '@gdbots/pbj/Message';
import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';
import PropTypes from 'prop-types';
import React from 'react';
import delegate from './delegate';
import { selectActionTypes } from '../../constants';
import selector from './selector';

class NodePickerField extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    constants: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
    fields: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
    handleClearChannel: PropTypes.func.isRequired,
    handleGetAll: PropTypes.func.isRequired,
    handleSearch: PropTypes.func.isRequired,
    isEditMode: PropTypes.bool,
    isGetAll: PropTypes.bool,
    isMulti: PropTypes.bool,
    response: PropTypes.instanceOf(Message),
    selectComponents: PropTypes.object, // eslint-disable-line react/forbid-prop-types
    value: PropTypes.array, // eslint-disable-line react/forbid-prop-types
  };

  static defaultProps = {
    className: '',
    isEditMode: true,
    isGetAll: false,
    isMulti: false,
    response: null,
    selectComponents: {},
    value: [],
  };

  constructor(props) {
    super(props);

    this.state = {
      hasLoadedFirstSet: false,
      existingNodes: [],
    };

    this.handleLoadMore = debounce(this.handleLoadMore.bind(this), 500, {
      leading: false,
      trailing: true,
    });
    this.handleChange = this.handleChange.bind(this);
    this.handleInputChange = debounce(this.handleInputChange.bind(this), 500);
    this.handleMenuOpen = this.handleMenuOpen.bind(this);
    this.handlePick = this.handlePick.bind(this);
    this.handleRemove = this.handleRemove.bind(this);
  }

  /**
   * getting new nodes resets the scroll position, correct that here
   */
  componentDidUpdate(prevProps) {
    const { constants, response } = this.props;
    if (!prevProps.response || !response) {
      return;
    }
    if (
      this.menuList
      && response.get('ctx_request').get('page') > 1
      && !response.get('response_id').equals(prevProps.response.get('response_id'))
    ) {
      this.menuList.scrollTop = Array.from(this.menuList.children)
        .slice(0, prevProps.response.get('ctx_request').get('page') * constants.REQUEST_COUNT)
        .reduce((acc, { offsetHeight }) => (acc + offsetHeight), 0);
    }
  }

  componentWillUnmount() {
    const { handleClearChannel } = this.props;
    handleClearChannel();
    this.handleLoadMore.cancel();
    this.handleInputChange.cancel();
  }

  handleChange(selected, payload) {
    const { fields } = this.props;
    switch (payload.action) {
      case selectActionTypes.SELECT_OPTION:
        this.handleSelect(get(payload, 'option.value', selected.value));
        break;
      case selectActionTypes.REMOVE_VALUE:
        this.handleRemove(payload.removedValue.value);
        break;
      case selectActionTypes.CLEAR:
        fields.removeAll();
        break;
      default:
        break;
    }
  }

  handleInputChange(q) {
    const { handleSearch, isGetAll } = this.props;
    if (isGetAll) {
      return;
    }
    this.setState(() => ({ existingNodes: [] }), () => handleSearch(q));
  }

  handleLoadMore() {
    const { isGetAll, handleSearch, response } = this.props;
    if (isGetAll || !response.get('has_more')) {
      return;
    }
    this.setState(({ existingNodes }, props) => ({
      existingNodes: [
        ...existingNodes,
        ...props.response.get('nodes', []),
      ],
    }), () => {
      handleSearch(response.get('ctx_request').get('q'), response.get('ctx_request').get('page') + 1);
    });
  }

  handleMenuOpen() {
    const { handleGetAll, handleSearch, isGetAll } = this.props;
    const { hasLoadedFirstSet } = this.state;
    if (!hasLoadedFirstSet) {
      this.setState(() => ({
        hasLoadedFirstSet: true,
      }), isGetAll ? handleGetAll : handleSearch);
    }
  }

  async handlePick(nodeRef) {
    const { fields, isMulti } = this.props;
    if (isMulti) {
      fields.push(nodeRef);
    } else {
      await fields.removeAll();
      await fields.push(nodeRef);
    }
  }

  handleRemove(nodeRef) {
    const { fields } = this.props;
    fields.remove(fields.getAll().findIndex((ref) => ref.equals(nodeRef)));
  }

  handleSelect(nodeRef) {
    const { fields } = this.props;
    const isSelected = !!(fields.getAll() || []).find((ref) => ref.equals(nodeRef));
    if (isSelected) {
      this.handleRemove(nodeRef);
    } else {
      this.handlePick(nodeRef);
    }
  }

  render() {
    const { fields, isMulti, selectComponents, response, value } = this.props;
    const { existingNodes } = this.state;
    const MenuComponent = selectComponents.Menu || components.Menu;
    const OptionComponent = selectComponents.Option || components.Option;
    return (
      <Select
        {...this.props}
        components={{
          ...selectComponents,
          Menu: (props) => (
            <MenuComponent
              {...props}
              {...this.props}
              {...this.state}
            >
              {props.children}
            </MenuComponent>
          ),
          MenuList: (props) => (
            <components.MenuList
              {...props}
              innerRef={(e) => { this.menuList = e; }}
            >
              {props.children}
            </components.MenuList>
          ),
          Option: (props) => (
            <OptionComponent
              {...props}
              onPick={this.handlePick}
              onRemove={this.handleRemove}
              fields={fields}
              isSelected={!!(fields.getAll() || []).find((ref) => ref.equals(props.value))}
            >
              {props.children}
            </OptionComponent>
          ),
        }}
        defaultValue={value}
        filterOption={() => true} // never filter any options
        isMulti={isMulti}
        onChange={this.handleChange}
        onInputChange={this.handleInputChange}
        onMenuOpen={this.handleMenuOpen}
        onMenuScrollToBottom={this.handleLoadMore}
        options={existingNodes.concat(!response ? [] : response.get('nodes', [])).map((node) => ({
          label: node.get('title'),
          value: NodeRef.fromNode(node),
          node,
        }))}
        value={value}
      />
    );
  }
}

export default connect(selector, delegate)(NodePickerField);
