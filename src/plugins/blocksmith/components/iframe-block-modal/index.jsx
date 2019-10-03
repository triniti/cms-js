import isEmpty from 'lodash/isEmpty';
import moment from 'moment';
import omit from 'lodash/omit';
import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import swal from 'sweetalert2';

import isValidUrl from '@gdbots/common/isValidUrl';
import Message from '@gdbots/pbj/Message';
import IframeBlockPreview from '@triniti/cms/plugins/blocksmith/components/iframe-block-preview';
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
  Select,
} from '@triniti/admin-ui-plugin/components';

import changedDate from '../../utils/changedDate';
import changedTime from '../../utils/changedTime';
import determineIfExistingBlocksCanBeUsed from '../../utils/determineIfExistingBlocksCanBeUsed';

const useSSl = document.location.protocol === 'https:';
// specifically used to match data attributes set to iframe tag
const IFRAME_DATA_ATTR_REGEX = /data-([^"']+)=["']([^"']+)["']/gi;
const IFRAME_ALIGN_ATTR_REGEX = /align=["']([^"']*)["']/;
const IFRAME_HEIGHT_ATTR_REGEX = /height=["']([^"']*)["']/;
const IFRAME_SRC_ATTR_REGEX = /src=["']([^"']*)["']/;
const IFRAME_WIDTH_ATTR_REGEX = /width=["']([^"']*)["']/;

export default class IframeBlockModal extends React.Component {
  static async confirmBlock(type) {
    return swal.fire({
      title: `This looks like a ${type} block`,
      text: 'Would you like to use that block instead?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      confirmButtonClass: 'btn btn-danger',
      cancelButtonClass: 'btn btn-secondary',
      reverseButtons: true,
    });
  }

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
      align: block.get('align'),
      data: block.get('data') || {},
      hasManualDimensions: block.has('height') && block.has('width'),
      hasUpdatedDate: block.has('updated_date'),
      height: block.has('height') ? Number(block.get('height').replace('px', '')) : null,
      src: block.get('src'),
      updatedDate: block.has('updated_date') ? moment(block.get('updated_date')) : moment(),
      width: block.has('width') ? Number(block.get('width').replace('px', '')) : null,
      aside: block.get('aside'),
    };
    this.handleAddBlock = this.handleAddBlock.bind(this);
    this.handleChangeCheckbox = this.handleChangeCheckbox.bind(this);
    this.handleChangeDataAttribute = this.handleChangeDataAttribute.bind(this);
    this.handleChangeDate = this.handleChangeDate.bind(this);
    this.handleChangeInput = this.handleChangeInput.bind(this);
    this.handleChangeSelect = this.handleChangeSelect.bind(this);
    this.handleChangeTextarea = this.handleChangeTextarea.bind(this);
    this.handleChangeTime = this.handleChangeTime.bind(this);
    this.handleEditBlock = this.handleEditBlock.bind(this);
    this.handleRemoveDataAttribute = this.handleRemoveDataAttribute.bind(this);
  }

  componentDidMount() {
    setTimeout((t) => {
      t.inputElement.focus();
    }, 0, this);
  }

  setBlock() {
    const {
      align,
      data,
      hasManualDimensions,
      hasUpdatedDate,
      height,
      src,
      updatedDate,
      width,
      aside,
    } = this.state;
    const { block } = this.props;
    const setBlock = block.schema().createMessage()
      .set('align', align || null)
      .set('height', hasManualDimensions && height ? `${height}px` : null)
      .set('src', src || null)
      .set('width', hasManualDimensions && width ? `${width}px` : null)
      .set('updated_date', hasUpdatedDate ? updatedDate.toDate() : null)
      .set('aside', aside);

    setBlock.clear('data');
    Object.entries(data).forEach(([key, value]) => {
      setBlock.addToMap('data', key, value);
    });

    return setBlock;
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

  handleChangeTextarea({ target: { value: input } }) {
    const { toggle } = this.props;
    const blockType = determineIfExistingBlocksCanBeUsed(input);

    if (blockType) {
      IframeBlockModal.confirmBlock(blockType).then(({ value }) => {
        if (value) {
          toggle();
          // todo: open the other modal if user agrees
        } else {
          // do nothing, user declined
        }
      });
    }

    let { align, height, width } = this.state;
    let src = input;
    const dataAttributes = {};
    let matchArr = [];

    if (IFRAME_ALIGN_ATTR_REGEX.test(input)) {
      align = input.match(IFRAME_ALIGN_ATTR_REGEX)[1];
    }
    if (IFRAME_HEIGHT_ATTR_REGEX.test(input)) {
      height = input.match(IFRAME_HEIGHT_ATTR_REGEX)[1];
    }
    if (IFRAME_WIDTH_ATTR_REGEX.test(input)) {
      width = input.match(IFRAME_WIDTH_ATTR_REGEX)[1];
    }
    if (IFRAME_DATA_ATTR_REGEX.test(input)) {
      let matches = [];
      matches = input.match(IFRAME_DATA_ATTR_REGEX);
      matches.forEach((item) => {
        // without resetting the lastIndex,
        // the exec method will start matching from the most recent matched index
        IFRAME_DATA_ATTR_REGEX.lastIndex = 0;

        matchArr = IFRAME_DATA_ATTR_REGEX.exec(item);
        // three elements in matchArr for each data attribute match - full match, key and value
        // Example: for 'data-foo = bar', the matchArr Array will have [data-foo, foo, bar]
        dataAttributes[matchArr[1]] = matchArr[2];
      });
    }

    if (IFRAME_SRC_ATTR_REGEX.test(input)) {
      src = decodeURIComponent(input.match(IFRAME_SRC_ATTR_REGEX)[1]);
    } else { // direct url, presumably
      src = decodeURIComponent(input);
    }
    if (/^\/\//.test(src)) { // eg '//blah.sweetvideo.com'
      src = `https:${src}`;
    }
    if (/^http:/.test(src) && useSSl) {
      src = src.replace(/^http:/, 'https:');
    }

    this.setState({
      align,
      height,
      src,
      width,
      data: dataAttributes,
    });
  }

  handleChangeDate(date) {
    this.setState(changedDate(date));
  }

  handleChangeTime({ target: { value: time } }) {
    this.setState(changedTime(time));
  }

  handleChangeInput({ target: { id, value } }) {
    this.setState({ [id]: value });
  }

  handleChangeDataAttribute({ target: { id, value } }) {
    this.setState(({ data }) => ({
      data: {
        ...data,
        [id]: value,
      },
    }));
  }

  handleChangeCheckbox({ target: { id, checked } }) {
    this.setState({ [id]: checked });
  }

  handleChangeSelect(option) {
    this.setState({ align: option ? option.value : null });
  }

  handleRemoveDataAttribute(key) {
    this.setState(({ data }) => ({ data: omit(data, key) }));
  }

  render() {
    const {
      align,
      data,
      hasManualDimensions,
      hasUpdatedDate,
      height,
      src,
      updatedDate,
      width,
      aside,
    } = this.state;
    const { isFreshBlock, isOpen, toggle } = this.props;
    const isValid = isValidUrl(src);

    return (
      <div>
        <Modal isOpen={isOpen} toggle={toggle}>
          <ModalHeader toggle={toggle}>
            {`${isFreshBlock ? 'Add' : 'Update'} iFrame Block`}
          </ModalHeader>
          <ModalBody>
            <FormGroup>
              <Label>iFrame Source URL</Label>
              <Input
                innerRef={(el) => { this.inputElement = el; }}
                onChange={this.handleChangeTextarea}
                placeholder="Enter iframe source or embed code"
                type="textarea"
                value={src || ''}
              />
            </FormGroup>
            {
              src && !isValid
              && <p className="text-danger">iFrame source or embed code is invalid</p>
            }
            {
              isValid && src
              && <IframeBlockPreview block={this.setBlock()} />
            }
            <FormGroup className="mt-3" style={{ clear: 'both' }}>
              <Label>Align</Label>
              <Select
                id="align"
                name="align"
                onChange={this.handleChangeSelect}
                value={align || ''}
                options={[
                  { label: 'left', value: 'left' },
                  { label: 'center', value: 'center' },
                  { label: 'right', value: 'right' },
                ]}
              />
              {!isEmpty(data) && <Label className="mt-3"><strong>Data Attributes</strong></Label>}
              {!isEmpty(data) && Object.entries(data).map(([key, value]) => (
                <InputGroup key={key}>
                  <Label className="mt-2 pr-3">{key}</Label>
                  <Input
                    type="text"
                    id={key}
                    value={value}
                    onChange={this.handleChangeDataAttribute}
                  />
                  <Button color="danger" onClick={() => this.handleRemoveDataAttribute(key)}>
                    Remove
                  </Button>
                </InputGroup>
              ))}
              <FormGroup className="mr-4 mt-3">
                <Checkbox id="hasManualDimensions" size="sd" checked={hasManualDimensions} onChange={this.handleChangeCheckbox}>
                  Manually adjust dimensions
                </Checkbox>
              </FormGroup>
              {
                hasManualDimensions
                && (
                  <>
                    <Label>Height</Label>
                    <Input
                      id="height"
                      onChange={this.handleChangeInput}
                      type="number"
                      value={height || ''}
                    />
                    <Label className="mt-3">Width</Label>
                    <Input
                      id="width"
                      onChange={this.handleChangeInput}
                      type="number"
                      value={width || ''}
                    />
                  </>
                )
              }
            </FormGroup>
            <FormGroup className="mr-4">
              <Checkbox id="hasUpdatedDate" size="sd" checked={hasUpdatedDate} onChange={this.handleChangeCheckbox}>
                Is update
              </Checkbox>
            </FormGroup>
            <FormGroup className="mr-4">
              <Checkbox size="sd" checked={aside} onChange={this.handleChangeCheckbox}>
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
      </div>
    );
  }
}
