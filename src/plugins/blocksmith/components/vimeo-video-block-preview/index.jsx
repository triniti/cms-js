import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import Message from '@gdbots/pbj/Message';
import { BackgroundImage, Media } from '@triniti/admin-ui-plugin/components';
import damUrl from '@triniti/cms/plugins/dam/utils/damUrl';
import selector from './selector';
import './styles.scss';

class VimeoVideoBlockPreview extends React.Component {
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
      showVideo: false,
    };
    this.handleClickPosterImage = this.handleClickPosterImage.bind(this);
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

  render() {
    const {
      block,
      className,
      imageNode,
      width,
    } = this.props;

    const { showVideo } = this.state;
    const autoplay = (imageNode && showVideo) || block.get('autoplay');

    return (
      <div
        className={classNames('block-preview-video block-preview-vimeo-video', className)}
        role="presentation"
      >
        {
          imageNode && !showVideo && (
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
        {
          (!imageNode || showVideo) && (
            <iframe
              frameBorder="0"
              title="vimeo-video-block-preview"
              width={width}
              height={width / (16 / 9)}
              src={`https://player.vimeo.com/video/${block.get('id')}?autoplay=${autoplay}&loop=${block.get('loop')}&title=${block.get('show_title')}&byline=${block.get('show_byline')}&portrait=${block.get('show_portrait')}`}
              allowFullScreen
            />
          )
        }
        {
          block.has('title') && block.has('user_name') && block.has('user_id')
          && (
            <p>
              <a
                href={`https://vimeo.com/${block.get('id')}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {block.get('title')}
              </a>
              &nbsp;from&nbsp;
              <a
                href={`https://vimeo.com/${block.get('user_id')}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {block.get('user_name')}
              </a>
              &nbsp;on&nbsp;
              <a href="https://vimeo.com" target="_blank" rel="noopener noreferrer">Vimeo</a>
              .
            </p>
          )
        }
        {
          block.has('description')
          && <p>{block.get('description')}</p>
        }
      </div>
    );
  }
}

export default connect(selector)(VimeoVideoBlockPreview);
