import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import Message from '@gdbots/pbj/Message';
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from '@triniti/admin-ui-plugin/components';
import DateTimePicker from '@triniti/cms/plugins/blocksmith/components/date-time-picker';

import changedDate from '../../utils/changedDate';
import changedTime from '../../utils/changedTime';

export default class TextBlockModal extends React.Component {
  static propTypes = {
    block: PropTypes.instanceOf(Message).isRequired,
    toggle: PropTypes.func.isRequired,
    isOpen: PropTypes.bool,
    onEditBlock: PropTypes.func.isRequired,
  };

  static defaultProps = {
    isOpen: false,
  };

  constructor(props) {
    super(props);
    const { block } = props;
    this.state = {
      updatedDate: block.has('updated_date') ? moment(block.get('updated_date')) : moment(),
    };
    this.handleEditBlock = this.handleEditBlock.bind(this);
    this.handleRemove = this.handleRemove.bind(this);
    this.handleChangeDate = this.handleChangeDate.bind(this);
    this.handleChangeTime = this.handleChangeTime.bind(this);
  }

  handleEditBlock() {
    const { updatedDate } = this.state;
    const { block, onEditBlock, toggle } = this.props;
    onEditBlock(block.clone().set('updated_date', updatedDate.toDate()));
    toggle();
  }

  handleChangeDate(date) {
    this.setState(changedDate(date));
  }

  handleChangeTime({ target: { value: time } }) {
    this.setState(changedTime(time));
  }

  handleRemove() {
    const { block, onEditBlock, toggle } = this.props;
    onEditBlock(block.clone().clear('updated_date'));
    toggle();
  }

  render() {
    const { updatedDate } = this.state;
    const { block, isOpen, toggle } = this.props;

    return (
      <Modal isOpen={isOpen} toggle={toggle}>
        <ModalHeader toggle={toggle}>Update Text Block</ModalHeader>
        <ModalBody>
          <div className="modal-body-blocksmith">
            <DateTimePicker
              onChangeDate={this.handleChangeDate}
              onChangeTime={this.handleChangeTime}
              updatedDate={updatedDate}
            />
          </div>
        </ModalBody>
        <ModalFooter>
          {
            block.has('updated_date')
            && <Button onClick={this.handleRemove}>Remove</Button>
          }
          <Button onClick={toggle}>Cancel</Button>
          <Button onClick={this.handleEditBlock}>{block.has('updated_date') ? 'Update' : 'Add'}</Button>
        </ModalFooter>
      </Modal>
    );
  }
}
