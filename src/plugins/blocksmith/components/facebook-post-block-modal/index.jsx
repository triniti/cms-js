import moment from 'moment';
import React from 'react';
import PropTypes from 'prop-types';
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
import FacebookPostBlockPreview from '@triniti/cms/plugins/blocksmith/components/facebook-post-block-preview';

import changedDate from '../../utils/changedDate';
import changedTime from '../../utils/changedTime';

const FB_POST_REGEX = new RegExp('(?:(?:https?:)?\\/\\/)?(?:www\\.)?facebook\\.com\\/[a-zA-Z0-9\\.]+\\/posts\\/(?:[a-z0-9\\.]+\\/)?([0-9]+)\\/?(?:\\?.*)?');
const FB_POST_SHOW_TEXT_ATTR_REGEX = new RegExp('data-show-text=".+?"');
const FB_POST_SHOW_TEXT_QUERY_STRING_REGEX = new RegExp('show_text=.');

export default class FacebookPostBlockModal extends React.Component {
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
      href: block.get('href'),
      isValid: true,
      showText: block.get('show_text'),
      updatedDate: block.has('updated_date') ? moment(block.get('updated_date')) : moment(),
    };
    this.handleAddBlock = this.handleAddBlock.bind(this);
    this.handleChangeCheckbox = this.handleChangeCheckbox.bind(this);
    this.handleChangeDate = this.handleChangeDate.bind(this);
    this.handleChangeTextArea = this.handleChangeTextArea.bind(this);
    this.handleChangeTime = this.handleChangeTime.bind(this);
    this.handleEditBlock = this.handleEditBlock.bind(this);
  }

  componentDidMount() {
    setTimeout((t) => {
      t.inputElement.focus();
    }, 0, this);
  }

  setBlock() {
    const { hasUpdatedDate, href, showText, updatedDate } = this.state;
    const { block } = this.props;
    return block.schema().createMessage()
      .set('href', href)
      .set('show_text', showText)
      .set('updated_date', hasUpdatedDate ? updatedDate.toDate() : null);
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

  handleChangeTextArea(event) {
    let { showText } = this.state;
    const input = decodeURIComponent(event.target.value);
    let href = input;
    let isValid = false;
    if (FB_POST_REGEX.test(input)) {
      isValid = true;
      if (FB_POST_SHOW_TEXT_ATTR_REGEX.test(input)) {
        showText = input.match(FB_POST_SHOW_TEXT_ATTR_REGEX)[0].replace('data-show-text="', '') === 'true"';
      }
      if (FB_POST_SHOW_TEXT_QUERY_STRING_REGEX.test(input)) {
        showText = !!+input.match(FB_POST_SHOW_TEXT_QUERY_STRING_REGEX)[0].replace('show_text=', '');
      }
      href = input.match(FB_POST_REGEX)[0];
    }
    this.setState({
      href,
      isValid,
      showText,
    });
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
    const { hasUpdatedDate, href, isValid, showText, updatedDate } = this.state;
    const { isOpen, isFreshBlock, toggle } = this.props;

    return (
      <Modal isOpen={isOpen} toggle={toggle}>
        <ModalHeader toggle={toggle}>{`${isFreshBlock ? 'Add' : 'Update'} Facebook Post Block`}</ModalHeader>
        <ModalBody className="modal-body-blocksmith">
          <FormGroup>
            <Label className="float-left">URL</Label>
            <Input
              innerRef={(el) => { this.inputElement = el; }}
              onChange={this.handleChangeTextArea}
              placeholder="enter url or embed code"
              type="textarea"
              value={href || ''}
            />
          </FormGroup>
          {
            !isValid
            && <p className="text-danger">url or embed is invalid</p>
          }
          <FormGroup check>
            <Checkbox size="sd" id="showText" checked={showText} onChange={this.handleChangeCheckbox}>Show text</Checkbox>
          </FormGroup>
          <FormGroup check>
            <Checkbox size="sd" id="hasUpdatedDate" checked={hasUpdatedDate} onChange={this.handleChangeCheckbox}>Is update</Checkbox>
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
            isValid && href
            && (
              <FacebookPostBlockPreview
                block={this.setBlock()}
                width={526}
              />
            )
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
