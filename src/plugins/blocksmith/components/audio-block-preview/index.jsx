import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import ReactPlayer from 'react-player';
import { connect } from 'react-redux';
import Message from '@gdbots/pbj/Message';
import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';
import { Icon } from '@triniti/admin-ui-plugin/components';
import damUrl from '@triniti/cms/plugins/dam/utils/damUrl';
import selector from './selector';
import './styles.scss';


const AudioBlockPreview = ({ className, audioNode, imageRef, block }) => (
  <div
    className={classNames('block-preview-audio', className)}
    role="presentation"
  >
    {
      imageRef
      && <img src={damUrl(imageRef, 'o', 'md')} alt="thumbnail" />
    }
    <div className="player-text-wrapper">
      <ReactPlayer
        className="react-player"
        controls
        height="calc(4em + 2px)"
        url={`${damUrl(audioNode)}`}
        width="100%"
      />
      {
        block.has('launch_text')
        && (
          <div className="launch-text">
            <p>{block.get('launch_text')}</p>
            <Icon alert border imgSrc="audio" size="xs" alt="audio-icon" />
          </div>
        )
      }
    </div>
  </div>
);

AudioBlockPreview.propTypes = {
  audioNode: PropTypes.instanceOf(Message).isRequired,
  block: PropTypes.instanceOf(Message).isRequired,
  className: PropTypes.string,
  imageRef: PropTypes.instanceOf(NodeRef),
};

AudioBlockPreview.defaultProps = {
  className: '',
  imageRef: null,
};

export default connect(selector)(AudioBlockPreview);
