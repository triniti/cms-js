import DateTimePicker from '@triniti/cms/plugins/blocksmith/components/date-time-picker';
import GeoPoint from '@gdbots/pbj/well-known/GeoPoint';
import GoogleMapBlockPreview from '@triniti/cms/plugins/blocksmith/components/google-map-block-preview';
import Message from '@gdbots/pbj/Message';
import PropTypes from 'prop-types';
import React from 'react';
import { STATUS_FULFILLED, STATUS_NONE, STATUS_PENDING } from '@triniti/app/constants';
import UncontrolledTooltip from '@triniti/cms/plugins/common/components/uncontrolled-tooltip';
import {
  Button,
  Checkbox,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  FormGroup,
  Icon,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Spinner,
} from '@triniti/admin-ui-plugin/components';

import changedDate from '../../utils/changedDate';
import changedTime from '../../utils/changedTime';
import getCoordinatesFromAddress from './getCoordinatesFromAddress';

const mapTypes = [
  'roadmap',
  'satellite',
];

export default class GoogleMapBlockModal extends React.Component {
  static propTypes = {
    block: PropTypes.instanceOf(Message).isRequired,
    isFreshBlock: PropTypes.bool.isRequired,
    isOpen: PropTypes.bool.isRequired,
    toggle: PropTypes.func.isRequired,
    onAddBlock: PropTypes.func.isRequired,
    onEditBlock: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    const { block } = props;
    this.state = {
      aside: block.get('aside'),
      center: block.has('center') ? block.get('center').toString() : null,
      errorMsg: '',
      hasUpdatedDate: block.has('updated_date'),
      isAutoZoom: block.get('zoom') === 0,
      isDropdownOpen: false,
      isValid: block.has('q'),
      mapType: block.get('maptype'),
      q: block.get('q') || '',
      status: STATUS_NONE,
      touched: false,
      updatedDate: block.get('updated_date', new Date()),
      zoom: block.get('zoom'),
    };
    this.handleAddBlock = this.handleAddBlock.bind(this);
    this.handleChangeAutoZoom = this.handleChangeAutoZoom.bind(this);
    this.handleChangeCheckbox = this.handleChangeCheckbox.bind(this);
    this.handleChangeDate = this.handleChangeDate.bind(this);
    this.handleChangeLocation = this.handleChangeLocation.bind(this);
    this.handleChangeMapType = this.handleChangeMapType.bind(this);
    this.handleChangeTime = this.handleChangeTime.bind(this);
    this.handleChangeZoom = this.handleChangeZoom.bind(this);
    this.handleEditBlock = this.handleEditBlock.bind(this);
    this.handleToggleDropDown = this.handleToggleDropDown.bind(this);
  }

  componentDidMount() {
    setTimeout((t) => {
      t.inputElement.focus();
    }, 0, this);
  }

  setBlock() {
    const { aside, center, hasUpdatedDate, mapType, q, updatedDate, zoom } = this.state;
    const { block } = this.props;

    return block.schema().createMessage()
      .set('aside', aside)
      .set('center', center ? GeoPoint.fromString(center) : null)
      .set('maptype', mapType || null)
      .set('q', q || null)
      .set('updated_date', hasUpdatedDate ? updatedDate : null)
      .set('zoom', zoom || null);
  }

  async handleAddBlock() {
    const { q } = this.state;
    const { onAddBlock, toggle } = this.props;

    this.setState({ status: STATUS_PENDING });
    const coordinates = await getCoordinatesFromAddress(q);
    this.setState({ center: coordinates, status: STATUS_FULFILLED });
    onAddBlock(this.setBlock());
    toggle();
  }

  async handleEditBlock() {
    const { q, center } = this.state;
    const { block, onEditBlock, toggle } = this.props;

    if (q !== block.get('q') || !center) {
      this.setState({ status: STATUS_PENDING });
      const coordinates = await getCoordinatesFromAddress(q);
      this.setState({ center: coordinates, status: STATUS_FULFILLED });
    }

    onEditBlock(this.setBlock());
    toggle();
  }

  handleChangeAutoZoom() {
    this.setState(({ isAutoZoom, zoom }) => ({
      isAutoZoom: !isAutoZoom,
      zoom: !isAutoZoom ? 0 : zoom || 1,
    }));
  }

