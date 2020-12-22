import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Message from '@gdbots/pbj/Message';
import './styles.scss';

class InstagramMediaBlockPreview extends Component {
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

  componentDidUpdate({ block: prevBlock }) {
    const { block } = this.props;
    if (
      block.get('id') !== prevBlock.get('id')
      || block.get('hidecaption') !== prevBlock.get('hidecaption')
    ) {
      this.embed();
      window.instgrm.Embeds.process();
    }
  }

  componentWillUnmount() {
    this.clean();
  }

  addInstagramEmbedScript() {
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.instagram.com/embed.js';
    script.onload = () => {
      window.instgrm.Embeds.process();
    };
    this.embedParentRef.current.appendChild(script);
  }

  clean() {
    const { current } = this.embedParentRef;
    Array.from(current.children).forEach((child) => {
      current.removeChild(child);
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
    instagramBlock.setAttribute('data-instgrm-permalink', `https://www.instagram.com/p/${block.get('id')}/`);
    this.embedParentRef.current.appendChild(instagramBlock);
  }

  render() {
    const { block } = this.props;
    return (
      <div id="instagram-preview">
        <header className="instagram-preview__header">
          Link to post:&nbsp;
          <a
            href={`https://www.instagram.com/p/${block.get('id')}/`}
            target="_blank"
            className="instagram-preview__link"
            rel="noopener noreferrer"
          >
            {`https://www.instagram.com/p/${block.get('id')}/`}
          </a>
        </header>
        <div ref={this.embedParentRef} className="instagram-preview__iframe" />
      </div>
    );
  }
}

InstagramMediaBlockPreview.propTypes = {
  block: PropTypes.instanceOf(Message).isRequired,
};

export default InstagramMediaBlockPreview;
