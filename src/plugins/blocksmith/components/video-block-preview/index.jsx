import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import noop from 'lodash/noop';
import { connect } from 'react-redux';

import { BackgroundImage, Icon, Media } from '@triniti/admin-ui-plugin/components';
import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';
import Message from '@gdbots/pbj/Message';
import damUrl from '@triniti/cms/plugins/dam/utils/damUrl';

import selector from './selector';
import './styles.scss';

class VideoBlockPreview extends React.Component {
  static propTypes = {
    block: PropTypes.instanceOf(Message).isRequired,
    className: PropTypes.string,
    imageRef: PropTypes.instanceOf(NodeRef),
    showTitle: PropTypes.bool,
    videoNode: PropTypes.instanceOf(Message).isRequired,
    width: PropTypes.number.isRequired,
  };

  static defaultProps = {
    className: '',
    imageRef: null,
    showTitle: true,
  };

  constructor(props) {
    super(props);
    this.state = {
      showVideo: false,
    };
    this.handleClickPosterImage = this.handleClickPosterImage.bind(this);
  }

  /**
   * Displays and plays the video when user clicks the image
   */
  handleClickPosterImage() {
    this.setState({ showVideo: true });
  }

  render() {
    const {
      block,
      className,
      imageRef,
      showTitle,
      videoNode,
      width,
    } = this.props;

    const { showVideo } = this.state;
    const videoUrl = videoNode.get('kaltura_mp4_url');
    const autoplay = (imageRef && showVideo) || block.get('autoplay');

    if (this.video && videoUrl) {
      if (autoplay) {
        this.video.play();
      } else {
        this.video.pause();
      }
    }

    return (
      <div
        className={classNames('block-preview-video', className)}
        role="presentation"
      >
        { showTitle && <p className="title">{ videoNode.get('title') }</p> }
        {
          imageRef && !showVideo && (
            <>
              <Media
                aspectRatio="16by9"
                className="poster"
                onClick={videoUrl ? this.handleClickPosterImage : noop}
              >
                <BackgroundImage
                  imgSrc={`${damUrl(imageRef, '16by9', 'md')}`}
                  alt="video-thumbnail"
                />
              </Media>
              {(block.has('launch_text') || videoNode.has('launch_text'))
              && (
                <div className="launch-text">
                  <p>{block.get('launch_text') || videoNode.get('launch_text')}</p>
                  <Icon alert border imgSrc="video" size="xs" alt="video-icon" />
                </div>
              )}
            </>
          )
        }
        {
          (!imageRef || showVideo) && (
            <video
              autoPlay={autoplay}
              controls
              muted
              ref={(ref) => { this.video = ref; }}
              src={videoUrl}
              width={width}
              height={width / (16 / 9)}
            >
              Sorry, your browser does not support embedded videos.
            </video>
          )
        }
      </div>
    );
  }
}

export default connect(selector)(VideoBlockPreview);
