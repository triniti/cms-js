import React from 'react';
import { Button, CardBody, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { Icon } from '@triniti/cms/components';

class UiModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      nestedModal: false,
      singleModal: false,
      smallModal: false,
      spinnerModal: false,
      collapseCode1: false,
      modalBlock: false,
      modalMasonry: false,
      modalSquare: false,
      modalSquare2: false,
      activeTab: 'tab1',
    };

    this.toggle = this.toggle.bind(this);
    this.toggleNested = this.toggleNested.bind(this);
    this.toggleAll = this.toggleAll.bind(this);
    this.toggleSmall = this.toggleSmall.bind(this);
    this.toggleSingle = this.toggleSingle.bind(this);
    this.toggleSpinner = this.toggleSpinner.bind(this);
    this.toggleCode1 = this.toggleCode1.bind(this);
    this.toggleBlock = this.toggleBlock.bind(this);
    this.toggleMasonry = this.toggleMasonry.bind(this);
    this.toggleSquare = this.toggleSquare.bind(this);
    this.toggleSquare2 = this.toggleSquare2.bind(this);
    this.toggleNav = this.toggleNav.bind(this);
  }

  toggle() {
    this.setState({
      modal: !this.state.modal,
    });
  }

  toggleNested() {
    this.setState({
      nestedModal: !this.state.nestedModal,
    });
  }

  toggleAll() {
    this.toggle();
    this.toggleNested();
  }

  toggleSmall() {
    this.setState({
      smallModal: !this.state.smallModal,
    });
  }

  toggleSingle() {
    this.setState({
      singleModal: !this.state.singleModal,
    });
  }

  toggleSpinner() {
    this.setState({
      spinnerModal: !this.state.spinnerModal,
    });
  }

  toggleCode1() {
    this.setState({ collapseCode1: !this.state.collapseCode1 });
  }

  toggleBlock() {
    this.setState({
      modalBlock: !this.state.modalBlock,
    });
  }

  toggleMasonry() {
    this.setState({
      modalMasonry: !this.state.modalMasonry,
    });
  }

  toggleSquare() {
    this.setState({
      modalSquare: !this.state.modalSquare,
    });
  }

  toggleSquare2() {
    this.setState({
      modalSquare2: !this.state.modalSquare2,
    });
  }

  toggleNav(tab1) {
    if (this.state.activeTab !== tab1) {
      this.setState({
        activeTab: tab1,
      });
    }
  }

  render() {

    return (
      <CardBody className="card-body-indent">
        <Button color="secondary" onClick={this.toggle}>Click Me</Button>
        <Modal centered isOpen={this.state.modal} toggle={this.toggle} size="lg">
          <ModalHeader toggle={this.toggle}>Add Image Block <Button color="primary" className="ms-3"
                                                                    size="sm">Upload</Button></ModalHeader>
          <ModalBody className="pb-7">
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit,
              sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
              Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia
              deserunt mollit anim id est laborum.
            </p>
            <Button outline onClick={this.toggleNested}>Show Nested Modal</Button>
            <Modal isOpen={this.state.nestedModal} toggle={this.toggleNested} size="sm">
              <ModalBody className="text-center modal-wrapper"><h2>Nested Modal</h2><p className="text-body-light">Do
                you want to clear everything?</p></ModalBody>
              <ModalFooter className="modal-footer-buttons">
                <Button outline color="secondary" size="lg" onClick={this.toggleAll}>Clear</Button>
                <Button outline color="secondary" size="lg" onClick={this.toggleNested}>Cancel</Button>
              </ModalFooter>
            </Modal>
          </ModalBody>
          <ModalFooter>
            <Button color="link-bg" onClick={this.toggleNested}>Not Done</Button>
            <Button color="secondary" onClick={this.toggle}>All Done</Button>
          </ModalFooter>
        </Modal>

        <Button outline color="secondary" onClick={this.toggleSmall}>Small Modal</Button>
        <Modal centered isOpen={this.state.smallModal} toggle={this.toggleSmall} size="sm"
               modalClassName="animate-center">
          <ModalBody className="text-center modal-wrapper"><h2>Modal Action</h2><p className="text-body-light">Do you
            want to clear everything?</p></ModalBody>
          <ModalFooter className="modal-footer-buttons">
            <Button outline color="danger" size="lg" onClick={this.toggleSmall}>Clear</Button>
            <Button outline color="secondary" size="lg" onClick={this.toggleSmall}>Cancel</Button>
          </ModalFooter>
        </Modal>

        <Button outline onClick={this.toggleSingle}>Sweet Alert Style Modal</Button>
        <Modal centered size="sd" isOpen={this.state.singleModal} toggle={this.toggleSingle}
               modalClassName="animate-center">
          <ModalBody className="text-center modal-wrapper">
            <Icon imgSrc="locked" alert size="lg" color="danger" border className="icon-modal" />
            <h2>Hey There!</h2>
            <p className="text-modal">This modal mimics Sweet Alert!</p>
            <div className="modal-actions">
              <Button color="danger" onClick={this.toggleSingle} className="btn-modal">Delete This</Button>
              <Button color="secondary" onClick={this.toggleSingle} className="btn-modal">Cancel Deletion</Button>
            </div>
          </ModalBody>
        </Modal>

        <Button outline onClick={this.toggleSpinner}>Loading Spinner Modal</Button>
        <Modal
          centered
          size="xs"
          backdropClassName="modal-loading-bg"
          className="modal-loading"
          contentClassName="modal-spinner"
          modalClassName="animate-center"
          isOpen={this.state.spinnerModal}
          toggle={this.toggleSpinner}>
          <ModalBody />
        </Modal>
      </CardBody>
    );
  }
}

export default UiModal;
