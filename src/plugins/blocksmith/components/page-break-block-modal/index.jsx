import DateTimePicker from '@triniti/cms/plugins/blocksmith/components/date-time-picker';
import Message from '@gdbots/pbj/Message';
import PropTypes from 'prop-types';
import React from 'react';
import UncontrolledTooltip from '@triniti/cms/plugins/common/components/uncontrolled-tooltip';
import {
  Button,
  Checkbox,
  FormGroup,
  Icon,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
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
      aside: block.get('aside'),
      hasUpdatedDate: block.has('updated_date'),
      readMoreText: block.get('read_more_text') || '',
      updatedDate: block.has('updated_date') ? block.get('updated_date') : new Date(),
    };

    this.handleAddBlock = this.handleAddBlock.bind(this);
    this.handleChangeCheckbox = this.handleChangeCheckbox.bind(this);
    this.handleChangeDate = this.handleChangeDate.bind(this);
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
    const { aside, hasUpdatedDate, readMoreText, updatedDate } = this.state;
    const { block } = this.props;
    return block.schema().createMessage()
      .set('read_more_text', readMoreText || null)
      .set('updated_date', hasUpdatedDate ? updatedDate : null)
      .set('aside', aside);
  }

  handleAddBlock() {
    const { onAddBlock, toggle } = this.props;
    onAddBlock(this.setBlock());
    toggle();
  }

  handleChangeCheckbox({ target: { checked, id } }) {
    this.setState({ [id]: checked });
  }

  handleChangeDate(date) {
    this.setState(changedDate(date));
  }

  handleChangeTime({ target: { value: time } }) {
    this.setState(changedTime(time));
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
    const { aside, hasUpdatedDate, readMoreText, updatedDate } = this.state;
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
            <Checkbox size="sd" id="hasUpdatedDate" checked={hasUpdatedDate} onChange={this.handleChangeCheckbox}>
              Is update
            </Checkbox>
            <Checkbox size="sd" id="aside" checked={aside} onChange={this.handleChangeCheckbox} className="ml-3">
              Aside
            </Checkbox>
            <Icon imgSrc="info-outline" id="aside-tooltip" size="xs" className="ml-1" />
            <UncontrolledTooltip target="aside-tooltip">Is only indirectly related to the main content.</UncontrolledTooltip>
          </FormGroup>
          {hasUpdatedDate
          && (
            <div className="modal-body-blocksmith">
              <DateTimePicker
                onChangeDate={this.handleChangeDate}
                onChangeTime={this.handleChangeTime}
                updatedDate={updatedDate}
              />
            </div>
          )}
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
