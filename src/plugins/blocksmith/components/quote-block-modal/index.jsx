import DateTimePicker from '@triniti/cms/plugins/blocksmith/components/date-time-picker';
import isValidUrl from '@gdbots/common/isValidUrl';
import Message from '@gdbots/pbj/Message';
import prependHttp from 'prepend-http';
import PropTypes from 'prop-types';
import QuoteBlockPreview from '@triniti/cms/plugins/blocksmith/components/quote-block-preview';
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

class QuoteBlockModal extends React.Component {
  static propTypes = {
    blockKey: PropTypes.string.isRequired,
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
      isPullQuote: block.get('is_pull_quote'),
      isValid: true,
      source: block.get('source'),
      sourceUrl: block.get('source_url'),
      text: block.get('text') || '',
      updatedDate: block.get('updated_date', new Date()),
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
    const { hasUpdatedDate, isPullQuote, source, sourceUrl, text, updatedDate } = this.state;
    const { block } = this.props;
    return block.schema().createMessage()
      .set('is_pull_quote', isPullQuote)
      .set('source_url', sourceUrl ? prependHttp(sourceUrl, { https: true }) : null)
      .set('source', source || null)
      .set('text', text || null)
      .set('updated_date', hasUpdatedDate ? updatedDate : null);
  }

  handleAddBlock() {
    const { onAddBlock, toggle, blockKey } = this.props;
    onAddBlock(this.setBlock(), blockKey);
    toggle();
  }

  handleEditBlock() {
    const { onEditBlock, toggle, blockKey } = this.props;
    onEditBlock(this.setBlock(), blockKey);
    toggle();
  }

  handleChangeDate(date) {
    this.setState(changedDate(date));
  }

  handleChangeTime({ target: { value: time } }) {
    this.setState(changedTime(time));
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
      hasUpdatedDate,
      isPullQuote,
      isValid,
      source,
      sourceUrl,
      text,
      updatedDate,
    } = this.state;
    const { isFreshBlock, isOpen, toggle, blockKey } = this.props;

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
            <FormGroup>
              <Checkbox size="sd" id="hasUpdatedDate" checked={hasUpdatedDate} onChange={this.handleChangeCheckbox}>
                Is update
              </Checkbox>
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
            onClick={isFreshBlock ? () => this.handleAddBlock(this.setBlock(), blockKey) : () => this.handleEditBlock(this.setBlock(), blockKey)}
          >
            {isFreshBlock ? 'Add' : 'Update'}
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}

export default QuoteBlockModal;
