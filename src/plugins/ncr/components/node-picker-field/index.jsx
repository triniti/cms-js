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
    constants: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
    fields: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
    handleClearChannel: PropTypes.func.isRequired,
    handleGetAll: PropTypes.func.isRequired,
    handleSearch: PropTypes.func.isRequired,
    isEditMode: PropTypes.bool,
    isFulfilled: PropTypes.bool.isRequired,
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
      existingNodes: [],
      hasLoadedFirstSet: false,
      inputValue: '',
      menuListScrollTop: 0,
    };

    this.handleLoadMore = debounce(this.handleLoadMore.bind(this), 500, {
      leading: false,
      trailing: true,
    });
    this.handleChange = this.handleChange.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleMenuOpen = this.handleMenuOpen.bind(this);
    this.handlePick = this.handlePick.bind(this);
    this.handleRemove = this.handleRemove.bind(this);
    this.handleScroll = debounce(this.handleScroll.bind(this), 500, {
      leading: false,
      trailing: true,
    });
  }

  /**
   * getting new nodes resets the scroll position, correct that here
   */
  componentDidUpdate(prevProps) {
    const { response } = this.props;
    const { menuListScrollTop } = this.state;
    if (!prevProps.response || !response) {
      return;
    }
    if (
      this.menuList
      && response.get('ctx_request').get('page') > 1
      && !response.get('response_id').equals(prevProps.response.get('response_id'))
    ) {
      this.menuList.scrollTop = menuListScrollTop;
    }
  }

  componentWillUnmount() {
    const { handleClearChannel, handleSearch } = this.props;
    handleClearChannel();
    this.handleLoadMore.cancel();
    this.handleScroll.cancel();
    handleSearch.cancel();
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
    this.setState(() => ({ inputValue: q }), () => {
      if (!isGetAll) {
        this.setState(() => ({ existingNodes: [] }), () => handleSearch(q));
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
    const { isGetAll, handleSearch, response } = this.props;
    if (isGetAll || !response.get('has_more')) {
      return;
    }
    this.setState(({ existingNodes, menuListScrollTop }, props) => ({
      existingNodes: [
        ...existingNodes,
        ...props.response.get('nodes', []),
      ],
      menuListScrollTop: get(this, 'menuList.scrollTop', menuListScrollTop),
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

  handleScroll(isScrolledToBottom) {
    const { isFulfilled } = this.props;
    if (isScrolledToBottom && isFulfilled) {
      this.handleLoadMore();
    }
  }

  handleSelect(nodeRef) {
    const { fields } = this.props;
    const isSelected = !!(fields.getAll() || []).find((ref) => ref.equals(nodeRef));
    if (isSelected) {
      this.handleRemove(nodeRef);
    } else {
      this.handlePick(nodeRef);
      this.setState(() => ({ inputValue: '' }));
    }
  }

  render() {
    const { fields, isMulti, selectComponents, response, value } = this.props;
    const { existingNodes, inputValue } = this.state;
    const MenuComponent = selectComponents.Menu || components.Menu;
    const OptionComponent = selectComponents.Option || components.Option;
    return (
      <Select
        {...this.props}
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
                onScroll: ({ target }) => this.handleScroll(target.scrollHeight - target.scrollTop === target.clientHeight),
              }}
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
        onKeyDown={this.handleKeyDown}
        inputValue={inputValue}
        onMenuOpen={this.handleMenuOpen}
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
