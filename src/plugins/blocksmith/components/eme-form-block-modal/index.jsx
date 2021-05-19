import Message from '@gdbots/pbj/Message';
import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';
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
    };

    this.handleAddBlock = this.handleAddBlock.bind(this);
    this.handleChangeFormRef = this.handleChangeFormRef.bind(this);
    this.handleEditBlock = this.handleEditBlock.bind(this);
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

  setBlock() {
    const {
      formRef,
    } = this.state;

    const { block } = this.props;

    return block.schema().createMessage()
      .set('form_ref', formRef || null);
  }

  render() {
    const {
      errorMsg,
      isValid,
      touched,
      formRef,
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
