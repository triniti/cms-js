import React from 'react';
import PropTypes from 'prop-types';
import Message from '@gdbots/pbj/Message';
import { loadTwitterSDK } from '../../utils';

export default class TwitterTweetBlockPreview extends React.Component {
  static propTypes = {
    block: PropTypes.instanceOf(Message).isRequired,
  };

  constructor(props) {
    super(props);
    loadTwitterSDK();
  }

  render() {
    const { block } = this.props;

    setTimeout((t) => {
      // if you don't wipe out the contents of the preview div it will just keep appending them
      // eslint-disable-next-line no-param-reassign
      t.twitterPreview.innerHTML = '';
      if (window.twttr) {
        window.twttr.ready((twttr) => {
          twttr.widgets.createTweet(
            block.get('tweet_id'),
            t.twitterPreview,
            {
              cards: block.get('hide_media') ? 'hidden' : '',
              conversation: block.get('hide_thread') ? 'none' : '',
            },
          );
        });
      }
    }, 0, this);

    return (
      <div ref={(ref) => { this.twitterPreview = ref; }} />
    );
  }
}
