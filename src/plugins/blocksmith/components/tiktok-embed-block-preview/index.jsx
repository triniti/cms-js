import React from 'react';
import PropTypes from 'prop-types';
import Message from '@gdbots/pbj/Message';

class TikTokBlockPreview extends React.Component {
  static propTypes = {
    block: PropTypes.instanceOf(Message).isRequired,
  }

  constructor(props) {
    super(props);
    this.embedParentRef = React.createRef();
    this.clean = this.clean.bind(this);
    this.embed = this.embed.bind(this);
  }

  shouldComponentUpdate(nextProps) {
    const { block } = this.props;
    
    return block.get('tiktok_id') !== nextProps.block.get('tiktok_id');
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
    embedHtml.classList.add('tiktok-embed');
    embedHtml.setAttribute('data-video-id', block.get('tiktok_id'));
    embedHtml.innerHTML = '<section></section>';
    const embedScript = document.createElement('script');
    embedScript.async = true;
    embedScript.src = 'https://www.tiktok.com/embed.js';
    this.embedParentRef.current.appendChild(embedHtml);
    this.embedParentRef.current.appendChild(embedScript);
  }

  render() {
    return (
      <div ref={this.embedParentRef} />
    );
  }
}

export default TikTokBlockPreview;
