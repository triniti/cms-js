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
    };

    this.handleAddBlock = this.handleAddBlock.bind(this);
    this.handleChangeCheckbox = this.handleChangeCheckbox.bind(this);
    this.handleChangeInput = this.handleChangeInput.bind(this);
    this.handleEditBlock = this.handleEditBlock.bind(this);
  }

  componentDidMount() {
    setTimeout((t) => {
      t.textElement.focus();
    }, 0, this);
  }

  setBlock() {
    const { readMoreText } = this.state;
    const { block } = this.props;
    return block.schema().createMessage()
      .set('read_more_text', readMoreText || null)
  }

  handleAddBlock() {
    const { onAddBlock, toggle } = this.props;
    onAddBlock(this.setBlock());
    toggle();
  }

  handleChangeCheckbox({ target: { checked, id } }) {
    this.setState({ [id]: checked });
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
    const {  readMoreText } = this.state;
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
