import React from 'react';

class PlaceholderErrorBoundary extends React.Component {
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
    // You can also log the error to an error reporting service
    console.error(error, errorInfo);
  }

  render() {
    const { block, children } = this.props;
    const { hasError } = this.state;

    if (!hasError) {
      return children;
    }

    if (block) {
      const blockNode = document.querySelector(`[data-offset-key="${block.getKey()}-0-0"]`);
      if (blockNode) {
        blockNode.classList.add('block-invalid');
      }
    }

    return (
      <div>
        <p>{block.toString()}</p>
      </div>
    );
  }
}

export default PlaceholderErrorBoundary;
