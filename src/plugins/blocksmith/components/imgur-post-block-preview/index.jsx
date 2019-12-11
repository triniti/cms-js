import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Message from '@gdbots/pbj/Message';
import ImgurPostBlockEmbed from './embed';

class ImgurPostBlockPreview extends Component {
  constructor(props) {
    super(props);
    this.createEmbed = this.createEmbed.bind(this);
    this.loadScript = this.loadScript.bind(this);
  }

  loadScript() {
    const embedScript = document.getElementById('globalImgurEmbedScriptTagId');

    if (embedScript) {
      // eslint-disable-next-line no-unused-expressions
      (embedScript.parentElement) ? embedScript.parentElement.removeChild(embedScript) : null;
    }

    const newScriptTag = document.createElement('script');
    newScriptTag.id = 'globalImgurEmbedScriptTagId';
    newScriptTag.src = '//s.imgur.com/min/embed.js';
    newScriptTag.type = 'text/javascript';
    newScriptTag.async = true;

    document.querySelector('body').appendChild(newScriptTag);
  }

  createEmbed() {
    const { block } = this.props;

    this.loadScript();

    return (
      <div id="imgur-post-emebed-container">
        <ImgurPostBlockEmbed block={block} />
      </div>
    );
  }

  render() {
    this.loadScript();

    return (
      this.createEmbed()
    );
  }
}

ImgurPostBlockPreview.propTypes = {
  block: PropTypes.instanceOf(Message).isRequired,
};

export default ImgurPostBlockPreview;
