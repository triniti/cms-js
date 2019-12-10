import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Message from '@gdbots/pbj/Message';

class ImgurPostBlockPreview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scriptLoaded: false,
    };

    this.handleLoadScript = this.handleLoadScript.bind(this);
  }

  handleLoadScript() {
    const newScriptTag = document.createElement('script');
    newScriptTag.id = 'globalImgurEmbedScriptTagId';
    newScriptTag.src = '//s.imgur.com/min/embed.js';
    newScriptTag.type = 'text/javascript';
    newScriptTag.async = true;

    document.querySelector('body').appendChild(newScriptTag);

    this.setState({ scriptLoaded: true });
  }

  handleBlockQuote(block) {
    return (
      <blockquote
        className="imgur-embed-pub"
        lang="en"
        data-id={`a/${block.get('id')}`}
        data-context={block.get('show_context')}
      />
    );
  }

  render() {
    const { scriptLoaded } = this.state;

    if (!scriptLoaded) {
      this.handleLoadScript();
    }

    const { block } = this.props;

    return this.handleLoadScript(block);
  }
}


ImgurPostBlockPreview.propTypes = {
  block: PropTypes.instanceOf(Message).isRequired,
};

export default ImgurPostBlockPreview;
