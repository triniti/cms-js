import PropTypes from 'prop-types';
import React from 'react';

import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from '@triniti/admin-ui-plugin/components';
import AbstractDelegate from './AbstractDelegate';

/**
 * Fixme: Figure out a way to display server side error message inside modal. Ref. https://app.assembla.com/spaces/triniti/tickets/219-update-sendalert()-to-target-modals/details
 */
export default class CreateNodeModal extends React.Component {
  static propTypes = {
    buttonText: PropTypes.string,
    delegate: PropTypes.oneOfType([
      PropTypes.instanceOf(AbstractDelegate),
      PropTypes.shape({
        handleSubmit: PropTypes.func,
        handleSave: PropTypes.func,
      }),
    ]).isRequired,
    formComponent: PropTypes.func.isRequired, // a redux-form
    formConfigs: PropTypes.object, // eslint-disable-line react/forbid-prop-types
    headerText: PropTypes.string,
    history: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
    isCreateDisabled: PropTypes.bool,
    match: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
    onToggle: PropTypes.func.isRequired,
  };

  static defaultProps = {
    buttonText: 'Start Editing',
    formConfigs: {},
    headerText: '',
    isCreateDisabled: true,
  };

  constructor(props) {
    super(props);
    const { delegate } = props;
    delegate.bindToComponent(this);

    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleNormalizeSlug = this.handleNormalizeSlug.bind(this);
    this.renderForm = this.renderForm.bind(this);
  }

  handleKeyDown({ key }) {
    const { delegate } = this.props;
    if (key === 'Enter') {
      delegate.handleSave();
    }
  }

  handleNormalizeSlug(slug) {
    let newSlug = slug;
    if (/[-/]/.test(newSlug[0])) {
      newSlug = newSlug.substring(1, newSlug.length);
    }
    return newSlug.replace(' ', '-').replace(/[^a-z0-9-/]+/g, '').replace(/\/{2,}/g, '/');
  }

  renderForm() {
    const { delegate, formComponent: FormComponent, formConfigs, history } = this.props;

    return (
      <FormComponent
        form={delegate.getFormName()}
        history={history}
        onKeyDown={this.handleKeyDown}
        onNormalizeSlug={this.handleNormalizeSlug}
        onReset={delegate.handleReset}
        onSubmit={delegate.handleSubmit}
        validate={delegate.handleValidate}
        warn={delegate.handleWarn}
        {...formConfigs}
      />
    );
  }

  render() {
    const {
      buttonText,
      delegate,
      headerText,
      isCreateDisabled,
      onToggle,
    } = this.props;

    return (
      <Modal size="lg" backdropClassName="modal-create-backdrop" toggle={onToggle} isOpen>
        <ModalHeader toggle={onToggle}>
          {headerText}
        </ModalHeader>
        <ModalBody>
          {this.renderForm()}
        </ModalBody>
        <ModalFooter>
          <Button disabled={isCreateDisabled} onClick={delegate.handleSave}>{buttonText}</Button>
        </ModalFooter>
      </Modal>
    );
  }
}
