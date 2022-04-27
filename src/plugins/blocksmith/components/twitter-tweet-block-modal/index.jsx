import { Button, Checkbox, FormGroup, Input, Label, Modal, ModalHeader, ModalBody, ModalFooter, Icon, UncontrolledTooltip } from '@triniti/admin-ui-plugin/components';
import DateTimePicker from '@triniti/cms/plugins/blocksmith/components/date-time-picker';
import Message from '@gdbots/pbj/Message';
import PropTypes from 'prop-types';
import React from 'react';
import TwitterTweetBlockPreview from '@triniti/cms/plugins/blocksmith/components/twitter-tweet-block-preview';
import getTwitterTweetFields from './getTwitterTweetFields';
import changedDate from '../../utils/changedDate';
import changedTime from '../../utils/changedTime';

export default class TwitterTweetBlockModal extends React.Component {
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
    const tweetId = block.get('tweet_id');
    const screenName = block.get('screen_name');
    this.state = {
      aside: block.get('aside'),
      errorMsg: '',
      hasUpdatedDate: block.has('updated_date'),
      hideMedia: block.get('hide_media'),
      hideThread: block.get('hide_thread'),
      isValid: block.has('screen_name'),
      screenName,
      touched: false,
      tweetId,
      tweetText: block.get('tweet_text'),
      updatedDate: block.get('updated_date', new Date()),
      url: tweetId && screenName ? `https://twitter.com/${screenName}/status/${tweetId}` : '',
    };
    this.handleAddBlock = this.handleAddBlock.bind(this);
    this.handleChangeCheckbox = this.handleChangeCheckbox.bind(this);
    this.handleChangeDate = this.handleChangeDate.bind(this);
    this.handleChangeTextarea = this.handleChangeTextarea.bind(this);
    this.handleChangeTime = this.handleChangeTime.bind(this);
    this.handleEditBlock = this.handleEditBlock.bind(this);
    this.handleMouseOut = this.handleMouseOut.bind(this);
  }

  handleMouseOut(e) {
    e.stopPropagation();
  }

  componentDidMount() {
    this.inputElement.focus();

    ['mouseout','mousemove'].forEach(mouseEvt => window.addEventListener(mouseEvt, this.handleMouseOut, true));
  }

  componentWillUnmount() {
    ['mouseout','mousemove'].forEach(mouseEvt => window.removeEventListener(mouseEvt, this.handleMouseOut, true));
  }

  setBlock() {
    const {
      aside,
      hasUpdatedDate,
      hideMedia,
      hideThread,
      screenName,
      tweetId,
      tweetText,
      updatedDate,
    } = this.state;
    const { block } = this.props;
    return block.schema().createMessage()
      .set('aside', aside)
      .set('hide_media', hideMedia)
      .set('hide_thread', hideThread)
      .set('screen_name', screenName || null)
      .set('tweet_id', tweetId || null)
      .set('tweet_text', tweetText || null)
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

  handleChangeCheckbox({ target: { id, checked } }) {
    this.setState({ [id]: checked });
  }

  handleChangeDate(date) {
    this.setState(changedDate(date));
  }

  handleChangeTime({ target: { value: time } }) {
    this.setState(changedTime(time));
  }

  handleChangeTextarea(event) {
    const newState = { ...this.state };
    const twitterTweetFields = getTwitterTweetFields(event.target.value);
    if (!twitterTweetFields.tweetId) {
      newState.errorMsg = 'embed code is invalid';
      newState.isValid = false;
    } else {
      newState.errorMsg = '';
      newState.isValid = true;
      newState.screenName = twitterTweetFields.screenName;
      newState.tweetId = twitterTweetFields.tweetId;
      newState.tweetText = twitterTweetFields.tweetText;
    }
    this.setState(newState);
  }

  render() {
    const {
      aside,
      errorMsg,
      hasUpdatedDate,
      hideMedia,
      hideThread,
      isValid,
      screenName,
      touched,
      tweetId,
      updatedDate,
      url,
    } = this.state;
    const { isFreshBlock, isOpen, toggle } = this.props;
    const displayUrl = isValid ? `https://twitter.com/${screenName}/status/${tweetId}` : url;

    return (
      <Modal isOpen={isOpen} toggle={toggle}>
        <ModalHeader toggle={toggle}>{`${isFreshBlock ? 'Add' : 'Update'} Twitter Tweet Block`}</ModalHeader>
        <ModalBody>
          <FormGroup>
            <Label>Embed Code</Label>
            <Input
              innerRef={(el) => { this.inputElement = el; }}
              onChange={this.handleChangeTextarea}
              placeholder="enter embed code"
              type="textarea"
              value={displayUrl}
            />
          </FormGroup>
          {
            !isValid && touched
            && <p className="text-danger">{errorMsg}</p>
          }
          <FormGroup check>
            <Checkbox size="sd" id="hideMedia" checked={hideMedia} onChange={this.handleChangeCheckbox}>
              Hide Media
            </Checkbox>
          </FormGroup>
          <FormGroup check>
            <Checkbox size="sd" id="hideThread" checked={hideThread} onChange={this.handleChangeCheckbox}>
              Hide Thread
            </Checkbox>
          </FormGroup>
          <FormGroup check>
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
            isValid && <TwitterTweetBlockPreview block={this.setBlock()} />
          }
        </ModalBody>
        <ModalFooter>
          <Button onClick={toggle}>Cancel</Button>
          <Button
            disabled={!isValid}
            onClick={isFreshBlock ? this.handleAddBlock : this.handleEditBlock}
          >
            { isFreshBlock ? 'Add' : 'Update' }
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}
