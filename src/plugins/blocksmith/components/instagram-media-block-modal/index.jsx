import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';

import Message from '@gdbots/pbj/Message';
import InstagramMediaBlockPreview from '@triniti/cms/plugins/blocksmith/components/instagram-media-block-preview';
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
  UncontrolledTooltip,
} from '@triniti/admin-ui-plugin/components';

import changedDate from '../../utils/changedDate';
import changedTime from '../../utils/changedTime';

const INSTAGRAM_MEDIA_REGEX = /https:\/\/www\.instagram\.com\/p\/[\w\s-]+\/?/;
const INSTAGRAM_STRIP_REGEX = /(https:\/\/www\.instagram\.com\/p\/?|\/)/g;

export default class InstagramMediaBlockModal extends React.Component {
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
    const id = block.get('id');
    this.state = {
      errorMsg: '',
      hasUpdatedDate: block.has('updated_date'),
      hideCaption: block.get('hidecaption'),
      id,
      isValid: block.has('id'),
      touched: false,
      updatedDate: block.has('updated_date') ? moment(block.get('updated_date')) : moment(),
      url: id ? `https://www.instagram.com/p/${id}/` : '',
      aside: block.get('aside'),
    };
    this.handleAddBlock = this.handleAddBlock.bind(this);
    this.handleChangeCheckbox = this.handleChangeCheckbox.bind(this);
    this.handleChangeDate = this.handleChangeDate.bind(this);
    this.handleChangeTextarea = this.handleChangeTextarea.bind(this);
    this.handleChangeTime = this.handleChangeTime.bind(this);
    this.handleEditBlock = this.handleEditBlock.bind(this);
  }

  componentDidMount() {
    setTimeout((t) => {
      t.inputElement.focus();
    }, 0, this);
  }

  setBlock() {
    const { hasUpdatedDate, hideCaption, id, updatedDate, aside } = this.state;
    const { block } = this.props;
    return block.schema().createMessage()
      .set('hidecaption', hideCaption)
      .set('id', id)
      .set('updated_date', hasUpdatedDate ? updatedDate.toDate() : null)
      .set('aside', aside);
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

  handleChangeDate(date) {
    this.setState(changedDate(date));
  }

  handleChangeTime({ target: { value: time } }) {
    this.setState(changedTime(time));
  }

  handleChangeTextarea(event) {
    let { errorMsg, hideCaption, id, isValid } = this.state;
    const input = event.target.value;
    if (!INSTAGRAM_MEDIA_REGEX.test(input)) {
      errorMsg = 'url or embed code is invalid';
      isValid = false;
    } else {
      errorMsg = '';
      isValid = true;
      hideCaption = input.indexOf('data-instgrm-captioned') === -1;
      id = input.match(INSTAGRAM_MEDIA_REGEX)[0].replace(INSTAGRAM_STRIP_REGEX, '');
    }
    this.setState({
      errorMsg,
      hideCaption,
      id,
      isValid,
      touched: true,
      url: event.target.value,
    });
  }

  handleChangeCheckbox({ target: { checked, id } }) {
    this.setState({ [id]: checked });
  }

  render() {
    const {
      errorMsg,
      hasUpdatedDate,
      hideCaption,
      id,
      isValid,
      touched,
      updatedDate,
      url,
      aside,
    } = this.state;
    const { isFreshBlock, isOpen, toggle } = this.props;
    const displayUrl = isValid ? `https://www.instagram.com/p/${id}/` : url;

    return (
      <Modal isOpen={isOpen} toggle={toggle}>
        <ModalHeader toggle={toggle}>{`${isFreshBlock ? 'Add' : 'Update'} Instagram Media Block`}</ModalHeader>
        <ModalBody>
          <FormGroup>
            <Label>URL</Label>
            <Input
              innerRef={(el) => { this.inputElement = el; }}
              onChange={this.handleChangeTextarea}
              placeholder="enter url or embed code"
              type="textarea"
              value={displayUrl}
            />
          </FormGroup>
          {
            !isValid && touched
            && <p className="text-danger">{errorMsg}</p>
          }
          <FormGroup>
            <Checkbox size="sd" id="hideCaption" checked={hideCaption} onChange={this.handleChangeCheckbox}>
              Hide Caption
            </Checkbox>
          </FormGroup>
          <FormGroup className="mr-4">
            <Checkbox size="sd" id="hasUpdatedDate" checked={hasUpdatedDate} onChange={this.handleChangeCheckbox}>
              Is update
            </Checkbox>
          </FormGroup>
          <FormGroup className="mr-4">
            <Checkbox size="sd" checked={aside} onChange={this.handleChangeCheckbox}>
              Aside
            </Checkbox>
            <Icon imgSrc="info-outline" id="aside-tooltip" size="xs" style={{ marginLeft: '0.3rem' }} />
            <UncontrolledTooltip key="tooltip" placement="bottom" target="aside-tooltip">Is only indirectly related to the main content.</UncontrolledTooltip>
          </FormGroup>
          {
            hasUpdatedDate
            && (
              <div className="modal-body-blocksmith">
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
              </div>
            )
          }
          {
            isValid
            && <InstagramMediaBlockPreview block={this.setBlock()} />
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
