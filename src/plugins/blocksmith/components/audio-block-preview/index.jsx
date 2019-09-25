import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import ReactPlayer from 'react-player';
import { connect } from 'react-redux';
import Message from '@gdbots/pbj/Message';
import { Icon } from '@triniti/admin-ui-plugin/components';
import damUrl from '@triniti/cms/plugins/dam/utils/damUrl';
import selector from './selector';
import './styles.scss';

const AudioBlockPreview = ({ className, audioNode, imageNode, block }) => (
  <div
    className={classNames('block-preview-audio', className)}
    role="presentation"
  >
    <img src={imageNode ? damUrl(imageNode, 'o', 'md') : ''} alt="thumbnail" />
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
  imageNode: PropTypes.instanceOf(Message),
};

AudioBlockPreview.defaultProps = {
  className: '',
  imageNode: null,
};

export default connect(selector)(AudioBlockPreview);
