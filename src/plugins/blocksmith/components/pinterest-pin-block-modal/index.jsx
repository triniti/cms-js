import DateTimePicker from '@triniti/cms/plugins/blocksmith/components/date-time-picker';
import PinterestPinBlockPreview from '@triniti/cms/plugins/blocksmith/components/pinterest-pin-block-preview';
import Message from '@gdbots/pbj/Message';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
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
  Select,
} from '@triniti/admin-ui-plugin/components';
import isValidUrl from '@gdbots/common/isValidUrl';

import changedDate from '../../utils/changedDate';
import changedTime from '../../utils/changedTime';

import getPinterestPinUrl from './getPinterestPinUrl';

export default class PinterestPinBlockModal extends Component {
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
      aside: block.get('aside'),
      errorMsg: '',
      hasUpdatedDate: block.has('updated_date'),
      href: block.get('href'),
      isValid: block.has('href'),
      size: block.get('size'),
      terse: block.get('terse'),
      touched: false,
      updatedDate: block.get('updated_date', new Date()),
    };

    this.handleAddBlock = this.handleAddBlock.bind(this);
    this.handleChangeCheckbox = this.handleChangeCheckbox.bind(this);
    this.handleChangeDate = this.handleChangeDate.bind(this);
    this.handleChangeTextarea = this.handleChangeTextarea.bind(this);
    this.handleChangeTime = this.handleChangeTime.bind(this);
    this.handleEditBlock = this.handleEditBlock.bind(this);
    this.handleChangeSelect = this.handleChangeSelect.bind(this);
    this.handleMouseOut = this.handleMouseOut.bind(this);
  }

  handleMouseOut(e) {
    e.stopPropagation();
  }

  componentDidMount() {
    setTimeout((t) => {
      t.inputElement.focus();
    }, 0, this);
    
    ['mouseout','mousemove'].forEach(mouseEvt => window.addEventListener(mouseEvt, this.handleMouseOut, true));
  }

  componentWillUnmount() { 
    ['mouseout','mousemove'].forEach(mouseEvt => window.removeEventListener(mouseEvt, this.handleMouseOut, true));
  }

  setBlock() {
    const { hasUpdatedDate, terse, href, size, updatedDate, aside } = this.state;
    const { block } = this.props;
    return block.schema().createMessage()
      .set('aside', aside)
      .set('href', href)
      .set('size', size)
      .set('terse', terse)
      .set('updated_date', hasUpdatedDate ? updatedDate : null);
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

  handleChangeCheckbox({ target: { checked, id } }) {
    this.setState({ [id]: checked });
  }

  handleChangeDate(date) {
    this.setState(changedDate(date));
  }

  handleChangeTime({ target: { value: time } }) {
    this.setState(changedTime(time));
  }

  handleChangeTextarea(event) {
    let { errorMsg, href, isValid, size, terse } = this.state;
    const input = event.target.value;
    const pinUrl = getPinterestPinUrl(input);

    const embed = new DOMParser().parseFromString(input, 'text/html');
    const anchor = embed.querySelector('a');
    const pinWidth = anchor ? anchor.dataset.pinWidth : 'small';
    const pinTerse = anchor ? anchor.dataset.pinTerse : false;

    if (isValidUrl(pinUrl)) {
      errorMsg = '';
      isValid = true;
      href = pinUrl;
      size = pinWidth;
      terse = !!pinTerse;
    } else {
      errorMsg = 'Pinterest pin id, embed url or embed code is invalid';
      isValid = false;
    }

    this.setState({
      errorMsg,
      href,
      isValid,
      size,
      terse,
      touched: true,
    });
  }

  handleChangeSelect({ value }) {
    this.setState({ size: value });
  }

  render() {
    const {
      aside,
      errorMsg,
      hasUpdatedDate,
      isValid,
      href,
      terse,
      touched,
      size,
      updatedDate,
    } = this.state;
    const { isFreshBlock, isOpen, toggle } = this.props;
    const displayUrl = isValid ? href : '';

    return (
      <Modal isOpen={isOpen} toggle={toggle}>
        <ModalHeader toggle={toggle}>{`${isFreshBlock ? 'Add' : 'Update'} Pinterest Pin Block`}</ModalHeader>
        <ModalBody>
          <FormGroup>
            <Label>{isValid ? 'Pinterest Id' : 'Pinterest Embed Code, URL, or ID'}</Label>
            <Input
              innerRef={(el) => { this.inputElement = el; }}
              onChange={this.handleChangeTextarea}
              placeholder="enter pinterest pin id, url, or embed code"
              type="textarea"
              value={displayUrl || ''}
            />
            <p className="p-2">e.g. https://www.pinterest.com/pin/PIN_ID</p>
          </FormGroup>
          {
            !isValid && touched
            && <p className="text-danger">{errorMsg}</p>
          }

          <FormGroup>
            <Label>Size</Label>
            <Select
              isDisabled={false}
              isMulti={false}
              onChange={this.handleChangeSelect}
              options={[
                { label: 'small', value: 'small' },
                { label: 'medium', value: 'medium' },
                { label: 'large', value: 'large' },
              ]}
              defaultValue={{ label: 'small', value: 'small' }}
              value={{ label: size, value: size }}
            />
          </FormGroup>

          <FormGroup>
            <Checkbox size="sd" id="terse" checked={terse} onChange={this.handleChangeCheckbox}>
              Hide Description
            </Checkbox>
          </FormGroup>
          <FormGroup className="mr-4">
            <Checkbox size="sd" id="hasUpdatedDate" checked={hasUpdatedDate} onChange={this.handleChangeCheckbox}>
              Is update
            </Checkbox>
          </FormGroup>
          <FormGroup className="mr-4">
            <Checkbox size="sd" id="aside" checked={aside} onChange={this.handleChangeCheckbox}>
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
          {
            isValid
            && <PinterestPinBlockPreview block={this.setBlock()} />
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
