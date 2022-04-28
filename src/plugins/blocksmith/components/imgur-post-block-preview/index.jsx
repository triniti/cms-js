import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Message from '@gdbots/pbj/Message';

class ImgurPostBlockPreview extends Component {
  constructor(props) {
    super(props);
    this.embedParentRef = React.createRef();
    this.clean = this.clean.bind(this);
    this.embed = this.embed.bind(this);
  }

  shouldComponentUpdate(nextProps) {
    const { block } = this.props;
    return block.get('id') !== nextProps.block.get('id');
  }

  componentDidMount() {
    this.embed();
  }

  componentDidUpdate() {
    this.embed();
  }

  componentWillUnmount() {
    this.clean();
  }

  clean() {
    Array.from(this.embedParentRef.current.children).forEach((child) => {
      this.embedParentRef.current.removeChild(child);
    });
  }

  embed() {
    const { block } = this.props;
    this.clean();
    const embedHtml = document.createElement('blockquote');
    embedHtml.classList.add('imgur-embed-pub');
    embedHtml.setAttribute('data-id', block.get('id'));
    embedHtml.setAttribute('lang', 'en');
    embedHtml.setAttribute('data-context', block.has('show_context') ? block.get('show_context').toString() : '');
    const embedScript = document.createElement('script');
    embedScript.async = true;
    embedScript.src = 'https://s.imgur.com/min/embed.js';
    embedScript.setAttribute('charset', 'utf-8');
    this.embedParentRef.current.appendChild(embedHtml);
    this.embedParentRef.current.appendChild(embedScript);
  }

  render() {
    return (
      <div ref={this.embedParentRef} />
    );
  }
}

ImgurPostBlockPreview.propTypes = {
  block: PropTypes.instanceOf(Message).isRequired,
};

export default ImgurPostBlockPreview;
