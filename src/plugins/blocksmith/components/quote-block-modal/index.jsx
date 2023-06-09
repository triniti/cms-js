import DateTimePicker from '@triniti/cms/plugins/blocksmith/components/date-time-picker';
import isValidUrl from '@gdbots/common/isValidUrl';
import Message from '@gdbots/pbj/Message';
import prependHttp from 'prepend-http';
import PropTypes from 'prop-types';
import QuoteBlockPreview from '@triniti/cms/plugins/blocksmith/components/quote-block-preview';
import React from 'react';
import {
  Button,
  Checkbox,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from '@triniti/admin-ui-plugin/components';


class QuoteBlockModal extends React.Component {
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
      isPullQuote: block.get('is_pull_quote'),
      isValid: true,
      source: block.get('source'),
      sourceUrl: block.get('source_url'),
      text: block.get('text') || '',
    };

    this.handleAddBlock = this.handleAddBlock.bind(this);
    this.handleChangeCheckbox = this.handleChangeCheckbox.bind(this);
    this.handleChangeInput = this.handleChangeInput.bind(this);
    this.handleChangeSourceUrl = this.handleChangeSourceUrl.bind(this);
    this.handleEditBlock = this.handleEditBlock.bind(this);
    this.handleChangeDate = this.handleChangeDate.bind(this);
    this.handleChangeTime = this.handleChangeTime.bind(this);
  }

  componentDidMount() {
    this.textElement.focus();
  }

  setBlock() {
    const { isPullQuote, source, sourceUrl, text } = this.state;
    const { block } = this.props;
    return block.schema().createMessage()
      .set('is_pull_quote', isPullQuote)
      .set('source_url', sourceUrl ? prependHttp(sourceUrl, { https: true }) : null)
      .set('source', source || null)
      .set('text', text || null);
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

  handleChangeInput({ target: { id, value } }) {
    this.setState({ [id]: value });
  }

  handleChangeSourceUrl({ target: { value } }) {
    this.setState({
      sourceUrl: value,
      isValid: !value || isValidUrl(prependHttp(value, { https: true })),
    });
  }

  render() {
    const {
      isPullQuote,
      isValid,
      source,
      sourceUrl,
      text,
    } = this.state;
    const { isFreshBlock, isOpen, toggle } = this.props;

    return (
      <Modal isOpen={isOpen} toggle={toggle}>
        <ModalHeader toggle={toggle}>
          {`${isFreshBlock ? 'Add' : 'Update'} Quote Block`}
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
              placeholder="Enter the quoted text here"
              type="textarea"
              value={text || ''}
            />
            <Label>Source</Label>
            <Input
              className="mb-3"
              id="source"
              name="source"
              onChange={this.handleChangeInput}
              placeholder="Source"
              type="text"
              value={source || ''}
            />
            <Label>Source URL</Label>
            <Input
              className="mb-3"
              name="sourceUrl"
              onChange={this.handleChangeSourceUrl}
              placeholder="Source URL"
              type="text"
              value={sourceUrl || ''}
            />
            {!isValid && <p className="text-danger">please enter a valid URL</p>}
            <FormGroup>
              <Checkbox
                checked={isPullQuote}
                id="isPullQuote"
                onChange={this.handleChangeCheckbox}
                size="sd"
              >
                Pull Quote
              </Checkbox>
            </FormGroup>
          </FormGroup>
          {
            isValid
            && <QuoteBlockPreview block={this.setBlock()} />
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

export default QuoteBlockModal;
