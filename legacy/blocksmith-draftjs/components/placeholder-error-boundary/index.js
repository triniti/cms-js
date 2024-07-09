import React from 'react';

export default class PlaceholderErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
    };
  }

  /*
   * Hooks support for this coming soon:
   * https://reactjs.org/docs/hooks-faq.html#do-hooks-cover-all-use-cases-for-classes
   * There are no Hook equivalents to the uncommon getSnapshotBeforeUpdate, getDerivedStateFromError
   * and componentDidCatch lifecycles yet, but we plan to add them soon.
   */
  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error(error, errorInfo);
    window.onerror(error);
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
