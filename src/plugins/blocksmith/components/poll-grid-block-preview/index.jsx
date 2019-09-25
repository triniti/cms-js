import PropTypes from 'prop-types';
import React from 'react';

import Message from '@gdbots/pbj/Message';
import PollBlockMixin from '@triniti/schemas/triniti/canvas/mixin/poll-block/PollBlockV1Mixin';

import PollBlockPreview from '../poll-block-preview';
import './styles.scss';

const PollGridBlockPreview = ({ className, block }) => (
  <div className={className}>
    {(block.get('node_refs') || []).map((nodeRef) => (
      <PollBlockPreview
        key={nodeRef}
        block={PollBlockMixin.findOne().createMessage().set('node_ref', nodeRef)}
      />
    ))}
  </div>
);

PollGridBlockPreview.propTypes = {
  className: PropTypes.string,
  block: PropTypes.instanceOf(Message).isRequired,
};

PollGridBlockPreview.defaultProps = {
  className: '',
};

export default PollGridBlockPreview;
