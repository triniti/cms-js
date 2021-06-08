import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';
import delegate from './delegate';
import selector from './selector';

class PreviewComponent extends React.Component {
  static propTypes = {
    getNode: PropTypes.func.isRequired,
    handleGetPollNode: PropTypes.func.isRequired,
    nodeRefs: PropTypes.arrayOf(PropTypes.instanceOf(NodeRef)),
  };

  static defaultProps = {
    nodeRefs: null,
  };

  componentDidMount() {
    const { getNode, handleGetPollNode, nodeRefs } = this.props;

    if (Array.isArray(nodeRefs) && nodeRefs.length) {
      nodeRefs.forEach((nodeRef) => {
        if (!getNode(nodeRef)) {
          handleGetPollNode(nodeRef);
        }
      });
    }
  }

  render() {
    return null;
  }
}

export default connect(selector, delegate)(PreviewComponent);
