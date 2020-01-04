import { BackgroundImage, Media } from '@triniti/admin-ui-plugin/components';
import { connect } from 'react-redux';
import damUrl from '@triniti/cms/plugins/dam/utils/damUrl';
import Message from '@gdbots/pbj/Message';
import PropTypes from 'prop-types';
import React from 'react';
import selector from './selector';
import './styles.scss';

const EMBED_ROOT_ID = 'youtube-playlist-block-embed-root';

class YoutubePlaylistBlockPreview extends React.Component {
  static propTypes = {
    block: PropTypes.instanceOf(Message).isRequired,
    imageNode: PropTypes.instanceOf(Message),
    width: PropTypes.number.isRequired,
  };

  static defaultProps = {
    imageNode: null,
  };

  constructor(props) {
    super(props);
    const { block } = props;
    this.state = {
      showVideo: !block.has('poster_image_ref'),
    };
    this.embedParentRef = React.createRef();
    this.create = this.create.bind(this);
    this.handleClickPosterImage = this.handleClickPosterImage.bind(this);
    this.handleCue = this.handleCue.bind(this);
    this.handlePlay = this.handlePlay.bind(this);
  }

  componentDidMount() {
    if (window.YT) {
      this.create();
      return;
    }

    this.youtubeScript = document.createElement('script');
    this.youtubeScript.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(this.youtubeScript, firstScriptTag);

    this.originalOnYouTubeIframeAPIReady = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = this.create;
  }

  componentDidUpdate(prevProps) {
    const { block } = this.props;
    if (
      block.has('poster_image_ref')
      && (
        !prevProps.block.has('poster_image_ref')
        || prevProps.block.get('video_id') !== block.get('video_id')
        || prevProps.block.get('playlist_id') !== block.get('playlist_id')
      )
    ) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState(() => ({ showVideo: false }));
    }
  }

  componentWillUnmount() {
    if (this.youtubeScript) {
      this.youtubeScript.parentNode.removeChild(this.youtubeScript);
    }
    window.onYouTubeIframeAPIReady = this.originalOnYouTubeIframeAPIReady;
    if (this.player) {
      this.player.destroy();
    }
    Array.from(this.embedParentRef.current.children).forEach((child) => {
      this.embedParentRef.current.removeChild(child);
    });
  }

  create() {
    const { width } = this.props;
    const embedRoot = document.createElement('div');
    embedRoot.setAttribute('id', EMBED_ROOT_ID);
    this.embedParentRef.current.appendChild(embedRoot);
    this.player = new window.YT.Player(EMBED_ROOT_ID, {
      height: width / (16 / 9),
      width,
      events: {
        onReady: this.handleCue,
      },
    });
  }

  handleClickPosterImage() {
    this.setState(() => ({ showVideo: true }), this.handlePlay);
  }

  handleCue() {
    const { block } = this.props;
    const { showVideo } = this.state;

    if (!this.player || !showVideo) {
      return;
    }

    if (block.has('video_id')) {
      this.player.cueVideoById({ videoId: block.get('video_id') });
    } else {
      this.player.cuePlaylist({ list: block.get('playlist_id') });
    }

    if (block.get('autoplay')) {
      this.handlePlay();
    }
  }

  handlePlay() {
    const { block } = this.props;

    if (!block.has('video_id')) {
      this.player.nextVideo();
      return;
    }

    this.player.seekTo(0);
    // check if player is in "PAUSED" state ( https://developers.google.com/youtube/iframe_api_reference )
    if (this.player.getPlayerState() === 2) {
      this.player.playVideo();
    }
  }

  render() {
    const { imageNode, width } = this.props;
    const { showVideo } = this.state;

    this.handleCue();

    return (
      <div
        className="block-preview-video block-preview-youtube-playlist"
        role="presentation"
      >
        {imageNode && !showVideo && (
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
        )}
        <div ref={this.embedParentRef} />
      </div>
    );
  }
}

export default connect(selector)(YoutubePlaylistBlockPreview);
