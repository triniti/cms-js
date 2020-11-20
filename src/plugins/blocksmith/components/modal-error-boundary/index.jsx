import React from 'react';
import swal from 'sweetalert2';

class ModalErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
    };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    const { onCloseModal } = this.props;

    // You can also log the error to an error reporting service
    console.error(error, errorInfo);

    swal.fire({
      confirmButtonText: 'ok',
      text: error.stack,
      title: 'An error occurred. Please report this issue to support.',
      type: 'error',
    }).finally(onCloseModal);
  }

  render() {
    const { block, children } = this.props;
    const { hasError } = this.state;

    if (!hasError) {
      return children;
    }

    return null;
  }
}

export default ModalErrorBoundary;
