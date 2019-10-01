import moment from 'moment';
import React from 'react';
import PropTypes from 'prop-types';
import Message from '@gdbots/pbj/Message';
import { Button, Checkbox, FormGroup, Input, Label, Modal, ModalHeader, ModalBody, ModalFooter } from '@triniti/admin-ui-plugin/components';
import TwitterTweetBlockPreview from '@triniti/cms/plugins/blocksmith/components/twitter-tweet-block-preview';
import DateTimePicker from '@triniti/cms/plugins/blocksmith/components/date-time-picker';

import changedDate from '../../utils/changedDate';
import changedTime from '../../utils/changedTime';

const TWITTER_TWEET_REGEX = /https?:\/\/twitter\.com\/[a-zA-Z0-9_]+\/status\/[0-9\\.]+/;
const TWITTER_EMBED_REGEX = /^<blockquote.+https?:\/\/twitter\.com\/[a-zA-Z0-9_]+\/status\/[0-9\\.]+(\n|.)+<\/script>$/m;

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
      errorMsg: '',
      hasUpdatedDate: block.has('updated_date'),
      hideMedia: block.get('hide_media'),
      hideThread: block.get('hide_thread'),
      isValid: block.has('screen_name'),
      screenName,
      touched: false,
      tweetId,
      tweetText: block.get('tweet_text'),
      updatedDate: block.has('updated_date') ? moment(block.get('updated_date')) : moment(),
      url: tweetId && screenName ? `https://twitter.com/${screenName}/status/${tweetId}` : '',
    };
    this.handleAddBlock = this.handleAddBlock.bind(this);
    this.handleChangeCheckbox = this.handleChangeCheckbox.bind(this);
    this.handleChangeDate = this.handleChangeDate.bind(this);
    this.handleChangeTextarea = this.handleChangeTextarea.bind(this);
    this.handleChangeTime = this.handleChangeTime.bind(this);
    this.handleEditBlock = this.handleEditBlock.bind(this);
  }

  componentDidMount() {
    this.inputElement.focus();
  }

  setBlock() {
    const {
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
      .set('hide_media', hideMedia)
      .set('hide_thread', hideThread)
      .set('screen_name', screenName || null)
      .set('tweet_id', tweetId || null)
      .set('tweet_text', tweetText || null)
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

  handleChangeDate(date) {
    this.setState(changedDate(date));
  }

  handleChangeTime({ target: { value: time } }) {
    this.setState(changedTime(time));
  }

  handleChangeTextarea(event) {
    let { errorMsg, isValid, screenName, tweetId, tweetText } = this.state;
    let input = decodeURIComponent(event.target.value);
    if (!TWITTER_EMBED_REGEX.test(input)) {
      errorMsg = 'embed code is invalid';
      isValid = false;
    } else {
      errorMsg = '';
      isValid = true;
      tweetText = input.replace(/<script.+<\/script>/, '')
        .replace(/<blockquote.+?>/, '')
        .replace('</blockquote>', '')
        .replace('/\n/g', '');
      input = input.match(TWITTER_TWEET_REGEX)[0];
      screenName = input.split('/')[3];
      tweetId = input.split('/')[5];
    }
    this.setState({
      errorMsg,
      isValid,
      screenName,
      touched: true,
      tweetId,
      tweetText,
      url: event.target.value,
    });
  }

  handleChangeCheckbox({ target: { id, checked } }) {
    this.setState({ [id]: checked });
  }

  render() {
    const {
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
          {
            hasUpdatedDate
            && (
              <div className="modal-body-blocksmith">
                <DateTimePicker
                  onChangeDate={this.handleChangeDate}
                  onChangeTime={this.handleChangeTime}
                  updatedDate={updatedDate}
                />
              </div>
            )
          }
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
