import PropTypes from 'prop-types';
import React from 'react';
import { Button } from '@triniti/admin-ui-plugin/components';
import RevertModal from '@triniti/cms/plugins/pbjx/components/revert-modal';
import Message from '@gdbots/pbj/Message';

export default class RevertButton extends React.Component {
  static propTypes = {
    event: PropTypes.instanceOf(Message).isRequired,
    isDbValueSameAsNodeValue: PropTypes.func.isRequired,
    isFormDirty: PropTypes.bool.isRequired,
    onRevert: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      isModalOpen: false,
    };

    this.handleToggleRevertModal = this.handleToggleRevertModal.bind(this);
  }

  handleToggleRevertModal() {
    this.setState(({ isModalOpen }) => ({ isModalOpen: !isModalOpen }));
  }

  render() {
    const {
      event,
      isDbValueSameAsNodeValue,
      isFormDirty,
      onRevert: handleRevert,
      ...btnProps
    } = this.props;

    const { isModalOpen } = this.state;

    return ([
      <Button key="a" color="light" size="sm" radius="round" className="mr-2" onClick={this.handleToggleRevertModal} {...btnProps}>Revert</Button>,
      isModalOpen
      && (
      <RevertModal
        key="b"
        isDbValueSameAsNodeValue={isDbValueSameAsNodeValue}
        isFormDirty={isFormDirty}
        isOpen={isModalOpen}
        event={event}
        onRevert={handleRevert}
        onToggleRevertModal={this.handleToggleRevertModal}
      />
      ),
    ]);
  }
}
