import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Message from '@gdbots/pbj/Message';

class InstagramPostBlockPreview extends Component {
  constructor(props) {
    super(props);
    this.embedParentRef = React.createRef();
    this.clean = this.clean.bind(this);
    this.embed = this.embed.bind(this);
  }

  componentDidMount() {
    this.addInstagramEmbedScript();
    this.embed();
  }

  componentDidUpdate() {
    this.embed();
    if (window.instgrm) {
      window.instgrm.Embeds.process();
    }
  }

  componentWillUnmount() {
    this.clean();
  }

  addInstagramEmbedScript() {
    const script = document.createElement('script');
    script.async = true;
    script.src = '//www.instagram.com/embed.js';
    script.setAttribute('charset', 'utf-8');
    script.onload = () => {
      window.instgrm.Embeds.process();
    };
    this.embedParentRef.current.appendChild(script);
  }

  clean() {
    const { current } = this.embedParentRef;
    Array.from(current.children).forEach((child) => {
      if (child.className.indexOf('instagram-embed') === -1) {
        current.removeChild(child);
      }
    });
  }

  embed() {
    const { block } = this.props;
    this.clean();
    const instagramBlock = document.createElement('blockquote');
    instagramBlock.className = 'instagram-media';
    if (!block.get('hidecaption')) {
      instagramBlock.setAttribute('data-instgrm-captioned', '');
    }
    instagramBlock.setAttribute('data-instgrm-permalink', `//www.instagram.com/p/${block.get('id')}/`);
    this.embedParentRef.current.appendChild(instagramBlock);
  }

  render() {
    const { block } = this.props;
    return (
      <div id="instagram-preview">
        <a
          href={`//www.instagram.com/p/${block.get('id')}/`}
          target="_blank"
          className="instagram-preview__link"
          rel="noopener noreferrer"
        >
          View Post Preview
        </a>
        <div ref={this.embedParentRef} className="instagram-preview__iframe" />
      </div>
    );
  }
}

InstagramPostBlockPreview.propTypes = {
  block: PropTypes.instanceOf(Message).isRequired,
};

export default InstagramPostBlockPreview;
