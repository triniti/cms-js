import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Message from '@gdbots/pbj/Message';

export default class InstagramPostBlockPreview extends Component {
  static propTypes = {
    block: PropTypes.instanceOf(Message).isRequired,
  };

  constructor(props) {
    super(props);
    this.embedParentRef = React.createRef();
    this.clean = this.clean.bind(this);
    this.embed = this.embed.bind(this);
    this.state = {
      instagramID: '',
      hideCaption: false,
    }
  }

  componentDidMount() {
    const { block } = this.props;
    this.setState({
      instagramID: block.get('id'),
      hideCaption: block.get('hidecaption'),
    }, () => {
      const script = document.createElement('script');
      script.async = true;
      script.src = '//www.instagram.com/embed.js';
      script.setAttribute('charset', 'utf-8');
      script.onload = () => {
        instgrm.Embeds.process();
      }
      this.embedParentRef.current.appendChild(script);
      this.embed();
    })
  }

  componentDidUpdate() {
    const { block } = this.props;
    const { instagramID, hideCaption } = this.state;

    if (block.get('id') !== instagramID || block.get('hidecaption') !== hideCaption) { 
      this.setState({
        instagramID: block.get('id'),
        hideCaption: block.get('hidecaption'),
      }, () => {
        this.embed();
        instgrm.Embeds.process();
      })
    }
  }

  componentWillUnmount() {
    this.clean();
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
    instagramBlock.setAttribute('data-instgrm-captioned', block.get('hidecaption'));
    instagramBlock.setAttribute('data-instgrm-permalink', `//www.instagram.com/p/${block.get('id')}/`);
    this.embedParentRef.current.appendChild(instagramBlock);
  }

  render() {
    return (<div id='instagram-preview'>
      <a href={`//www.instagram.com/p/${this.props.block.get('id')}/`}
      target="_blank" 
      className='instagram-link' 
      rel='noopener noreferrer'>View Post Preview</a>
      <div ref={this.embedParentRef} className="instagram-preview__iframe"></div>
    </div>);
  }
}
