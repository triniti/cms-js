import normalizeUnfinishedSlug from '@triniti/cms/utils/normalizeUnfinishedSlug';
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
    formComponent: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
    formConfigs: PropTypes.object, // eslint-disable-line react/forbid-prop-types
    formValues: PropTypes.object, // eslint-disable-line react/forbid-prop-types
    headerText: PropTypes.string,
    history: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
    isCreateDisabled: PropTypes.bool,
    match: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
    onToggle: PropTypes.func.isRequired,
  };

  static defaultProps = {
    buttonText: 'Start Editing',
    formConfigs: {},
    formValues: {},
    headerText: '',
    isCreateDisabled: true,
  };

  constructor(props) {
    super(props);
    const { delegate } = props;
    delegate.bindToComponent(this);

    this.handleBlurSlug = this.handleBlurSlug.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.renderForm = this.renderForm.bind(this);
    this.saveButton = React.createRef();
  }

  handleKeyDown(e) {
    const { key } = e;

    if (key === 'Enter') {
      e.preventDefault();

      const { delegate, formValues: { slug } } = this.props;
      const isDatedSlug = delegate.getSluggableConfig(delegate.getFormName());
      const normalizedSlug = normalizeUnfinishedSlug(slug, slug, isDatedSlug);

      delegate.handleChangeSlug(normalizedSlug);
      this.saveButton.current.focus();
      // setTimeout is necessary to avoid the race condition between redux-form CHANGE and SUBMIT
      setTimeout(delegate.handleSave);
    }
  }

  handleBlurSlug() {
    const { delegate, formValues: { slug } } = this.props;
    const isDatedSlug = delegate.getSluggableConfig(delegate.getFormName());
    const normalizedSlug = normalizeUnfinishedSlug(slug, slug, isDatedSlug);

    // without the setTimeout the change event fires but is then immediately
    // followed by a blur event which overwrites our change with the stale value
    setTimeout(() => { delegate.handleChangeSlug(normalizedSlug); });
  }

  renderForm() {
    const { delegate, formComponent: FormComponent, formConfigs, formValues, history } = this.props;

    return (
      <FormComponent
        form={delegate.getFormName()}
        history={history}
        onKeyDown={this.handleKeyDown}
        onBlurSlug={this.handleBlurSlug}
        onReset={delegate.handleReset}
        onSubmit={delegate.handleSubmit}
        validate={delegate.handleValidate}
        warn={delegate.handleWarn}
        formValues={formValues}
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
          <Button
            disabled={isCreateDisabled}
            innerRef={this.saveButton}
            onClick={delegate.handleSave}
          >{buttonText}
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}
