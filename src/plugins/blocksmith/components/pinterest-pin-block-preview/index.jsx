/* eslint-disable jsx-a11y/anchor-has-content, jsx-a11y/control-has-associated-label */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Message from '@gdbots/pbj/Message';

class PinterestPinBlockPreview extends Component {
  constructor(props) {
    super(props);
    this.embedParentRef = React.createRef();
    this.clean = this.clean.bind(this);
    this.embed = this.embed.bind(this);
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

    const embedHtml = document.createElement('a');
    embedHtml.setAttribute('data-pin-do', 'embedPin');
    embedHtml.setAttribute('data-pin-width', block.get('size'));
    embedHtml.href = block.get('href');

    if (block.get('terse')) {
      embedHtml.setAttribute('data-pin-terse', 'true');
    }

    const embedScript = document.createElement('script');
    embedScript.defer = true;
    embedScript.async = true;
    embedScript.src = 'https://assets.pinterest.com/js/pinit_main.js';
    this.embedParentRef.current.appendChild(embedHtml);
    this.embedParentRef.current.appendChild(embedScript);
  }

  render() {
    return (
      <div className="d-flex justify-content-center" ref={this.embedParentRef} />
    );
  }
}

PinterestPinBlockPreview.propTypes = {
  block: PropTypes.instanceOf(Message).isRequired,
};

export default PinterestPinBlockPreview;