  handleChangeCheckbox({ target: { id, checked } }) {
    this.setState({ [id]: checked });
  }

  handleChangeHasUpdatedDate() {
    this.setState(({ hasUpdatedDate }) => ({ hasUpdatedDate: !hasUpdatedDate }));
  }

  handleChangeDate(date) {
    this.setState(changedDate(date));
  }

  handleChangeAside() {
    this.setState(({ aside }) => ({ aside: !aside }));
  }

  handleChangeTime({ target: { value: time } }) {
    this.setState(changedTime(time));
  }

  handleChangeLocation({ target: { value: q } }) {
    this.setState({ isValid: !!q, touched: true, q });
  }

  handleChangeMapType({ target: { innerText: mapType } }) {
    this.setState({ mapType });
  }

  handleChangeZoom(event) {
    const input = Math.floor(+event.target.value);
    let { errorMsg, isValid, zoom } = this.state;
    if (input < 0 || input > 21) {
      errorMsg = 'zoom must be between 0 and 21';
      isValid = false;
      zoom = input < 0 ? 0 : 21;
    } else {
      errorMsg = '';
      isValid = true;
      zoom = input;
    }
    this.setState({
      errorMsg,
      isAutoZoom: zoom === 0,
      isValid,
      touched: true,
      zoom,
    });
  }

  handleToggleDropDown() {
    this.setState(({ isDropdownOpen }) => ({ isDropdownOpen: !isDropdownOpen }));
  }

  render() {
    const {
      aside,
      errorMsg,
      hasUpdatedDate,
      isAutoZoom,
      isDropdownOpen,
      isValid,
      mapType,
      q,
      status,
      touched,
      updatedDate,
      zoom,
    } = this.state;
    const { isOpen, isFreshBlock, toggle } = this.props;

    return (
      <Modal isOpen={isOpen} toggle={toggle}>
        <ModalHeader toggle={toggle}>{`${isFreshBlock ? 'Add' : 'Update'} Google Map Block`}</ModalHeader>
        <ModalBody>
          <FormGroup>
            <Label>Location</Label>
            <Input
              innerRef={(el) => { this.inputElement = el; }}
              onChange={this.handleChangeLocation}
              value={q}
              placeholder="enter location"
            />
          </FormGroup>
          <FormGroup>
            <Checkbox
              checked={isAutoZoom}
              onChange={this.handleChangeAutoZoom}
              size="sd"
            >
              Auto Zoom
            </Checkbox>
          </FormGroup>
          {!isAutoZoom
            && (
              <FormGroup>
                <Label>Zoom</Label>
                <Input
                  onChange={this.handleChangeZoom}
                  type="number"
                  value={zoom}
                />
              </FormGroup>
            )}
          <FormGroup>
            <Label>Map type</Label>
            <Dropdown isOpen={isDropdownOpen} toggle={this.handleToggleDropDown}>
              <DropdownToggle caret>
                {mapType}
              </DropdownToggle>
              <DropdownMenu>
                {mapTypes
                  .filter((type) => type !== mapType)
                  .map((type) => (
                    <DropdownItem
                      key={type}
                      onClick={this.handleChangeMapType}
                    >
                      {type}
                    </DropdownItem>
                  ))}
              </DropdownMenu>
            </Dropdown>
          </FormGroup>
          <FormGroup className="mr-4">
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
          {
            !isValid && touched
            && <p className="text-danger">{errorMsg}</p>
          }
          {isValid
            && (
              <GoogleMapBlockPreview
                block={this.setBlock()}
                width={528}
              />
            )}
        </ModalBody>
        <ModalFooter>
          <Button onClick={toggle}>Cancel</Button>
          {status === STATUS_PENDING && (
            <Spinner key="spinner" />
          )}
          {status !== STATUS_PENDING && (
            <Button
              disabled={!isValid}
              onClick={isFreshBlock ? this.handleAddBlock : this.handleEditBlock}
            >
              {isFreshBlock ? 'Add' : 'Update'}
            </Button>
          )}
        </ModalFooter>
      </Modal>
    );
  }
}
