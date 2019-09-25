import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';

import Message from '@gdbots/pbj/Message';
import { BackgroundImage, Media } from '@triniti/admin-ui-plugin/components';
import damUrl from '@triniti/cms/plugins/dam/utils/damUrl';
import { loadFacebookSDK } from '../../utils';
import selector from './selector';
import './styles.scss';

class FacebookVideoBlockPreview extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    block: PropTypes.instanceOf(Message).isRequired,
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
      showVideo: false,
    };
    loadFacebookSDK();
    this.handleClickPosterImage = this.handleClickPosterImage.bind(this);
  }

  UNSAFE_componentWillReceiveProps({ imageNode }) {
    this.setState({
      showVideo: !imageNode,
    });
  }

  /**
   * Displays and plays the video when user clicks the image
   */
  handleClickPosterImage() {
    this.setState({
      showVideo: true,
    });
  }

  render() {
    const {
      block,
      className,
      imageNode,
      width,
    } = this.props;

    const { showVideo } = this.state;
    const autoplay = (imageNode && showVideo) || block.get('autoplay');

    setTimeout((t) => {
      if (window.FB && t.fbVideo) {
        window.FB.XFBML.parse(t.fbVideo.parentNode);
      }
    }, 0, this);

    const height = width / (16 / 9);
    return (
      <div
        className={classNames('block-preview-facebook-video', className)}
        role="presentation"
      >
        {
          imageNode && !showVideo && (
            <Media
              aspectRatio="16by9"
              onClick={this.handleClickPosterImage}
              className="poster"
              style={{
                cursor: 'pointer',
                width: `${width}px`,
              }}
            >
              <BackgroundImage
                imgSrc={`${damUrl(imageNode, '16by9', 'md')}`}
                alt="video-thumbnail"
              />
            </Media>
          )
        }
        <div
          className="fb-video"
          data-width={width}
          data-height={height}
          data-href={block.get('href')}
          data-autoplay={autoplay}
          data-show-captions={block.get('show_captions') || true}
          data-show-text={block.get('show_text') || true}
          ref={(ref) => { this.fbVideo = ref; }}
          style={{
            width: `${width}px`,
            height: `${height}px`,
          }}
        />
      </div>
    );
  }
}

export default connect(selector)(FacebookVideoBlockPreview);
