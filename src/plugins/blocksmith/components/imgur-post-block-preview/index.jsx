import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Message from '@gdbots/pbj/Message';
import Blockquote from './Blockquote';

const IMGUR_EMBED_SCRIPT_ID = 'imgur-embed-script';
class ImgurPostBlockPreview extends Component {
  constructor(props) {
    super(props);
    this.createEmbed = this.createEmbed.bind(this);
    this.loadScript = this.loadScript.bind(this);
  }

  loadScript() {
    const embedScript = document.getElementById(IMGUR_EMBED_SCRIPT_ID);

    if (embedScript && embedScript.parentElement) {
      embedScript.parentElement.removeChild(embedScript);
    }

    const newScriptTag = document.createElement('script');
    newScriptTag.id = IMGUR_EMBED_SCRIPT_ID;
    newScriptTag.src = 'https://s.imgur.com/min/embed.js';
    newScriptTag.type = 'text/javascript';
    newScriptTag.async = true;

    document.querySelector('body').appendChild(newScriptTag);
  }

  createEmbed() {
    const { block } = this.props;

    this.loadScript();

    return (
      <div>
        <Blockquote block={block} />
      </div>
    );
  }

  render() {
    return (
      this.createEmbed()
    );
  }
}

ImgurPostBlockPreview.propTypes = {
  block: PropTypes.instanceOf(Message).isRequired,
};

export default ImgurPostBlockPreview;
