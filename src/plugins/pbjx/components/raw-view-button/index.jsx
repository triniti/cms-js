import PropTypes from 'prop-types';
import React from 'react';
import { Button } from '@triniti/admin-ui-plugin/components';
import RawViewer from '@triniti/cms/plugins/pbjx/components/raw-view-modal';
import Message from '@gdbots/pbj/Message';

export default class RawViewButton extends React.Component {
  static propTypes = {
    event: PropTypes.instanceOf(Message).isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      isRawViewerOpen: false,
    };

    this.handleToggleRawViewer = this.handleToggleRawViewer.bind(this);
  }

  handleToggleRawViewer() {
    this.setState(({ isRawViewerOpen }) => ({ isRawViewerOpen: !isRawViewerOpen }));
  }

  render() {
    const {
      event,
      ...btnProps
    } = this.props;

    const { isRawViewerOpen } = this.state;

    return ([
      <Button key="a" color="light" size="sm" radius="round" className="mr-0" onClick={this.handleToggleRawViewer} {...btnProps}>View Raw Data</Button>,
      isRawViewerOpen // This lazy loads the raw viewer form only when isUploaderOpen is set to true
      && (
      <RawViewer
        key="b"
        isOpen={isRawViewerOpen}
        event={event}
        onToggleRawViewer={this.handleToggleRawViewer}
      />
      ),
    ]);
  }
}
