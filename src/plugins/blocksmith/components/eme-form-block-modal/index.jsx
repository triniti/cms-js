import DateTimePicker from '@triniti/cms/plugins/blocksmith/components/date-time-picker';
import Message from '@gdbots/pbj/Message';
import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';
import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';
import {
  Button,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Checkbox,
} from '@triniti/admin-ui-plugin/components';

export default class EmeFormBlockModal extends React.Component {
  static propTypes = {
    block: PropTypes.instanceOf(Message).isRequired,
    isFreshBlock: PropTypes.bool.isRequired,
    isOpen: PropTypes.bool,
    toggle: PropTypes.func.isRequired,
    onAddBlock: PropTypes.func.isRequired,
    onEditBlock: PropTypes.func.isRequired,
  };

  static defaultProps = {
    isOpen: false,
  };

  constructor(props) {
    super(props);

    const { block } = props;

    this.state = {
      errorMsg: '',
      touched: false,
      isValid: block.has('form_ref'),
      formRef: block.get('form_ref'),
      hasExpiresAt: block.has('expires_at'),
      expiresAt: block.get('expires_at', new Date()),
    };

    this.handleAddBlock = this.handleAddBlock.bind(this);
    this.handleChangeFormRef = this.handleChangeFormRef.bind(this);
    this.handleEditBlock = this.handleEditBlock.bind(this);
    this.handleChangeCheckbox = this.handleChangeCheckbox.bind(this);
    this.handleChangeDate = this.handleChangeDate.bind(this);
    this.handleChangeTime = this.handleChangeTime.bind(this);
  }

  componentDidMount() {
    this.inputElement.focus();
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

  handleChangeFormRef(event) {
    const input = event.target.value;
    let { errorMsg, formRef, isValid } = this.state;

    try {
      errorMsg = '';
      formRef = NodeRef.fromString(input);
      isValid = true;
    } catch (e) {
      errorMsg = e.getMessage();
      formRef = input;
      isValid = false;
    }

    this.setState({
      errorMsg,
      formRef,
      isValid,
      touched: true,
    });
  }

  handleChangeCheckbox({ target: { checked, id } }) {
    this.setState({ [id]: checked });
  }

  handleChangeDate(date) {
    this.setState({
      expiresAt: moment(date)
        .set('year', date.getFullYear())
        .set('month', date.getMonth())
        .set('date', date.getDate())
        .toDate(),
    });
  }

  handleChangeTime({ target: { value: time } }) {
    const { expiresAt } = this.state;
    this.setState({
      expiresAt: moment(expiresAt)
        .set('hours', time ? time.split(':')[0] : 0)
        .set('minutes', time ? time.split(':')[1] : 0)
        .toDate(),
    });
  }

  setBlock() {
    const { formRef, hasExpiresAt, expiresAt } = this.state;
    const { block } = this.props;

    return block.schema().createMessage()
      .set('form_ref', formRef || null)
      .set('expires_at', hasExpiresAt ? expiresAt : null);
  }

  render() {
    const {
      errorMsg,
      isValid,
      touched,
      formRef,
      hasExpiresAt,
      expiresAt,
    } = this.state;
    const { isFreshBlock, isOpen, toggle } = this.props;

    return (
      <Modal isOpen={isOpen} toggle={toggle}>
        <ModalHeader toggle={toggle}>{`${isFreshBlock ? 'Add' : 'Update'} EME Form Block`}</ModalHeader>
        <ModalBody>
          <FormGroup>
            <Label>{isValid ? 'EME Form Ref' : 'Enter EME Form Ref'}</Label>
            <Input
              innerRef={(el) => { this.inputElement = el; }}
              onChange={this.handleChangeFormRef}
              placeholder="eme:type:id"
              type="text"
              value={formRef || ''}
            />
          </FormGroup>
          <FormGroup className="mr-4">
            <Checkbox size="sd" id="hasExpiresAt" checked={hasExpiresAt} onChange={this.handleChangeCheckbox}>
              Has expiration date
            </Checkbox>
          </FormGroup>
          {hasExpiresAt
            && (
              <div className="modal-body-blocksmith">
                <DateTimePicker
                  onChangeDate={this.handleChangeDate}
                  onChangeTime={this.handleChangeTime}
                  label="Expires At"
                  updatedDate={expiresAt}
                />
              </div>
            )}
          {
            !isValid && touched && formRef !== ''
            && <p className="text-danger">{errorMsg}</p>
          }
        </ModalBody>
        <ModalFooter>
          <Button onClick={toggle}>Cancel</Button>
          <Button
            disabled={!isValid}
            onClick={isFreshBlock ? this.handleAddBlock : this.handleEditBlock}
          >
            {isFreshBlock ? 'Add' : 'Update'}
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}
