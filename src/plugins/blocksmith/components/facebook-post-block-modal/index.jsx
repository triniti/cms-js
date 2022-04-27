import FacebookPostBlockPreview from '@triniti/cms/plugins/blocksmith/components/facebook-post-block-preview';
import Message from '@gdbots/pbj/Message';
import DateTimePicker from '@triniti/cms/plugins/blocksmith/components/date-time-picker';
import PropTypes from 'prop-types';
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
import getFacebookPostUrl from './getFacebookPostUrl';

const FB_POST_SHOW_TEXT_ATTR_REGEX = new RegExp('data-show-text=".+?"');
const FB_POST_SHOW_TEXT_QUERY_STRING_REGEX = new RegExp('show_text=(true|false)');

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
      aside: block.get('aside'),
      hasUpdatedDate: block.has('updated_date'),
      href: block.get('href'),
      isValid: true,
      showText: block.get('show_text'),
      updatedDate: block.get('updated_date', new Date()),
    };
    this.handleAddBlock = this.handleAddBlock.bind(this);
    this.handleChangeCheckbox = this.handleChangeCheckbox.bind(this);
    this.handleChangeDate = this.handleChangeDate.bind(this);
    this.handleChangeTextArea = this.handleChangeTextArea.bind(this);
    this.handleChangeTime = this.handleChangeTime.bind(this);
    this.handleEditBlock = this.handleEditBlock.bind(this);
    this.handleChangeAside = this.handleChangeAside.bind(this);
    this.handleMouseOut = this.handleMouseOut.bind(this);
  }

  handleMouseOut(e) {
    e.stopPropagation();
  }

  componentDidMount() {
    setTimeout((t) => {
      t.inputElement.focus();
    }, 0, this);
  
      window.addEventListener('mouseout', this.handleMouseOut, true);
    
      ['mouseout','mousemove'].forEach(mouseEvt => window.addEventListener(mouseEvt, this.handleMouseOut, true))
    }
  
    componentWillUnmount() { 
      ['mouseout','mousemove'].forEach(mouseEvt =>  window.removeEventListener(mouseEvt, this.handleMouseOut, true));
    }

  setBlock() {
    const { hasUpdatedDate, href, showText, updatedDate, aside } = this.state;
    const { block } = this.props;
    return block.schema().createMessage()
      .set('aside', aside)
      .set('href', href)
      .set('show_text', showText)
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

  handleChangeTextArea(event) {
    let { showText } = this.state;
    const href = getFacebookPostUrl(event.target.value);
    const isValid = !!href;
    if (isValid) {
      const input = event.target.value;
      if (FB_POST_SHOW_TEXT_ATTR_REGEX.test(input)) {
        showText = input.match(FB_POST_SHOW_TEXT_ATTR_REGEX)[0].replace('data-show-text="', '') === 'true"';
      }
      if (FB_POST_SHOW_TEXT_QUERY_STRING_REGEX.test(input)) {
        showText = input.match(FB_POST_SHOW_TEXT_QUERY_STRING_REGEX)[0].replace('show_text=', '') === 'true';
      }
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

  handleChangeAside() {
    this.setState(({ aside }) => ({ aside: !aside }));
  }

  render() {
    const { aside, hasUpdatedDate, href, isValid, showText, updatedDate } = this.state;
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
          <FormGroup check>
            <Checkbox size="sd" id="aside" checked={aside} onChange={this.handleChangeAside}>Aside</Checkbox>
            <Icon imgSrc="info-outline" id="aside-tooltip" size="xs" className="ml-1" />
            <UncontrolledTooltip target="aside-tooltip">Is only indirectly related to the main content.</UncontrolledTooltip>
          </FormGroup>
          {hasUpdatedDate
            && (
              <DateTimePicker
                onChangeDate={this.handleChangeDate}
                onChangeTime={this.handleChangeTime}
                updatedDate={updatedDate}
              />
            )}
          {isValid && href
            && (
              <FacebookPostBlockPreview
                block={this.setBlock()}
                width={526}
              />
            )}
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
