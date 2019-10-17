import { connect } from 'react-redux';
import Message from '@gdbots/pbj/Message';
import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';
import PollPicker from '@triniti/cms/plugins/apollo/components/poll-picker';
import PropTypes from 'prop-types';
import React from 'react';
import {
  Modal,
  ModalBody,
  ScrollableContainer,
} from '@triniti/admin-ui-plugin/components';

import changedDate from '../../utils/changedDate';
import changedTime from '../../utils/changedTime';
import CustomizeOptions from './CustomizeOptions';
import Footer from './Footer';
import Header from './Header';
import selector from './selector';

class PollGridBlockModal extends React.Component {
  static propTypes = {
    block: PropTypes.instanceOf(Message).isRequired,
    isFreshBlock: PropTypes.bool.isRequired,
    isOpen: PropTypes.bool,
    onAddBlock: PropTypes.func.isRequired,
    onEditBlock: PropTypes.func.isRequired,
    pollRefs: PropTypes.arrayOf(PropTypes.instanceOf(NodeRef)),
    toggle: PropTypes.func.isRequired,
  };

  static defaultProps = {
    isOpen: false,
    pollRefs: null,
  };

  constructor(props) {
    super(props);
    const { block, pollRefs } = props;

    this.state = {
      activeStep: 0,
      aside: block.get('aside'),
      hasUpdatedDate: block.has('updated_date'),
      selectedPollRefs: pollRefs || [],
      updatedDate: block.get('updated_date', new Date()),
    };

    this.handleAddBlock = this.handleAddBlock.bind(this);
    this.handleChangeCheckbox = this.handleChangeCheckbox.bind(this);
    this.handleChangeDate = this.handleChangeDate.bind(this);
    this.handleChangeStep = this.handleChangeStep.bind(this);
    this.handleChangeTime = this.handleChangeTime.bind(this);
    this.handleEditBlock = this.handleEditBlock.bind(this);
    this.handleFilter = this.handleFilter.bind(this);
    this.handleMoveDown = this.handleMoveDown.bind(this);
    this.handleMoveUp = this.handleMoveUp.bind(this);
    this.handlePick = this.handlePick.bind(this);
    this.handleReorder = this.handleReorder.bind(this);
  }

  setBlock() {
    const { aside, hasUpdatedDate, selectedPollRefs, updatedDate } = this.state;
    const { block } = this.props;
    return block.schema().createMessage()
      .addToList('node_refs', selectedPollRefs)
      .set('aside', aside)
      .set('updated_date', hasUpdatedDate ? updatedDate : null);
  }

  handleAddBlock() {
    const { onAddBlock, toggle } = this.props;
    onAddBlock(this.setBlock());
    toggle();
  }

  handleEditBlock() {
    const { onEditBlock, toggle } = this.props;
    onEditBlock(this.setBlock());
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

  handleChangeStep() {
    this.setState(({ activeStep }) => ({ activeStep: activeStep ? 0 : 1 }));
  }

  handleFilter(selectedIndex) {
    const { selectedPollRefs } = this.state;
    this.setState({
      selectedPollRefs: selectedPollRefs.filter((value, index) => index !== selectedIndex),
    });
  }

  handleReorder(oldIndex, newIndex) {
    const { selectedPollRefs } = this.state;
    if (selectedPollRefs[oldIndex] === undefined || selectedPollRefs[newIndex] === undefined) {
      return;
    }

    const filtered = selectedPollRefs.filter((value, index) => index !== oldIndex);

    this.setState({
      selectedPollRefs: [
        ...filtered.slice(0, newIndex),
        selectedPollRefs[oldIndex],
        ...filtered.slice(newIndex),
      ],
    });
  }

  handleMoveDown(index) {
    const { selectedPollRefs } = this.state;
    if (index === selectedPollRefs.length - 1) {
      return;
    }

    this.setState({
      selectedPollRefs: [
        ...selectedPollRefs.slice(0, index),
        selectedPollRefs[index + 1],
        selectedPollRefs[index],
        ...selectedPollRefs.slice(index + 2),
      ],
    });
  }

  handleMoveUp(index) {
    const { selectedPollRefs } = this.state;
    if (index === 0) {
      return;
    }

    this.setState({
      selectedPollRefs: [
        ...selectedPollRefs.slice(0, index - 1),
        selectedPollRefs[index],
        selectedPollRefs[index - 1],
        ...selectedPollRefs.slice(index + 1),
      ],
    });
  }

  handlePick(selected) {
    const { selectedPollRefs } = this.state;
    let polls = [];

    const isSelected = !!selectedPollRefs.find((ref) => ref.equals(selected));
    if (isSelected) {
      polls = selectedPollRefs.filter((ref) => !ref.equals(selected));
    } else {
      polls = selectedPollRefs.concat(selected);
    }

    // if (selected.length > selectedPollRefs.length) {
    //   polls = selectedPollRefs.concat(selected[selected.length - 1]);
    // } else {
    //   polls = selectedPollRefs
    //     .filter(({ value }) => selected
    //       .findIndex(({ value: selectedValue }) => selectedValue === value) >= 0);
    // }

    this.setState({ selectedPollRefs: polls });
  }

  render() {
    const { activeStep, aside, hasUpdatedDate, selectedPollRefs, updatedDate } = this.state;
    const { isFreshBlock, isOpen, toggle } = this.props;

    return (
      <Modal centered isOpen={isOpen} toggle={toggle} size="xxl">
        <Header
          activeStep={activeStep}
          isFreshBlock={isFreshBlock}
          toggle={toggle}
        />
        <ModalBody className="p-0">
          <ScrollableContainer
            className="bg-gray-400"
            style={{ height: 'calc(100vh - 167px)' }}
          >
            <div className="modal-body-blocksmith">
              {activeStep === 0
                && (
                  <PollPicker
                    className="sticky-top"
                    onFilter={this.handleFilter}
                    onMoveDown={this.handleMoveDown}
                    onMoveUp={this.handleMoveUp}
                    onPick={this.handlePick}
                    onSort={this.handleReorder}
                    selectedPolls={selectedPollRefs}
                  />
                )}
              {activeStep === 1
                && (
                  <CustomizeOptions
                    aside={aside}
                    hasUpdatedDate={hasUpdatedDate}
                    onChangeCheckBox={this.handleChangeCheckbox}
                    onChangeDate={this.handleChangeDate}
                    onChangeTime={this.handleChangeTime}
                    updatedDate={updatedDate}
                  />
                )}
            </div>
          </ScrollableContainer>
        </ModalBody>
        <Footer
          activeStep={activeStep}
          isFreshBlock={isFreshBlock}
          onAddBlock={this.handleAddBlock}
          onChangeStep={this.handleChangeStep}
          onEditBlock={this.handleEditBlock}
          selectedPollRefs={selectedPollRefs}
          toggle={toggle}
        />
      </Modal>
    );
  }
}

export default connect(selector)(PollGridBlockModal);
