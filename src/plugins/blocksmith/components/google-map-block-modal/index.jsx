import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';
import Message from '@gdbots/pbj/Message';

import GoogleMapBlockPreview from '@triniti/cms/plugins/blocksmith/components/google-map-block-preview';
import {
  Button,
  Checkbox,
  DatePicker,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
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

import changedDate from '../../utils/changedDate';
import changedTime from '../../utils/changedTime';

// todo: make a maptype enum in schema?
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
      q: block.get('q') || '',
      errorMsg: '',
      hasUpdatedDate: block.has('updated_date'),
      isAutoZoom: block.get('zoom') === 0,
      isDropdownOpen: false,
      isValid: block.has('q') || block.has('center'),
      mapType: block.get('maptype'),
      touched: false,
      zoom: block.get('zoom'),
      updatedDate: block.has('updated_date') ? moment(block.get('updated_date')) : moment(),
      aside: block.get('aside'),
    };
    this.handleAddBlock = this.handleAddBlock.bind(this);
    this.handleChangeAutoZoom = this.handleChangeAutoZoom.bind(this);
    this.handleChangeDate = this.handleChangeDate.bind(this);
    this.handleChangeHasUpdatedDate = this.handleChangeHasUpdatedDate.bind(this);
    this.handleChangeLocation = this.handleChangeLocation.bind(this);
    this.handleChangeMapType = this.handleChangeMapType.bind(this);
    this.handleChangeTime = this.handleChangeTime.bind(this);
    this.handleChangeZoom = this.handleChangeZoom.bind(this);
    this.handleEditBlock = this.handleEditBlock.bind(this);
    this.handleChangeAside = this.handleChangeAside.bind(this);
    this.handleToggleDropDown = this.handleToggleDropDown.bind(this);
  }

  componentDidMount() {
    setTimeout((t) => {
      t.inputElement.focus();
    }, 0, this);
  }

  setBlock() {
    const { hasUpdatedDate, mapType, q, updatedDate, zoom, aside } = this.state;
    const { block } = this.props;
    return block.schema().createMessage()
      .set('maptype', mapType || null)
      .set('q', q || null)
      .set('zoom', zoom || null)
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

  handleChangeAutoZoom() {
    this.setState(({ isAutoZoom, zoom }) => ({
      isAutoZoom: !isAutoZoom,
      zoom: !isAutoZoom ? 0 : zoom || 1,
    }));
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
      errorMsg,
      hasUpdatedDate,
      isAutoZoom,
      isDropdownOpen,
      isValid,
      mapType,
      q,
      touched,
      updatedDate,
      zoom,
      aside
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
          {
            !isAutoZoom
            && (
              <FormGroup>
                <Label>Zoom</Label>
                <Input
                  onChange={this.handleChangeZoom}
                  type="number"
                  value={zoom}
                />
              </FormGroup>
            )
          }
          <FormGroup>
            <Label>Map type</Label>
            <Dropdown isOpen={isDropdownOpen} toggle={this.handleToggleDropDown}>
              <DropdownToggle caret>
                {mapType}
              </DropdownToggle>
              <DropdownMenu>
                {
                  mapTypes
                    .filter((type) => type !== mapType)
                    .map((type) => (
                      <DropdownItem
                        key={type}
                        onClick={this.handleChangeMapType}
                      >
                        {type}
                      </DropdownItem>
                    ))
                }
              </DropdownMenu>
            </Dropdown>
          </FormGroup>
          <FormGroup className="mr-4">
            <Checkbox size="sd" id="hasUpdatedDate" checked={hasUpdatedDate} onChange={this.handleChangeHasUpdatedDate}>
              Is update
            </Checkbox>
            <Checkbox size="sd" id="aside" checked={aside} onChange={this.handleChangeAside} className="ml-3">
              Aside
            </Checkbox>
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
            !isValid && touched
            && <p className="text-danger">{errorMsg}</p>
          }
          {
            isValid
            && (
              <GoogleMapBlockPreview
                block={this.setBlock()}
                width={528}
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
