import { Col, Row, ScrollableContainer } from '@triniti/admin-ui-plugin/components';
import { connect } from 'react-redux';
import classNames from 'classnames';
import createDelegateFactory from '@triniti/app/createDelegateFactory';
import debounce from 'lodash/debounce';
import get from 'lodash/get';
import Message from '@gdbots/pbj/Message';
import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';
import PropTypes from 'prop-types';
import React from 'react';
import Picker from './Picker';
import delegateFactory from './delegate';
import selector from './selector';
import SortableList from './SortableList';
import './styles.scss';

class PollPicker extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    closeOnSelect: PropTypes.bool,
    delegate: PropTypes.shape({
      handleSearch: PropTypes.func.isRequired,
    }).isRequired,
    isMulti: PropTypes.bool,
    onFilter: PropTypes.func.isRequired,
    onMoveDown: PropTypes.func.isRequired,
    onMoveUp: PropTypes.func.isRequired,
    onPick: PropTypes.func.isRequired,
    onSort: PropTypes.func.isRequired,
    response: PropTypes.instanceOf(Message),
    selectedPolls: PropTypes.arrayOf(PropTypes.instanceOf(NodeRef)),
  };

  static defaultProps = {
    className: '',
    closeOnSelect: false,
    isMulti: true,
    response: null,
    selectedPolls: [],
  };

  constructor(props) {
    super(props);

    this.state = {
      hasRequestedFirstSet: false,
      hasStoredSet: false,
      menuListScrollTop: 0,
      options: [],
      pickerInput: '',
    };

    this.getNodes = debounce(this.getNodes.bind(this), 500);
    this.handleMenuOpen = this.handleMenuOpen.bind(this);
    this.handlePick = this.handlePick.bind(this);
  }

  componentDidUpdate(prevProps) {
    const { response, selectedPolls } = this.props;
    const { hasStoredSet, menuListScrollTop, pickerInput } = this.state;

    if (prevProps.selectedPolls !== selectedPolls && this.menuList) {
      // scroll position is reset to 0 on pick, restore it here
      this.menuList.scrollTop = menuListScrollTop;
    }

    if (!hasStoredSet && response && response.get('ctx_request').get('q', '') === pickerInput) {
      this.setState(() => ({ // eslint-disable-line react/no-did-update-set-state
        hasStoredSet: true,
        options: response.get('nodes', []).map((node) => ({
          label: node.get('title'),
          value: NodeRef.fromNode(node),
          node,
        })),
      }));
    }
  }

  componentWillUnmount() {
    this.getNodes.cancel();
  }

  getNodes(input) {
    const { delegate } = this.props;
    this.setState(() => ({
      hasStoredSet: false,
      pickerInput: input,
    }), () => {
      delegate.handleSearch(input);
    });
  }

  handleMenuOpen() {
    const { delegate } = this.props;
    const { hasRequestedFirstSet } = this.state;
    if (!hasRequestedFirstSet) {
      this.setState(() => ({
        hasRequestedFirstSet: true,
      }), delegate.handleSearch);
    }
  }

  handlePick(picked) {
    const { onPick } = this.props;
    this.setState(({ menuListScrollTop }) => ({
      menuListScrollTop: get(this, 'menuList.scrollTop', menuListScrollTop), // capture scrollTop for later restoration
    }), () => {
      onPick(picked);
    });
  }

  render() {
    const {
      className,
      closeOnSelect,
      isMulti,
      onFilter,
      onMoveDown,
      onMoveUp,
      onSort,
      response,
      selectedPolls,
    } = this.props;
    const { options } = this.state;

    return (
      <Row gutter="sm">
        <Col xs="12" md="6" className="pb-2">
          <Picker
            className={classNames(className, 'poll-picker')}
            closeOnSelect={closeOnSelect}
            isMulti={isMulti}
            onInputChange={this.getNodes}
            onMenuOpen={this.handleMenuOpen}
            onPick={this.handlePick}
            options={options}
            response={response}
            selectedPolls={selectedPolls}
            menuListRef={(e) => { this.menuList = e; }}
          />
        </Col>
        <Col xs="12" md="6" className="pb-0">
          {selectedPolls.length
            ? (
              <ScrollableContainer
                className="h-x-md-auto"
                key="sortableList"
                style={{ height: 'calc(100vh - 184px)' }}
              >
                <SortableList
                  nodeRefs={selectedPolls}
                  onFilter={onFilter}
                  onMoveDown={onMoveDown}
                  onMoveUp={onMoveUp}
                  onSort={onSort}
                />
              </ScrollableContainer>
            ) : <h3 className="px-4 py-2">No polls selected</h3>}
        </Col>
      </Row>
    );
  }
}

export default connect(selector, createDelegateFactory(delegateFactory))(PollPicker);
