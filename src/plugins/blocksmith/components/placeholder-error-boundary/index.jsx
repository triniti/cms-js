import { ContentBlock } from 'draft-js';
import PropTypes from 'prop-types';
import React from 'react';

class PlaceholderErrorBoundary extends React.Component {
  static propTypes = {
    block: PropTypes.instanceOf(ContentBlock).isRequired,
    children: PropTypes.node.isRequired,
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

  componentDidCatch(error, errorInfo) {
    console.error(error, errorInfo);
  }

  render() {
    const { block, children } = this.props;
    const { hasError } = this.state;

    if (!hasError) {
      return children;
    }

    if (!block) {
      return (
        <div>
          <p><strong>error rendering block</strong></p>
        </div>
      );
    }

    const blockNode = document.querySelector(`[data-offset-key="${block.getKey()}-0-0"]`);
    if (blockNode) {
      blockNode.classList.add('block-invalid');
    }

    let message = 'block';
    const blockData = block.getData();
    if (blockData && blockData.has('canvasBlock')) {
      message = blockData.get('canvasBlock').schema().getCurie().getMessage();
    }

    return (
      <div>
        <p><strong>{`error rendering ${message}`}</strong></p>
        <p>{block.toString()}</p>
      </div>
    );
  }
}

export default PlaceholderErrorBoundary;
