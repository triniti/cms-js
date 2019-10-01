import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import createDelegateFactory from '@triniti/app/createDelegateFactory';
import Message from '@gdbots/pbj/Message';
import NodeStatus from '@gdbots/schemas/gdbots/ncr/enums/NodeStatus';
import { STATUS_FULFILLED } from '@triniti/app/constants';
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from '@triniti/admin-ui-plugin/components';

import delegateFactory from './delegate';
import Form from './Form';
import schemas from './schemas';
import selector from './selector';

class CreateNotificationModal extends React.Component {
  static propTypes = {
    apps: PropTypes.arrayOf(PropTypes.instanceOf(Message)),
    contentChangeable: PropTypes.bool,
    delegate: PropTypes.shape({
      handleGetAllApps: PropTypes.func.isRequired,
      handleSave: PropTypes.func,
      handleSubmit: PropTypes.func,
      handleValidate: PropTypes.func,
    }).isRequired,
    formValues: PropTypes.object, // eslint-disable-line react/forbid-prop-types
    getAllAppsRequestState: PropTypes.shape({
      exception: PropTypes.object,
      request: PropTypes.object,
      response: PropTypes.object,
      status: PropTypes.string,
    }).isRequired,
    history: PropTypes.object.isRequired, // eslint-disable-line
    isCreateDisabled: PropTypes.bool,
    location: PropTypes.object.isRequired, // eslint-disable-line
    onToggle: PropTypes.func.isRequired,
  };

  static defaultProps = {
    apps: [],
    contentChangeable: true,
    formValues: {},
    isCreateDisabled: true,
  };

  constructor(props) {
    super(props);
    const { delegate, getAllAppsRequestState } = props;
    delegate.bindToComponent(this);

    this.state = { isOpen: true };

    if (getAllAppsRequestState.status !== STATUS_FULFILLED) {
      delegate.handleGetAllApps();
    }
  }

  render() {
    const {
      apps,
      contentChangeable,
      delegate,
      formValues,
      history,
      isCreateDisabled,
      onToggle,
    } = this.props;
    const { isOpen } = this.state;
    const { type, appRef } = formValues;

    if (appRef && appRef.value) {
      const appType = appRef.value.replace(/(-app:.*)$/g, '');

      schemas.node = schemas.nodes.find(
        (schema) => schema.getCurie().getQName().toString().includes(appType),
      );
    }

    return (
      <Modal
        backdropClassName="modal-create-backdrop"
        isOpen={isOpen}
        size="lg"
        toggle={onToggle}
      >
        <ModalHeader toggle={onToggle}>Create Notification</ModalHeader>
        <ModalBody>
          <Form
            apps={apps.filter((app) => app.get('status') !== NodeStatus.DELETED)}
            contentChangeable={contentChangeable}
            form={delegate.getFormName()}
            history={history}
            onReset={delegate.handleReset}
            onSubmit={delegate.handleSubmit}
            schemas={schemas}
            type={type || null}
            validate={delegate.handleValidate}
          />
        </ModalBody>
        <ModalFooter>
          <Button onClick={delegate.handleSave} disabled={isCreateDisabled}>
            Start Editing
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}

export default withRouter(connect(
  selector,
  createDelegateFactory(delegateFactory),
)(CreateNotificationModal));
