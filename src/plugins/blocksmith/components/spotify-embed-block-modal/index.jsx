import DateTimePicker from '@triniti/cms/plugins/blocksmith/components/date-time-picker';
import Message from '@gdbots/pbj/Message';
import PropTypes from 'prop-types';
import React from 'react';
import SpotifyEmbedBlockPreview from '@triniti/cms/plugins/blocksmith/components/spotify-embed-block-preview';
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

const SPOTIFY_TYPE_REGEX = /(show|episode|album|track|playlist)+/;
const SPOTIFY_ID_REGEX = /([A-Z0-9])\w+/;

export default class SpotifyEmbedBlockModal extends React.Component {
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
      isValid: false,
      touched: false,
      spotifyId: block.get('spotify_id'),
      spotifyType: block.get('spotify_type'),
      updatedDate: block.get('updated_date', new Date()),
    };
    this.handleAddBlock = this.handleAddBlock.bind(this);
    this.handleChangeCheckbox = this.handleChangeCheckbox.bind(this);
    this.handleChangeDate = this.handleChangeDate.bind(this);
    this.handleChangeTextArea = this.handleChangeTextArea.bind(this);
    this.handleChangeTime = this.handleChangeTime.bind(this);
    this.handleEditBlock = this.handleEditBlock.bind(this);
  }

  componentDidMount() {
    this.inputElement.focus();
  }

  setBlock() {
    const { hasUpdatedDate,
      spotifyId,
      spotifyType,
      updatedDate,
      aside,
    } = this.state;
    const { block } = this.props;
    return block.schema().createMessage()
      .set('aside', aside)
      .set('spotify_id', spotifyId || null)
      .set('spotify_type', spotifyType || null)
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
    let { errorMsg, isValid, spotifyId, spotifyType } = this.state;

    if (SPOTIFY_ID_REGEX.test(input)) {
      errorMsg = '';
      isValid = true;
      spotifyId = input.match(SPOTIFY_ID_REGEX)[0];
      spotifyType = input.match(SPOTIFY_TYPE_REGEX)[0];
    } else {
      errorMsg = 'url or embed code is invalid';
      isValid = false;
      spotifyId = '';
      spotifyType = '';
    }

    this.setState({
      errorMsg,
      spotifyId,
      spotifyType,
      isValid,
      touched: true,
    });
  }

  render() {
    const {
      aside,
      errorMsg,
      hasUpdatedDate,
      isValid,
      touched,
      spotifyId,
      spotifyType,
      updatedDate,
    } = this.state;

    const { isFreshBlock, isOpen, toggle } = this.props;
    const url = (spotifyId) ? `https://open.spotify.com/${spotifyType}/${spotifyId}/` : '';

    return (
      <Modal isOpen={isOpen} toggle={toggle}>
        <ModalHeader toggle={toggle}>{`${isFreshBlock ? 'Add' : 'Update'} Spotify Embed Block`}</ModalHeader>
        <ModalBody>
          <FormGroup>
            <Label>{isValid ? 'Track id' : 'Embed code, Link, URI, or Track id'}</Label>
            <Input
              innerRef={(el) => { this.inputElement = el; }}
              onChange={this.handleChangeTextArea}
              placeholder="enter embed code"
              type="textarea"
              value={url}
            />
          </FormGroup>
          {
            !isValid && touched && spotifyId !== ''
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
            && <SpotifyEmbedBlockPreview type={spotifyType} block={this.setBlock()} />
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
