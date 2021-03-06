import React from 'react';
import PropTypes from 'prop-types';
import Message from '@gdbots/pbj/Message';
import { loadFacebookSDK } from '../../utils';

export default class FacebookPostBlockPreview extends React.Component {
  static propTypes = {
    block: PropTypes.instanceOf(Message).isRequired,
    width: PropTypes.number.isRequired,
  };

  constructor(props) {
    super(props);
    loadFacebookSDK();
  }

  render() {
    const { block, width } = this.props;

    setTimeout((t) => {
      if (window.FB) {
        window.FB.XFBML.parse(t.fbPost.parentNode);
      }
    }, 0, this);

    return (
      <div
        className="fb-post"
        data-href={block.get('href')}
        data-show-text={block.get('show_text') || true}
        data-width={width}
        ref={(ref) => { this.fbPost = ref; }}
      />
    );
  }
}
