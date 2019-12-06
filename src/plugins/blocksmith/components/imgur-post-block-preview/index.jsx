import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Message from '@gdbots/pbj/Message';

class ImgurPostBlockPreview extends Component {
  constructor(props) {
    super(props);
    this.id = this.props.block.get('id');
  }

  componentDidMount() {
    const script = document.getElementById('imgur-post-embed');
    
    if (script) {
      document.querySelector('body').removeChild(script);
    } else {
      var newScriptTag = document.createElement('script');
      newScriptTag.id = 'imgur-post-embed';
      newScriptTag.src = "//s.imgur.com/min/embed.js";
      newScriptTag.type = "text/javascript";
      newScriptTag.async = true;
      document.querySelector('body').appendChild(newScriptTag);
    }
  }

  render() {
    return (
      <blockquote className="imgur-embed-pub" lang="en" data-id={this.id}><a href={`//imgur.com/${this.id}`}>Where are the kids?</a></blockquote>
    );
  }
}

ImgurPostBlockPreview.propTypes = {
  block: PropTypes.instanceOf(Message).isRequired,
};

export default ImgurPostBlockPreview;
