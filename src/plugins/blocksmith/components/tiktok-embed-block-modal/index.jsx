import Message from '@gdbots/pbj/Message';
import PropTypes from 'prop-types';
import React from 'react';
import TikTokEmbedBlockPreview from '@triniti/cms/plugins/blocksmith/components/tiktok-embed-block-preview';
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

import getTikTokId from './getTikTokId';

export default class TikTokEmbedBlockModal extends React.Component {
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
      isValid: block.has('tiktok_id'),
      touched: false,
      tiktokId: block.get('tiktok_id'),
    };
    this.handleAddBlock = this.handleAddBlock.bind(this);
    this.handleChangeCheckbox = this.handleChangeCheckbox.bind(this);
    this.handleChangeTextArea = this.handleChangeTextArea.bind(this);
    this.handleEditBlock = this.handleEditBlock.bind(this);
  }

  componentDidMount() {
    this.inputElement.focus();
  }
  
  setBlock() {
    const { 
      tiktokId,
      aside,
    } = this.state;
    const { block } = this.props;
    return block.schema().createMessage()
      .set('aside', aside)
      .set('tiktok_id', tiktokId || null);
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

  handleChangeTextArea(event) {
    const input = event.target.value;
    const { id, isValid } = getTikTokId(input);
    this.setState({
      errorMsg: isValid ? '' : 'embed code, url or id is invalid',
      tiktokId: isValid ? id : input,
      isValid,
      touched: true,
    });
  }

  render() {
    const {
      aside,
      errorMsg,
      isValid,
      touched,
      tiktokId,
    } = this.state;

    const { isFreshBlock, isOpen, toggle } = this.props;

    return (
      <Modal isOpen={isOpen} toggle={toggle}>
        <ModalHeader toggle={toggle}>{`${isFreshBlock ? 'Add' : 'Update'} TikTok Embed Block`}</ModalHeader>
        <ModalBody>
          <FormGroup>
            <Label>{isValid ? 'TikTok Id' : 'TikTok Embed Code, URL, or ID'}</Label>
            <Input
              innerRef={(el) => { this.inputElement = el; }}
              onChange={this.handleChangeTextArea}
              placeholder="enter embed code, url, or id"
              type="textarea"
              value={tiktokId || ''}
            />
          </FormGroup>
          {
            !isValid && touched && tiktokId !== ''
            && <p className="text-danger">{errorMsg}</p>
          }
          <FormGroup>
            <Checkbox size="sd" id="aside" checked={aside} onChange={this.handleChangeCheckbox}>
              Aside
            </Checkbox>
            <Icon imgSrc="info-outline" id="aside-tooltip" size="xs" className="ml-1" />
            <UncontrolledTooltip target="aside-tooltip">Is only indirectly related to the main content.</UncontrolledTooltip>
          </FormGroup>
          {isValid && <TikTokEmbedBlockPreview block={this.setBlock()} />}
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
