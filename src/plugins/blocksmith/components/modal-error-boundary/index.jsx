import PropTypes from 'prop-types';
import React from 'react';
import swal from 'sweetalert2';

class ModalErrorBoundary extends React.Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    onCloseModal: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
    };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    const { onCloseModal } = this.props;

    swal.fire({
      allowOutsideClick: false,
      confirmButtonText: 'ok',
      text: error.stack,
      title: 'An error occurred. Please report this issue to support.',
      type: 'error',
    }).finally(onCloseModal);
  }

  render() {
    const { children } = this.props;
    const { hasError } = this.state;

    if (!hasError) {
      return children;
    }

    return null;
  }
}

export default ModalErrorBoundary;
