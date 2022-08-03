import React from 'react';
import { Alert, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import ActionButton from 'components/action-button';

function ErrorDetails({ error, errorInfo }) {
  return (
    <>
      <Alert color="danger" className="shadow-sm rounded">
        {error && error.toString()}
      </Alert>
      {errorInfo && (
        <pre>
          {errorInfo.componentStack}
        </pre>
      )}
    </>
  );
}

function ErrorModal(props) {
  return (
    <Modal isOpen backdrop="static">
      <ModalHeader toggle={props.toggle}>An Unexpected Error Occurred</ModalHeader>
      <ModalBody className="modal-scrollable p-3">
        <ErrorDetails {...props} />
      </ModalBody>
      <ModalFooter>
        <ActionButton text="Close" onClick={props.toggle} />
      </ModalFooter>
    </Modal>
  );
}

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null, errorInfo: null };
  }

  componentDidCatch(error, errorInfo) {
    console.error(error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo,
    })
  }

  render() {
    if (this.state.errorInfo) {
      const Component = !!this.props.asModal ? ErrorModal : ErrorDetails;
      return <Component error={this.state.error} errorInfo={this.state.errorInfo} {...this.props} />;
    }

    return this.props.children;
  }
}
