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
import './styles.scss';

class NodePickerField extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    clearSelectorCache: PropTypes.func.isRequired,
    constants: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
    fields: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
    handleClearChannel: PropTypes.func.isRequired,
    handleGetAll: PropTypes.func.isRequired,
    handleSearch: PropTypes.func.isRequired,
    isEditMode: PropTypes.bool,
    isGetAll: PropTypes.bool,
    isMulti: PropTypes.bool,
    isPending: PropTypes.bool.isRequired,
    response: PropTypes.instanceOf(Message),
    selectComponents: PropTypes.object, // eslint-disable-line react/forbid-prop-types
    shouldClearInputOnSelect: PropTypes.bool,
    value: PropTypes.array, // eslint-disable-line react/forbid-prop-types
  };

  static defaultProps = {
    className: '',
    isEditMode: true,
    isGetAll: false,
    isMulti: false,
    response: null,
    selectComponents: {},
    shouldClearInputOnSelect: true,
    value: [],
  };

  constructor(props) {
    super(props);

    this.initialState = {
      hasRequestedFirstSet: false,
      hasStoredFirstSet: false,
      inputValue: '',
      options: [],
      searchValue: '',
    };

    this.state = this.initialState;

    // this is stored outside of state so that setting it doesnt cause a re-render.
    this.menuListScrollTop = 0;

    this.handleLoadMore = debounce(this.handleLoadMore.bind(this), 500, {
      leading: false,
      trailing: true,
    });
    this.handleChange = this.handleChange.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleMenuClose = this.handleMenuClose.bind(this);
    this.handleMenuOpen = this.handleMenuOpen.bind(this);
    this.handlePick = this.handlePick.bind(this);
    this.handleRemove = this.handleRemove.bind(this);
    this.handleScroll = debounce(this.handleScroll.bind(this), 500, {
      leading: false,
      trailing: true,
    });
  }

  componentDidUpdate() {
    const { response } = this.props;
    const { hasStoredFirstSet, inputValue, options } = this.state;

    // bring node from fresh (non-infinite) search response into state
    if (
      !hasStoredFirstSet
      && response
      && response.get('ctx_request').get('q', '') === inputValue
      && response.has('nodes')
    ) {
      this.setState(() => ({ // eslint-disable-line react/no-did-update-set-state
        hasStoredFirstSet: true,
        options: response.get('nodes').map((node) => ({
          label: node.get('title'),
          value: NodeRef.fromNode(node),
          node,
        })),
      }));
    }

    // check if new (infinite) response has new nodes. if so, add to state
    if (
      hasStoredFirstSet
      && response
      && response.has('nodes')
      && options.length
      && !options[options.length - 1].value.equals(NodeRef.fromNode(response.get('nodes')[response.get('nodes').length - 1]))
    ) {
      this.setState(() => ({ // eslint-disable-line react/no-did-update-set-state
        options: [
          ...options,
          ...response.get('nodes', []).map((node) => ({
            label: node.get('title'),
            value: NodeRef.fromNode(node),
            node,
          })),
        ],
      }));
    }

    if (this.menuList && this.menuList.scrollTop !== this.menuListScrollTop) {
      this.menuList.scrollTop = this.menuListScrollTop;
    }
  }

  componentWillUnmount() {
    const { clearSelectorCache, handleClearChannel, handleSearch } = this.props;
    handleClearChannel();
    this.handleLoadMore.cancel();
    this.handleScroll.cancel();
    handleSearch.cancel();
    clearSelectorCache();
  }

  handleChange(selected, payload) {
    const { fields } = this.props;
    switch (payload.action) {
      case selectActionTypes.SELECT_OPTION:
      case selectActionTypes.DESELECT_OPTION:
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

  handleInputChange(q, { action }) {
    const { handleSearch, isGetAll } = this.props;

    if (action !== 'input-change') {
      return;
    }
    this.setState(() => ({ inputValue: q }), () => {
      if (!isGetAll) {
        this.setState(() => ({
          hasStoredFirstSet: false,
          options: [],
          searchValue: q,
        }), () => handleSearch(q));
      }
    });
  }

  handleKeyDown(e) {
    const { fields } = this.props;
    const { inputValue } = this.state;
    if (!inputValue && e.key === 'Backspace' && (fields.getAll() || []).length) {
      e.preventDefault();
      this.handleRemove(fields.getAll()[fields.getAll().length - 1]);
    }
  }

  handleLoadMore() {
    const { isGetAll, isPending, handleSearch, response } = this.props;
    if (isGetAll || isPending || !response.get('has_more')) {
      return;
    }
    handleSearch(response.get('ctx_request').get('q'), response.get('ctx_request').get('page') + 1);
  }

  handleMenuClose() {
    this.setState(() => this.initialState, () => { this.menuListScrollTop = 0; });
  }

  handleMenuOpen() {
    const { handleGetAll, handleSearch, isGetAll } = this.props;
    const { hasRequestedFirstSet } = this.state;
    if (!hasRequestedFirstSet) {
      this.setState(() => ({
        hasRequestedFirstSet: true,
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

  handleScroll() {
    this.menuListScrollTop = this.menuList.scrollTop;
    const isScrolledToBottom = this.menuList.scrollHeight - this.menuList.scrollTop === this.menuList.clientHeight;
    if (isScrolledToBottom) {
      this.handleLoadMore();
    }
  }

  handleSelect(nodeRef) {
    const { fields, shouldClearInputOnSelect } = this.props;
    const { searchValue } = this.state;

    const isSelected = !!(fields.getAll() || []).find((ref) => ref.equals(nodeRef));
    if (isSelected) {
      this.handleRemove(nodeRef);
    } else {
      this.handlePick(nodeRef);
      this.setState(() => ({ inputValue: shouldClearInputOnSelect ? '' : searchValue }));
    }
  }

  render() {
    const { fields, isGetAll, isMulti, isPending, selectComponents, value } = this.props;
    const { inputValue, options } = this.state;
    const MenuComponent = selectComponents.Menu || components.Menu;
    const OptionComponent = selectComponents.Option || components.Option;
    return (
      <Select
        {...this.props}
        className="node-picker-field"
        closeMenuOnSelect={false}
        components={{
          ...selectComponents,
          Menu: (props) => (
            <MenuComponent
              {...props}
              {...this.props}
              {...this.state}
              innerProps={{
                ...props.innerProps,
                onScroll: this.handleScroll,
              }}
            >
              {props.children}
            </MenuComponent>
          ),
          MenuList: (props) => (
            <components.MenuList
              {...props}
              innerRef={(e) => { props.innerRef(e); this.menuList = e; }}
            />
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
        filterOption={({ label }, input) => (isGetAll ? label.toLowerCase().includes(input.toLowerCase()) : true)}
        hideSelectedOptions={false}
        isLoading={isPending}
        isMulti={isMulti}
        onChange={this.handleChange}
        onInputChange={(q, action) => this.handleInputChange(q, action)}
        onKeyDown={this.handleKeyDown}
        inputValue={inputValue}
        onMenuClose={this.handleMenuClose}
        onMenuOpen={this.handleMenuOpen}
        options={options}
        value={value}
      />
    );
  }
}

export default connect(selector, delegate)(NodePickerField);
