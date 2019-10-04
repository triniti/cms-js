import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';

import Message from '@gdbots/pbj/Message';
import {
  Button,
  Checkbox,
  DatePicker,
  FormGroup,
  Icon,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  UncontrolledTooltip,
} from '@triniti/admin-ui-plugin/components';

import changedDate from '../../utils/changedDate';
import changedTime from '../../utils/changedTime';

class PageBreakBlockModal extends React.Component {
  static propTypes = {
    block: PropTypes.instanceOf(Message).isRequired,
    isFreshBlock: PropTypes.bool.isRequired,
    isOpen: PropTypes.bool,
    onAddBlock: PropTypes.func.isRequired,
    onEditBlock: PropTypes.func.isRequired,
    toggle: PropTypes.func.isRequired,
  };

  static defaultProps = {
    isOpen: false,
  };

  constructor(props) {
    super(props);
    const { block } = props;

    this.state = {
      hasUpdatedDate: block.has('updated_date'),
      readMoreText: block.get('read_more_text') || '',
      aside: block.get('aside'),
      updatedDate: block.has('updated_date') ? moment(block.get('updated_date')) : moment(),
    };

    this.handleAddBlock = this.handleAddBlock.bind(this);
    this.handleChangeDate = this.handleChangeDate.bind(this);
    this.handleChangeHasUpdatedDate = this.handleChangeHasUpdatedDate.bind(this);
    this.handleChangeAside = this.handleChangeAside.bind(this);
    this.handleChangeInput = this.handleChangeInput.bind(this);
    this.handleChangeTime = this.handleChangeTime.bind(this);
    this.handleEditBlock = this.handleEditBlock.bind(this);
  }

  componentDidMount() {
    setTimeout((t) => {
      t.textElement.focus();
    }, 0, this);
  }

  setBlock() {
    const { hasUpdatedDate, readMoreText, updatedDate, aside } = this.state;
    const { block } = this.props;
    return block.schema().createMessage()
      .set('read_more_text', readMoreText || null)
      .set('updated_date', hasUpdatedDate ? updatedDate.toDate() : null)
      .set('aside', aside);
  }

  handleAddBlock() {
    const { onAddBlock, toggle } = this.props;
    onAddBlock(this.setBlock());
    toggle();
  }

  handleChangeDate(date) {
    this.setState(changedDate(date));
  }

  handleChangeTime({ target: { value: time } }) {
    this.setState(changedTime(time));
  }

  handleChangeHasUpdatedDate() {
    this.setState(({ hasUpdatedDate }) => ({ hasUpdatedDate: !hasUpdatedDate }));
  }

  handleChangeAside() {
    this.setState(({ aside }) => ({ aside: !aside }));
  }

  handleChangeInput({ target: { value: readMoreText } }) {
    this.setState({ readMoreText });
  }

  handleEditBlock() {
    const { onEditBlock, toggle } = this.props;
    onEditBlock(this.setBlock());
    toggle();
  }

  render() {
    const { readMoreText, hasUpdatedDate, updatedDate, aside } = this.state;
    const { isFreshBlock, isOpen, toggle } = this.props;

    return (
      <Modal isOpen={isOpen} toggle={toggle}>
        <ModalHeader toggle={toggle}>
          {`${isFreshBlock ? 'Add' : 'Update'} Page Break Block`}
        </ModalHeader>
        <ModalBody className="p-4">
          <FormGroup>
            <Label>Read More Text</Label>
            <Input
              className="mb-3"
              innerRef={(el) => { this.textElement = el; }}
              name="content"
              onChange={this.handleChangeInput}
              placeholder="Enter the read more text here"
              type="text"
              value={readMoreText}
            />
          </FormGroup>
          <FormGroup>
            <Checkbox size="sd" checked={hasUpdatedDate} onChange={this.handleChangeHasUpdatedDate}>
              Is update
            </Checkbox>
            <Checkbox size="sd" checked={aside} onChange={this.handleChangeAside} className="ml-3">
              Aside
            </Checkbox>
            <Icon imgSrc="info-outline" id="aside-tooltip" size="xs" style={{ marginLeft: '0.3rem' }} />
            <UncontrolledTooltip key="tooltip" placement="bottom" target="aside-tooltip">Is only indirectly related to the main content.</UncontrolledTooltip>
          </FormGroup>
          {
            hasUpdatedDate
            && (
              <div className="modal-body-blocksmith">
                <FormGroup>
                  <Label>
                    Updated Time: {updatedDate.format('YYYY-MM-DD hh:mm A')}
                  </Label>
                  <FormGroup className="mb-3 mt-1 shadow-none">
                    <DatePicker
                      onChange={this.handleChangeDate}
                      selected={updatedDate}
                      shouldCloseOnSelect={false}
                      inline
                    />
                    <InputGroup style={{ width: '15rem', margin: 'auto' }}>
                      <InputGroupAddon addonType="prepend" className="text-dark">
                        <InputGroupText>
                          <Icon imgSrc="clock-outline" />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        type="time"
                        onChange={this.handleChangeTime}
                        defaultValue={updatedDate.format('HH:mm')}
                      />
                    </InputGroup>
                  </FormGroup>
                </FormGroup>
              </div>
            )
          }
        </ModalBody>
        <ModalFooter>
          <Button onClick={toggle}>Cancel</Button>
          <Button onClick={isFreshBlock ? this.handleAddBlock : this.handleEditBlock}>
            {isFreshBlock ? 'Add' : 'Update'}
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}

export default PageBreakBlockModal;
