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
} from '@triniti/admin-ui-plugin/components';
import CodeBlockPreview from '@triniti/cms/plugins/blocksmith/components/code-block-preview';
import UncontrolledTooltip from '@triniti/cms/plugins/common/components/uncontrolled-tooltip';


import changedDate from '../../utils/changedDate';
import changedTime from '../../utils/changedTime';

export default class CodeBlockModal extends React.Component {
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
      code: block.get('code'),
      hasUpdatedDate: block.has('updated_date'),
      updatedDate: block.has('updated_date') ? moment(block.get('updated_date')) : moment(),
      aside: block.get('aside'),
    };
    this.handleAddBlock = this.handleAddBlock.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleChangeCheckbox = this.handleChangeCheckbox.bind(this);
    this.handleChangeDate = this.handleChangeDate.bind(this);
    this.handleChangeTime = this.handleChangeTime.bind(this);
    this.handleEditBlock = this.handleEditBlock.bind(this);
  }

  componentDidMount() {
    setTimeout((t) => {
      t.inputElement.focus();
    }, 0, this);
  }

  setBlock() {
    const { code, hasUpdatedDate, updatedDate, aside } = this.state;
    const { block } = this.props;
    return block.schema().createMessage()
      .set('code', code || null)
      .set('updated_date', hasUpdatedDate ? updatedDate.toDate() : null)
      .set('aside', aside);
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

  handleChange({ target: { value: code } }) {
    this.setState({ code });
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

  render() {
    const { aside, code, hasUpdatedDate, updatedDate } = this.state;
    const { isOpen, isFreshBlock, toggle } = this.props;

    return (
      <Modal isOpen={isOpen} toggle={toggle}>
        <ModalHeader toggle={toggle}>{`${isFreshBlock ? 'Add' : 'Update'} Code Block`}</ModalHeader>
        <ModalBody className="modal-body-blocksmith">
          <FormGroup>
            <Label className="float-left">Code snippet</Label>
            <Input
              innerRef={(el) => { this.inputElement = el; }}
              onChange={this.handleChange}
              type="textarea"
              value={code || ''}
            />
          </FormGroup>
          <FormGroup className="mr-4">
            <Checkbox size="sd" id="hasUpdatedDate" checked={hasUpdatedDate} onChange={this.handleChangeCheckbox}>
              Is update
            </Checkbox>
            <Checkbox size="sd" id="aside" checked={aside} onChange={this.handleChangeCheckbox} className="ml-3">
              Aside
            </Checkbox>
            <Icon imgSrc="info-outline" id="aside-tooltip" size="xs" className="ml-1" />
            <UncontrolledTooltip target="aside-tooltip">Is only indirectly related to the main content.</UncontrolledTooltip>
          </FormGroup>
          {
          hasUpdatedDate
          && (
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
          )
        }
          {
          code && <CodeBlockPreview block={this.setBlock()} />
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
