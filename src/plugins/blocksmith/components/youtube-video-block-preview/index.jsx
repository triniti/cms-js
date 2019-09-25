import React from 'react';
import PropTypes from 'prop-types';
import YouTube from 'react-youtube';
import classNames from 'classnames';
import { connect } from 'react-redux';
import Message from '@gdbots/pbj/Message';
import { BackgroundImage, Media } from '@triniti/admin-ui-plugin/components';
import damUrl from '@triniti/cms/plugins/dam/utils/damUrl';
import selector from './selector';
import './styles.scss';

class YoutubeVideoBlockPreview extends React.Component {
  static propTypes = {
    block: PropTypes.instanceOf(Message).isRequired,
    className: PropTypes.string,
    imageNode: PropTypes.instanceOf(Message),
    width: PropTypes.number.isRequired,
  };

  static defaultProps = {
    className: '',
    imageNode: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      isPlayerReady: false,
      showVideo: false,
      player: null,
    };
    this.handleClickPosterImage = this.handleClickPosterImage.bind(this);
    this.handleOnReady = this.handleOnReady.bind(this);
  }

  UNSAFE_componentWillReceiveProps({ imageNode }) {
    this.setState({ showVideo: !imageNode });
  }

  /**
   * Displays and plays the video when user clicks the image
   */
  handleClickPosterImage() {
    this.setState({ showVideo: true });
  }

  handleOnReady(event) {
    const player = event.target;
    this.setState({
      isPlayerReady: true,
      player,
    });
  }

  render() {
    const {
      block,
      className,
      imageNode,
      width,
    } = this.props;

    const { isPlayerReady, player, showVideo } = this.state;
    const autoplay = (imageNode && showVideo) || block.get('autoplay');

    if (player) {
      if (autoplay) {
        player.seekTo(block.get('start_at'));
        // check if player is in "PAUSED" state ( https://developers.google.com/youtube/iframe_api_reference )
        if (player.getPlayerState() === 2) {
          player.playVideo();
        }
      } else {
        player.cueVideoById(block.get('id'), block.get('start_at'));
      }
    }

    return (
      <div
        className={classNames('block-preview-video block-preview-youtube-video', className)}
        role="presentation"
      >
        {
          imageNode && !showVideo && isPlayerReady && (
            <Media
              aspectRatio="16by9"
              onClick={this.handleClickPosterImage}
              className="poster"
              style={{
                width: `${width}px`,
              }}
            >
              <BackgroundImage
                imgSrc={`${damUrl(imageNode)}`}
                alt="video-thumbnail"
              />
            </Media>
          )
        }
        <YouTube
          videoId={block.get('id')}
          onReady={this.handleOnReady}
          opts={{
            height: width / (16 / 9),
            width,
            playerVars: {
              autoplay,
              start: block.get('start_at'),
            },
          }}
        />
      </div>
    );
  }
}

export default connect(selector)(YoutubeVideoBlockPreview);
