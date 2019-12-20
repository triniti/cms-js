import DateTimePicker from '@triniti/cms/plugins/blocksmith/components/date-time-picker';
import YoutubePlaylistBlockPreview from '@triniti/cms/plugins/blocksmith/components/youtube-playlist-block-preview';
import Message from '@gdbots/pbj/Message';
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

import getYoutubePlaylist, { YOUTUBE_PLAYLIST_ID_REGEX } from './getYoutubePlaylistId';

export default class YoutubePlaylistBlockModal extends React.Component {
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
      playlistId: block.get('playlist_id'),
      autoplay: block.get('autoplay'),
      isValid: block.has('playlist_id'),
      touched: false,
      updatedDate: block.get('updated_date', new Date()),
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
    const { hasUpdatedDate, playlistId, autoplay, updatedDate, aside } = this.state;
    const { block } = this.props;
    return block.schema().createMessage()
      .set('playlist_id', playlistId)
      .set('autoplay', autoplay)
      .set('aside', aside)
      .set('video_id', 'deprecated') // left blank to prevent schema validation error. Field deprecated!
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
    let { errorMsg, isValid, playlistId } = this.state;
    const input = event.target.value;
    const id = getYoutubePlaylist(input);
    const validId = YOUTUBE_PLAYLIST_ID_REGEX.test(id);

    if (validId) {
      errorMsg = '';
      isValid = true;
      playlistId = id;
    } else {
      errorMsg = 'url or embed code is invalid';
      isValid = false;
    }

    this.setState({
      errorMsg,
      playlistId,
      isValid,
      touched: true,
    });
  }


  render() {
    const {
      aside,
      errorMsg,
      hasUpdatedDate,
      playlistId,
      autoplay,
      isValid,
      touched,
      updatedDate,
    } = this.state;
    const { isFreshBlock, isOpen, toggle } = this.props;


    return (
      <Modal isOpen={isOpen} toggle={toggle}>
        <ModalHeader toggle={toggle}>{`${isFreshBlock ? 'Add' : 'Update'}  Youtube Playlist Block`}</ModalHeader>
        <ModalBody>
          <FormGroup>
            <Label>URL</Label>
            <Input
              innerRef={(el) => { this.inputElement = el; }}
              onChange={this.handleChangeTextarea}
              placeholder="enter url or embed code"
              type="textarea"
              value={playlistId || null}
            />
          </FormGroup>
          {
            !isValid && touched
            && <p className="text-danger">{errorMsg}</p>
          }
          <FormGroup check>
            <Checkbox size="sd" id="autoplay" checked={autoplay} onChange={this.handleChangeCheckbox}>
              Autoplay
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
            && <YoutubePlaylistBlockPreview key={Math.random()} block={this.setBlock()} />
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
