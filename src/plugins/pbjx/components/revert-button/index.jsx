import PropTypes from 'prop-types';
import React from 'react';
import { Button } from '@triniti/admin-ui-plugin/components';
import RevertViewer from '@triniti/cms/plugins/pbjx/components/revert-view-modal';
import Message from '@gdbots/pbj/Message';

export default class RevertButton extends React.Component {
  static propTypes = {
    event: PropTypes.instanceOf(Message).isRequired,
    formName: PropTypes.string.isRequired,
    onRevert: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      isRevertOpen: false,
    };

    this.handleToggleRevertViewer = this.handleToggleRevertViewer.bind(this);
  }

  handleToggleRevertViewer() {
    this.setState(({ isRevertOpen }) => ({ isRevertOpen: !isRevertOpen }));
  }

  render() {
    const {
      event,
      formName,
      onRevert: handleRevert,
      ...btnProps
    } = this.props;

    const { isRevertOpen } = this.state;

    return ([
      <Button key="a" color="light" size="sm" radius="round" className="mr-2" onClick={this.handleToggleRevertViewer} {...btnProps}>Revert</Button>,
      isRevertOpen // This lazy loads the raw viewer form only when isRawViewerOpen is set to true
      && (
      <RevertViewer
        key="b"
        isOpen={isRevertOpen}
        event={event}
        formName={formName}
        onRevert={handleRevert}
        onToggleRevertViewer={this.handleToggleRevertViewer}
      />
      ),
    ]);
  }
}
