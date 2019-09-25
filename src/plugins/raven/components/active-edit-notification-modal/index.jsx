/* eslint-disable react/no-did-update-set-state */
import React from 'react';
import Proptypes from 'prop-types';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';

import { Badge, Button, Icon, Modal, ModalBody } from '@triniti/admin-ui-plugin/components';
import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';
import mapDispatchToProps from './mapDispatchToProps';
import selector from './selector';
import './styles.scss';

class ActiveEditNotificationModal extends React.Component {
  constructor(props) {
    super(props);
    const { activeUserNames } = props;
    const shouldShowImmediately = activeUserNames.length > 0;

    this.state = {
      ready: shouldShowImmediately,
      isOpen: shouldShowImmediately,
    };

    if (!shouldShowImmediately) {
      setTimeout(() => {
        this.setState({ ready: true });
      }, 3000);
    }

    this.handleCancel = this.handleCancel.bind(this);
    this.handleContinueInEditMode = this.handleContinueInEditMode.bind(this);
    this.handleContinueInViewMode = this.handleContinueInViewMode.bind(this);
    this.handleToggle = this.handleToggle.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    const { activeUserNames } = this.props;
    const { ready } = this.state;

    if (!prevState.ready && ready) {
      this.setState({
        isOpen: activeUserNames.length > 0,
      });
    }
  }

  handleCancel() {
    const { handleContinueInViewMode, nodeRef, history } = this.props;
    handleContinueInViewMode(nodeRef);
    this.handleToggle();
    history.goBack();
  }

  handleContinueInViewMode() {
    const { handleContinueInViewMode, nodeRef, history, location } = this.props;
    const path = location.pathname;
    const viewModeLocation = path.substring(0, path.lastIndexOf('/edit'));

    handleContinueInViewMode(nodeRef);
    this.handleToggle();
    history.replace(viewModeLocation);
  }

  handleContinueInEditMode() {
    const { handleContinueInEditMode, nodeRef } = this.props;
    this.handleToggle();
    handleContinueInEditMode(nodeRef);
  }

  handleToggle() {
    const { isOpen } = this.state;
    this.setState({ isOpen: !isOpen });
  }

  render() {
    const { activeUserNames, nodeRef } = this.props;
    const { isOpen, ready } = this.state;
    if (!ready) {
      return null;
    }

    return (
      <Modal
        centered
        size="sd"
        isOpen={isOpen}
        keyboard={false}
        toggle={this.handleToggle}
        modalClassName="animate-center"
        backdrop="static"
      >
        <ModalBody className="text-center modal-wrapper">
          <Icon imgSrc="notification" alert size="lg" color="warning" border className="icon-modal" />
          <h2>Stop!</h2>
          <p className="text-modal">This {nodeRef.getLabel()} is being edited by:</p>
          {activeUserNames.map((userName) => (
            <h4 key={userName}>
              <Badge radius="round" color="light">{userName}</Badge>
            </h4>
          ))}
          <div className="modal-actions">
            <Button block outline color="primary" onClick={this.handleContinueInViewMode} className="btn-modal">
              Continue in View Mode
            </Button>
            <Button block outline color="danger" onClick={this.handleContinueInEditMode} className="btn-modal">
              Continue in Edit Mode (tell others you are in here)
            </Button>
            <Button block outline color="secondary" onClick={this.handleCancel} className="btn-modal">
              Cancel and Wait
            </Button>
          </div>
        </ModalBody>
      </Modal>
    );
  }
}

ActiveEditNotificationModal.propTypes = {
  activeUserNames: Proptypes.arrayOf(Proptypes.string).isRequired,
  handleContinueInEditMode: Proptypes.func.isRequired,
  handleContinueInViewMode: Proptypes.func.isRequired,
  history: Proptypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  location: Proptypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  nodeRef: Proptypes.instanceOf(NodeRef).isRequired,
};

export default withRouter(connect(selector, mapDispatchToProps)(ActiveEditNotificationModal));
