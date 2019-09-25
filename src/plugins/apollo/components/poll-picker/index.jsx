import { Col, Row, ScrollableContainer } from '@triniti/admin-ui-plugin/components';
import { connect } from 'react-redux';
import createDelegateFactory from '@triniti/app/createDelegateFactory';
import debounce from 'lodash/debounce';
import Message from '@gdbots/pbj/Message';
import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';
import PropTypes from 'prop-types';
import React from 'react';
import Picker from './Picker';
import delegateFactory from './delegate';
import selector from './selector';
import SortableList from './SortableList';

class PollPicker extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    closeOnSelect: PropTypes.bool,
    delegate: PropTypes.shape({
      handleSearch: PropTypes.func.isRequired,
    }).isRequired,
    getNode: PropTypes.func.isRequired,
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
      hasLoadedFirstSet: false,
    };

    this.getNodes = debounce(this.getNodes.bind(this), 500);
    this.handleMenuOpen = this.handleMenuOpen.bind(this);
  }

  getNodes(input) {
    const { delegate } = this.props;
    delegate.handleSearch(input);
  }

  handleMenuOpen() {
    const { delegate } = this.props;
    const { hasLoadedFirstSet } = this.state;
    if (!hasLoadedFirstSet) {
      this.setState(() => ({
        hasLoadedFirstSet: true,
      }), delegate.handleSearch);
    }
  }

  render() {
    const {
      className,
      closeOnSelect,
      getNode,
      isMulti,
      onFilter,
      onMoveDown,
      onMoveUp,
      onPick,
      onSort,
      selectedPolls,
      response,
    } = this.props;

    return (
      <Row gutter="sm">
        <Col xs="12" md="6" className="pb-2">
          <Picker
            className={className}
            closeOnSelect={closeOnSelect}
            isMulti={isMulti}
            onMenuOpen={this.handleMenuOpen}
            onPick={onPick}
            options={!response ? [] : response.get('nodes', []).map((node) => ({
              label: node.get('title'),
              value: NodeRef.fromNode(node),
            }))}
            onInputChange={this.getNodes}
            response={response}
            value={selectedPolls}
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
                  getNode={getNode}
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
