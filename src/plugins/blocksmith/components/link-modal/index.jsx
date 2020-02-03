import React from 'react';
import PropTypes from 'prop-types';
import { Button, Checkbox, Form, FormGroup, Input, Modal, ModalHeader, ModalBody, ModalFooter } from '@triniti/admin-ui-plugin/components';
import prependHttp from 'prepend-http';
import isValidUrl from '@gdbots/common/isValidUrl';

export default class LinkModal extends React.Component {
  static propTypes = {
    isOpen: PropTypes.bool,
    onAddLink: PropTypes.func.isRequired,
    onRemoveLink: PropTypes.func.isRequired,
    openInNewTab: PropTypes.bool,
    toggle: PropTypes.func.isRequired,
    url: PropTypes.string,
  };

  static defaultProps = {
    isOpen: false,
    openInNewTab: true,
    url: '',
  };

  constructor(props) {
    super(props);
    const { url, openInNewTab } = props;
    this.state = {
      isEditMode: !!url,
      isValid: true,
      openInNewTab,
      value: url || '',
    };
    this.inputRef = React.createRef();
    this.handleAddLink = this.handleAddLink.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleChangeCheckbox = this.handleChangeCheckbox.bind(this);
    this.handleRemoveLink = this.handleRemoveLink.bind(this);
  }

  componentDidMount() {
    this.inputRef.current.focus();
  }

  handleChange({ target: { value } }) {
    this.setState(() => ({
      value,
      isValid: isValidUrl(prependHttp(value, { https: true })),
    }));
  }

  handleChangeCheckbox() {
    this.setState(({ openInNewTab }) => ({ openInNewTab: !openInNewTab }));
  }

  handleAddLink() {
    const { openInNewTab, value } = this.state;
    const { toggle, onAddLink } = this.props;
    const url = prependHttp(value, { https: true });

    if (isValidUrl(url)) {
      const target = openInNewTab ? '_blank' : null;
      onAddLink(target, url);
      toggle(); 
    } else {
      this.setState(() => ({ isValid: false }));
    }
  }

  handleRemoveLink() {
    const { onRemoveLink, toggle } = this.props;
    onRemoveLink();
    toggle();
  }

  render() {
    const { isEditMode, isValid, openInNewTab, value } = this.state;
    const { isOpen, toggle } = this.props;

    return (
      <Modal isOpen={isOpen} toggle={toggle}>
        <ModalHeader toggle={toggle}>{`${isEditMode ? 'Update' : 'Add'} Link`}</ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Input
                type="textarea"
                placeholder="Enter a new link..."
                value={value}
                onChange={this.handleChange}
                innerRef={this.inputRef}
              />
              {!isValid && <p className="text-danger">please enter a valid link</p>}
            </FormGroup>
            <FormGroup>
              <Checkbox size="sd" onChange={this.handleChangeCheckbox} id="openInNewTab" checked={openInNewTab}>Open in new tab?</Checkbox>
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          {isEditMode && <Button onClick={this.handleRemoveLink}>Remove Link</Button>}
          <Button onClick={toggle}>Cancel</Button>
          <Button onClick={this.handleAddLink}>{isEditMode ? 'Update' : 'Add'}</Button>
        </ModalFooter>
      </Modal>
    );
  }
}
