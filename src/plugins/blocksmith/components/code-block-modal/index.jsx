import CodeBlockPreview from '@triniti/cms/plugins/blocksmith/components/code-block-preview';
import Message from '@gdbots/pbj/Message';
import PropTypes from 'prop-types';
import React from 'react';
import {
  Button,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from '@triniti/admin-ui-plugin/components';


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
    };
    this.handleAddBlock = this.handleAddBlock.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleChangeCheckbox = this.handleChangeCheckbox.bind(this);
    this.handleEditBlock = this.handleEditBlock.bind(this);
  }

  componentDidMount() {
    setTimeout((t) => {
      t.inputElement.focus();
    }, 0, this);
  }

  setBlock() {
    const { code } = this.state;
    const { block } = this.props;
    return block.schema().createMessage()
      .set('code', code || null)
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

  render() {
    const { code } = this.state;
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
          {code && <CodeBlockPreview block={this.setBlock()} />}
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
