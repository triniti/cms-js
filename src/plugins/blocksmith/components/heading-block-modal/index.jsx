import DateTimePicker from '@triniti/cms/plugins/blocksmith/components/date-time-picker';
import HeadingBlockPreview from '@triniti/cms/plugins/blocksmith/components/heading-block-preview';
import isValidUrl from '@gdbots/common/isValidUrl';
import Message from '@gdbots/pbj/Message';
import prependHttp from 'prepend-http';
import PropTypes from 'prop-types';
import React from 'react';
import UncontrolledTooltip from '@triniti/cms/plugins/common/components/uncontrolled-tooltip';
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
  Select,
  Icon,
} from '@triniti/admin-ui-plugin/components';

import changedDate from '../../utils/changedDate';
import changedTime from '../../utils/changedTime';

class HeadingBlockModal extends React.Component {
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
      isValid: true,
      text: block.get('text') || '',
      size: block.get('size'),
      url: block.get('url'),
      updatedDate: block.get('updated_date', new Date()),
    };

    this.handleAddBlock = this.handleAddBlock.bind(this);
    this.handleChangeCheckbox = this.handleChangeCheckbox.bind(this);
    this.handleChangeInput = this.handleChangeInput.bind(this);
    this.handleChangeUrl = this.handleChangeUrl.bind(this);
    this.handleEditBlock = this.handleEditBlock.bind(this);
    this.handleChangeDate = this.handleChangeDate.bind(this);
    this.handleChangeSelect = this.handleChangeSelect.bind(this);
    this.handleChangeTime = this.handleChangeTime.bind(this);
  }

  componentDidMount() {
    this.textElement.focus();
  }

  setBlock() {
    const { aside, hasUpdatedDate, text, size, url, updatedDate } = this.state;
    const { block } = this.props;
    return block.schema().createMessage()
      .set('aside', aside)
      .set('size', parseInt(size, 10))
      .set('text', text)
      .set('updated_date', hasUpdatedDate ? updatedDate : null)
      .set('url', url ? prependHttp(url, { https: true }) : null);
  }

  handleAddBlock() {
    const { onAddBlock, toggle } = this.props;
    onAddBlock(this.setBlock());
    toggle();
  }

  handleChangeCheckbox({ target: { id, checked } }) {
    this.setState({ [id]: checked });
  }

  handleChangeDate(date) {
    this.setState(changedDate(date));
  }

  handleChangeSelect(option) {
    this.setState({ size: option ? option.value : 0 });
  }

  handleChangeTime({ target: { value: time } }) {
    this.setState(changedTime(time));
  }


  handleChangeInput({ target: { id, value } }) {
    this.setState({ [id]: value });
  }

  handleChangeUrl({ target: { value } }) {
    this.setState({
      url: value,
      isValid: !value || isValidUrl(prependHttp(value, { https: true })),
    });
  }

  handleEditBlock() {
    const { onEditBlock, toggle } = this.props;
    onEditBlock(this.setBlock());
    toggle();
  }

  render() {
    const {
      aside,
      hasUpdatedDate,
      isValid,
      text,
      size,
      url,
      updatedDate,
    } = this.state;
    const { isFreshBlock, isOpen, toggle } = this.props;

    return (
      <Modal isOpen={isOpen} toggle={toggle}>
        <ModalHeader toggle={toggle}>
          {`${isFreshBlock ? 'Add' : 'Update'} Heading Block`}
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
              placeholder="Enter heading text here"
              type="textarea"
              value={text || ''}
            />
            <Label>Size</Label>
            <Select
              className="mb-3"
              id="size"
              name="size"
              onChange={this.handleChangeSelect}
              value={!size ? null : {
                label: `h${size}`,
                value: size,
              }}
              options={[
                { label: 'h1', value: '1' },
                { label: 'h2', value: '2' },
                { label: 'h3', value: '3' },
                { label: 'h4', value: '4' },
                { label: 'h5', value: '5' },
                { label: 'h6', value: '6' },
              ]}
            />
            <Label>URL</Label>
            <Input
              className="mb-3"
              name="url"
              onChange={this.handleChangeUrl}
              placeholder="URL"
              type="text"
              value={url || ''}
            />
            {!isValid && <p className="text-danger">please enter a valid URL</p>}
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
          </FormGroup>
          {
            (text && isValid)
            && <HeadingBlockPreview block={this.setBlock()} />
          }
        </ModalBody>
        <ModalFooter>
          <Button onClick={toggle}>Cancel</Button>
          <Button
            disabled={!text || !isValid}
            onClick={isFreshBlock ? this.handleAddBlock : this.handleEditBlock}
          >
            {isFreshBlock ? 'Add' : 'Update'}
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}

export default HeadingBlockModal;
