import noop from 'lodash/noop';
import PropTypes from 'prop-types';
import React from 'react';

import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';
import { Button } from '@triniti/admin-ui-plugin/components';

import Uploader from '@triniti/cms/plugins/dam/components/uploader';

export default class UploaderButton extends React.Component {
  static propTypes = {
    children: PropTypes.node,
    linkedRefs: PropTypes.arrayOf(PropTypes.instanceOf(NodeRef)),
    onClose: PropTypes.func,
  };

  static defaultProps = {
    children: null,
    linkedRefs: null,
    onClose: noop,
  };

  constructor(props) {
    super(props);

    this.state = {
      isUploaderOpen: false,
    };

    this.handleToggleUploader = this.handleToggleUploader.bind(this);
  }

  handleToggleUploader() {
    this.setState(({ isUploaderOpen }) => ({ isUploaderOpen: !isUploaderOpen }));
  }

  render() {
    const {
      children,
      linkedRefs,
      onClose,
      ...btnProps
    } = this.props;

    const { isUploaderOpen } = this.state;

    return ([
      <Button key="a" style={{ margin: 0 }} color="primary" onClick={this.handleToggleUploader} {...btnProps}>{children || 'Upload files'}</Button>,
      isUploaderOpen // This lazy loads the uploader form only when isUploaderOpen is set to true
      && (
      <Uploader
        key="b"
        isOpen={isUploaderOpen}
        linkedRefs={linkedRefs}
        onToggleUploader={this.handleToggleUploader}
        onClose={onClose}
      />
      ),
    ]);
  }
}
