import DateTimePicker from '@triniti/cms/plugins/blocksmith/components/date-time-picker';
import Message from '@gdbots/pbj/Message';
import PropTypes from 'prop-types';
import React from 'react';
import ImgurPostBlockPreview from '@triniti/cms/plugins/blocksmith/components/imgur-post-block-preview';
import UncontrolledTooltip from '@triniti/cms/plugins/common/components/uncontrolled-tooltip';
import {
  Button,
  Checkbox,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Icon,
} from '@triniti/admin-ui-plugin/components';

import changedDate from '../../utils/changedDate';
import changedTime from '../../utils/changedTime';

import getImgurPostBlockId from './getImgurPostBlockId';

export default class ImgurPostBlockModal extends React.Component {
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
      touched: false,
      isValid: block.has('id'),
      imgurId: block.get('id'),
      showContext: block.get('show_context'),
      updatedDate: block.get('updated_date', new Date()),
    };

    this.handleAddBlock = this.handleAddBlock.bind(this);
    this.handleChangeCheckbox = this.handleChangeCheckbox.bind(this);
    this.handleChangeDate = this.handleChangeDate.bind(this);
    this.handleChangeTextArea = this.handleChangeTextArea.bind(this);
    this.handleChangeTime = this.handleChangeTime.bind(this);
    this.handleEditBlock = this.handleEditBlock.bind(this);
    this.handleMouseOut = this.handleMouseOut.bind(this);
  }

  handleMouseOut(e) {
    e.stopPropagation();
  }

  componentDidMount() {
    this.inputElement.focus();

    window.addEventListener('mouseout', this.handleMouseOut, true);

    if(!this.props.isFreshBlock){
      document.querySelector('.modal').addEventListener('mousemove', this.handleMouseOut, true);
    }
  
  }

  componentWillUnmount() {
   window.removeEventListener('mouseout', this.handleMouseOut, true);

   if(!this.props.isFreshBlock){
      document.querySelector('.modal').removeEventListener('mousemove', this.handleMouseOut, true);
    }
  }

  setBlock() {
    const {
      hasUpdatedDate,
      imgurId,
      showContext,
      updatedDate,
      aside,
    } = this.state;

    const { block } = this.props;

    return block.schema().createMessage()
      .set('aside', aside)
      .set('id', imgurId || null)
      .set('show_context', showContext)
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

  handleChangeDate(date) {
    this.setState(changedDate(date));
  }

  handleChangeTime({ target: { value: time } }) {
    this.setState(changedTime(time));
  }

  handleChangeCheckbox({ target: { id, checked } }) {
    this.setState({ [id]: checked });
  }

  handleChangeTextArea(event) {
    const input = event.target.value;
    const id = getImgurPostBlockId(input);
    let { errorMsg, imgurId, isValid } = this.state;

    if (!id) {
      errorMsg = 'url or embed code is invalid';
      imgurId = input;
      isValid = false;
    } else {
      errorMsg = '';
      imgurId = id;
      isValid = true;
    }
    this.setState({
      errorMsg,
      imgurId,
      isValid,
      touched: true,
    });
  }

  render() {
    const {
      aside,
      errorMsg,
      hasUpdatedDate,
      showContext,
      isValid,
      touched,
      imgurId,
      updatedDate,
    } = this.state;
    const { isFreshBlock, isOpen, toggle } = this.props;

    return (
      <Modal isOpen={isOpen} toggle={toggle}>
        <ModalHeader toggle={toggle}>{`${isFreshBlock ? 'Add' : 'Update'} Imgur Post Block`}</ModalHeader>
        <ModalBody>
          <FormGroup>
            <Label>{isValid ? 'Post id' : 'Embed code, URL, or Post Id'}</Label>
            <Input
              innerRef={(el) => { this.inputElement = el; }}
              onChange={this.handleChangeTextArea}
              placeholder="enter embed code, url, or id"
              type="textarea"
              value={imgurId || ''}
            />
          </FormGroup>
          {
            !isValid && touched && imgurId !== ''
            && <p className="text-danger">{errorMsg}</p>
          }

          <FormGroup>
            <Checkbox size="sd" id="hasUpdatedDate" checked={hasUpdatedDate} onChange={this.handleChangeCheckbox}>
              Is update
            </Checkbox>
          </FormGroup>

          <FormGroup>
            <Checkbox size="sd" id="aside" checked={aside} onChange={this.handleChangeCheckbox}>
              Aside
            </Checkbox>
            <Icon imgSrc="info-outline" id="aside-tooltip" size="xs" className="ml-1" />
            <UncontrolledTooltip target="aside-tooltip">Is only indirectly related to the main content.</UncontrolledTooltip>
          </FormGroup>

          <FormGroup>
            <Checkbox size="sd" id="showContext" checked={showContext} onChange={this.handleChangeCheckbox}>
            Show title
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
          {imgurId && <ImgurPostBlockPreview block={this.setBlock()} />}
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
