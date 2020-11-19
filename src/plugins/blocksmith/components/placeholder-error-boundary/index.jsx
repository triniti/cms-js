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

    let message = 'block';
    const blockData = block.getData();
    if (blockData && blockData.has('canvasBlock')) {
      message = blockData.get('canvasBlock').schema().getId().getCurie().getMessage(); // eslint-disable-line
    }

    return (
      <div>
        <p><strong>{`invalid ${message}`}</strong></p>
        <p>{block.toString()}</p>
      </div>
    );
  }
}

export default PlaceholderErrorBoundary;
