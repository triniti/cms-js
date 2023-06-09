import dividerBlockConfig from 'config/dividerBlockConfig'; // eslint-disable-line import/no-unresolved
import PropTypes from 'prop-types';
import React from 'react';

import Message from '@gdbots/pbj/Message';
import {
  Button,
  Checkbox,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader, Select,
} from '@triniti/admin-ui-plugin/components';
import DividerBlockPreview from '@triniti/cms/plugins/blocksmith/components/divider-block-preview';
import DateTimePicker from '@triniti/cms/plugins/blocksmith/components/date-time-picker';
import CustomOption from './CustomOption';
import changedTime from '../../utils/changedTime';
import changedDate from '../../utils/changedDate';


class DividerBlockModal extends React.Component {
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
      text: block.get('text') || '',
      strokeColor: block.get('stroke_color', 'primary'),
      strokeStyle: block.get('stroke_style', 'solid')
    };

    this.handleAddBlock = this.handleAddBlock.bind(this);
    this.handleChangeInput = this.handleChangeInput.bind(this);
    this.handleChangeStrokeColor = this.handleChangeStrokeColor.bind(this);
    this.handleChangeStrokeStyle = this.handleChangeStrokeStyle.bind(this);
    this.handleEditBlock = this.handleEditBlock.bind(this);
  }

  componentDidMount() {
    this.textElement.focus();
  }

  setBlock() {
    const {  text, strokeColor, strokeStyle } = this.state;
    const { block } = this.props;
    const setBlock = block.schema().createMessage()
      .set('text', text)
      .set('stroke_style', strokeStyle)

    if (strokeColor) {
      setBlock.set('stroke_color', strokeColor.replace(/\s/g, '-').replace(/[A-Z]/g, (m) => m.toLowerCase()));
    }

    return setBlock;
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


  handleChangeInput({ target: { id, value } }) {
    this.setState({ [id]: value });
  }

  handleChangeStrokeColor({ value: strokeColor }) {
    this.setState({ strokeColor });
  }

  handleChangeStrokeStyle({ value: strokeStyle }) {
    this.setState({ strokeStyle });
  }

  render() {
    const {
      text,
      strokeColor,
      strokeStyle,
    } = this.state;
    const { isFreshBlock, isOpen, toggle } = this.props;

    return (
      <Modal isOpen={isOpen} toggle={toggle}>
        <ModalHeader toggle={toggle}>
          {`${isFreshBlock ? 'Add' : 'Update'} Divider Block`}
        </ModalHeader>
        <ModalBody className="p-0">
          <FormGroup className="px-4">
            <Label className="pt-4">Text</Label>
            <Input
              className="mb-3"
              id="text"
              innerRef={(el) => { this.textElement = el; }}
              name="content"
              onChange={this.handleChangeInput}
              placeholder="Enter divider text here"
              value={text || ''}
            />
            <Label>Stroke Color</Label>
            <Select
              className="mb-3"
              onChange={this.handleChangeStrokeColor}
              value={{ label: strokeColor, value: strokeColor }}
              options={dividerBlockConfig}
              isSelected={!!strokeColor}
              strokeStyle={strokeStyle}
              components={{ Option: CustomOption }}
            />
            <Label>Stroke Style</Label>
            <Select
              className="mb-3"
              onChange={this.handleChangeStrokeStyle}
              value={{ label: strokeStyle, value: strokeStyle }}
              options={[
                { label: 'solid (default)', value: 'solid' },
                { label: 'dotted', value: 'dotted' },
                { label: 'dashed', value: 'dashed' },
              ]}
              strokeColor={strokeColor}
              components={{ Option: CustomOption }}
            />
          </FormGroup>
          <DividerBlockPreview block={this.setBlock()} />
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

export default DividerBlockModal;
