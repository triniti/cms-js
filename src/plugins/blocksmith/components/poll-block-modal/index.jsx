import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import createDelegateFactory from '@triniti/app/createDelegateFactory';
import Message from '@gdbots/pbj/Message';
import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';
import PollsTable from '@triniti/cms/plugins/apollo/components/polls-table';
import {
  Modal,
  ModalBody,
  ScrollableContainer,
  Spinner,
} from '@triniti/admin-ui-plugin/components';

import changedDate from '../../utils/changedDate';
import changedTime from '../../utils/changedTime';
import CustomizeOptions from './CustomizeOptions';
import Footer from './Footer';
import Header from './Header';
import SearchBar from '../search-bar';
import delegateFactory from './delegate';
import selector from './selector';

class PollBlockModal extends React.Component {
  static propTypes = {
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
      hasUpdatedDate: block.has('updated_date'),
      isReadyToDisplay: false,
      q: '',
      selectedPoll: poll || null,
      updatedDate: block.has('updated_date') ? moment(block.get('updated_date')) : moment(),
    };
    this.handleAddBlock = this.handleAddBlock.bind(this);
    this.handleChangeDate = this.handleChangeDate.bind(this);
    this.handleChangeHasUpdatedDate = this.handleChangeHasUpdatedDate.bind(this);
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
    const { hasUpdatedDate, selectedPoll, updatedDate } = this.state;
    const { block } = this.props;
    return block.schema().createMessage()
      .set('node_ref', selectedPoll.get('_id').toNodeRef())
      .set('updated_date', hasUpdatedDate ? updatedDate.toDate() : null);
  }

  handleAddBlock() {
    const { onAddBlock, toggle } = this.props;
    onAddBlock(this.setBlock());
    toggle();
  }

  handleChangeHasUpdatedDate() {
    this.setState(({ hasUpdatedDate }) => ({ hasUpdatedDate: !hasUpdatedDate }));
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

  handleEditBlock() {
    const { onEditBlock, toggle } = this.props;
    onEditBlock(this.setBlock());
    toggle();
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
      hasUpdatedDate,
      isReadyToDisplay,
      q,
      selectedPoll,
      updatedDate,
    } = this.state;
    const { isFreshBlock, isOpen, toggle, sort, polls } = this.props;

    return (
      <Modal centered isOpen={isOpen} toggle={toggle} size="xxl">
        <Header
          activeStep={activeStep}
          isFreshBlock={isFreshBlock}
          toggle={toggle}
        />
        <ModalBody className="p-0">
          {
            activeStep === 0
            && (
              <SearchBar
                onChangeQ={this.handleChangeQ}
                onClick={this.handleSearch}
                placeholder="Search polls..."
                value={q}
              />
            )
          }
          <ScrollableContainer
            className="bg-gray-400"
            style={{ height: `calc(100vh - ${activeStep === 0 ? 212 : 167}px)` }}
          >
            {
              !isReadyToDisplay
              && <Spinner centered />
            }
            {
              isReadyToDisplay && !polls.length
              && (
                <div className="not-found-message">
                  <p>No Polls found that match your criteria</p>
                </div>
              )
            }
            {
              activeStep === 0 && isReadyToDisplay && !!polls.length
              && (
                <PollsTable
                  isBulkOperationEnabled={false}
                  nodes={polls}
                  onSelectRow={this.handleSelectPoll}
                  onSort={this.handleSearch}
                  selectedRows={selectedPoll ? [NodeRef.fromNode(selectedPoll)] : []}
                  sort={sort}
                />
              )
            }
            {
              activeStep === 1
              && (
                <CustomizeOptions
                  block={this.setBlock()}
                  hasUpdatedDate={hasUpdatedDate}
                  onChangeDate={this.handleChangeDate}
                  onChangeHasUpdatedDAte={this.handleChangeHasUpdatedDate}
                  onChangeTime={this.handleChangeTime}
                  updatedDate={updatedDate}
                />
              )
            }
          </ScrollableContainer>
        </ModalBody>
        <Footer
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
