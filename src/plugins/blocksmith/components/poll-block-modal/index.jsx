import { connect } from 'react-redux';
import createDelegateFactory from '@triniti/app/createDelegateFactory';
import Message from '@gdbots/pbj/Message';
import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';
import PollsTable from '@triniti/cms/plugins/apollo/components/polls-table';
import PropTypes from 'prop-types';
import React from 'react';
import {
  Modal,
  ModalBody,
  ScrollableContainer,
  Spinner,
} from '@triniti/admin-ui-plugin/components';

import changedDate from '../../utils/changedDate';
import changedTime from '../../utils/changedTime';
import CustomizeOptions from './CustomizeOptions';
import delegateFactory from './delegate';
import Footer from './Footer';
import Header from './Header';
import SearchBar from '../search-bar';
import selector from './selector';

class PollBlockModal extends React.Component {
  static propTypes = {
    blockKey: PropTypes.string.isRequired,
    block: PropTypes.instanceOf(Message).isRequired,
    isFulfilled: PropTypes.bool.isRequired,
    isFreshBlock: PropTypes.bool.isRequired,
    isOpen: PropTypes.bool,
    onAddBlock: PropTypes.func.isRequired,
    onEditBlock: PropTypes.func.isRequired,
    poll: PropTypes.instanceOf(Message),
    polls: PropTypes.arrayOf(PropTypes.instanceOf(Message)).isRequired,
    sort: PropTypes.string.isRequired,
    toggle: PropTypes.func.isRequired,
    delegate: PropTypes.shape({
      handleSearch: PropTypes.func.isRequired,
      handleClearChannel: PropTypes.func.isRequired,
    }).isRequired,
  };

  static defaultProps = {
    isOpen: false,
    poll: null,
  };

  constructor(props) {
    super(props);
    const { block, poll } = props;
    this.state = {
      activeStep: 0,
      aside: block.get('aside'),
      hasUpdatedDate: block.has('updated_date'),
      isReadyToDisplay: false,
      q: '',
      selectedPoll: poll || null,
      updatedDate: block.get('updated_date', new Date()),
    };
    this.handleAddBlock = this.handleAddBlock.bind(this);
    this.handleChangeCheckbox = this.handleChangeCheckbox.bind(this);
    this.handleChangeDate = this.handleChangeDate.bind(this);
    this.handleChangeQ = this.handleChangeQ.bind(this);
    this.handleChangeStep = this.handleChangeStep.bind(this);
    this.handleChangeTime = this.handleChangeTime.bind(this);
    this.handleEditBlock = this.handleEditBlock.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleSelectPoll = this.handleSelectPoll.bind(this);
  }

  componentDidMount() {
    const { delegate } = this.props;
    delegate.handleSearch();
  }

  UNSAFE_componentWillReceiveProps({ isFulfilled }) {
    const { isReadyToDisplay } = this.state;
    if (!isReadyToDisplay && isFulfilled) {
      this.setState({ isReadyToDisplay: true });
    }
  }

  componentWillUnmount() {
    const { delegate } = this.props;
    delegate.handleClearChannel();
  }

  setBlock() {
    const { hasUpdatedDate, selectedPoll, updatedDate, aside } = this.state;
    const { block } = this.props;
    return block.schema().createMessage()
      .set('aside', aside)
      .set('node_ref', selectedPoll ? selectedPoll.get('_id').toNodeRef() : null)
      .set('updated_date', hasUpdatedDate ? updatedDate : null);
  }

  handleAddBlock() {
    const { onAddBlock, toggle, blockKey } = this.props;
    onAddBlock(this.setBlock(), blockKey);
    toggle();
  }

  handleEditBlock() {
    const { onEditBlock, toggle, blockKey } = this.props;
    onEditBlock(this.setBlock(), blockKey);
    toggle();
  }

  handleChangeCheckbox({ target: { id, checked } }) {
    this.setState({ [id]: checked });
  }

  handleChangeDate(date) {
    this.setState(changedDate(date));
  }

  handleChangeTime({ target: { value: time } }) {
    this.setState(changedTime(time));
  }

  handleChangeQ({ target: { value: q } }) {
    this.setState({ q }, this.handleSearch);
  }

  handleChangeStep() {
    this.setState(({ activeStep }) => ({ activeStep: activeStep ? 0 : 1 }));
  }

  handleSearch() {
    this.setState({ isReadyToDisplay: false }, () => {
      const { q } = this.state;
      const { delegate } = this.props;
      delegate.handleSearch({ q });
    });
  }

  handleSelectPoll(selectedPoll) {
    this.setState({ selectedPoll });
  }

  render() {
    const {
      activeStep,
      aside,
      hasUpdatedDate,
      isReadyToDisplay,
      q,
      selectedPoll,
      updatedDate,
    } = this.state;

    const {
      blockKey,
      isFreshBlock,
      isOpen,
      polls,
      sort,
      toggle,
    } = this.props;

    return (
      <Modal centered isOpen={isOpen} toggle={toggle} size="xxl">
        <Header
          activeStep={activeStep}
          isFreshBlock={isFreshBlock}
          toggle={toggle}
        />
        <ModalBody className="p-0">
          {activeStep === 0
            && (
              <SearchBar
                onChangeQ={this.handleChangeQ}
                onClick={this.handleSearch}
                placeholder="Search polls..."
                value={q}
              />
            )}
          <ScrollableContainer
            className="bg-gray-400"
            style={{ height: `calc(100vh - ${activeStep === 0 ? 212 : 167}px)` }}
          >
            {
              !isReadyToDisplay
              && <Spinner centered />
            }
            {isReadyToDisplay && !polls.length
              && (
                <div className="not-found-message">
                  <p>No Polls found that match your criteria</p>
                </div>
              )}
            {activeStep === 0 && isReadyToDisplay && !!polls.length
              && (
                <PollsTable
                  isBulkOperationEnabled={false}
                  nodes={polls}
                  onSelectRow={this.handleSelectPoll}
                  onSort={this.handleSearch}
                  selectedRows={selectedPoll ? [NodeRef.fromNode(selectedPoll)] : []}
                  sort={sort}
                />
              )}
            {activeStep === 1
              && (
                <CustomizeOptions
                  aside={aside}
                  block={this.setBlock()}
                  hasUpdatedDate={hasUpdatedDate}
                  onChangeCheckBox={this.handleChangeCheckbox}
                  onChangeDate={this.handleChangeDate}
                  onChangeTime={this.handleChangeTime}
                  updatedDate={updatedDate}
                />
              )}
          </ScrollableContainer>
        </ModalBody>
        <Footer
          blockKey={blockKey}
          block={this.setBlock()}
          activeStep={activeStep}
          isFreshBlock={isFreshBlock}
          onAddBlock={this.handleAddBlock}
          onChangeStep={this.handleChangeStep}
          onEditBlock={this.handleEditBlock}
          selectedPoll={selectedPoll}
          toggle={toggle}
        />
      </Modal>
    );
  }
}

export default connect(selector, createDelegateFactory(delegateFactory))(PollBlockModal);
