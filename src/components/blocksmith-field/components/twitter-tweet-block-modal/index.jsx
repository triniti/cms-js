import React, { useState } from 'react';
import { FormGroup, ModalBody } from 'reactstrap';
import { TextField, SwitchField, TextareaField } from 'components';
import withBlockModal from 'components/blocksmith-field/components/with-block-modal';
import getTwitterTweetFields from 'components/blocksmith-field/components/twitter-tweet-block-modal/getTwitterTweetFields';
import TwitterTweetPreview from 'components/blocksmith-field/components/twitter-tweet-block-modal/TwitterTweetPreview';
import changedDate from '../../utils/changedDate';
import changedTime from '../../utils/changedTime';
import DateTimePicker from 'components/blocksmith-field/components/date-time-picker';


function TwitterTweetEmbedBlockModal({ block, form, formState }) {
  const { valid } = formState;
  const [ url, setUrl ] = useState( block.has('tweet_id') && block.has('screen_name') ? `https://twitter.com/${block.get('screen_name')}/status/${block.get('tweet_id')}` : '');
  const [ hasUpdatedDate, setHasUpdatedDate ] = useState(block.has('updated_date'));
  const [ updatedDate, setUpdatedDate ] = useState(block.get('updated_date', new Date()));

  const handleChangeTextarea = (event) => {
    const { screenName, tweetId } = getTwitterTweetFields(event.target.value);
    if (tweetId) {
      form.change('screen_name', screenName);
      form.change('tweet_id', tweetId);
      setUrl(`https://twitter.com/${screenName}/status/${tweetId}`);
    }
  }

  const {
    hide_media: hideMedia,
    hide_thread: hideThread,
    tweet_id: tweetId
  } = formState.values;

  return (
    <div className="modal-scrollable">
      <ModalBody>
        <TextField name="screen_name" style={{ display: 'none' }} />
        <TextField name="tweet_id" style={{ display: 'none' }} />
        <TextareaField name="tweet_url" label="Embed Code" placeholder="enter embed code" onChange={handleChangeTextarea} value={url} />
        <SwitchField name="hide_media" label="Hide Media" />
        <SwitchField name="hide_thread" label="Hide Thread" />
        <FormGroup className="mb-4">
          <SwitchField
            name="hasUpdatedDate"
            label="Is Update"
            checked={hasUpdatedDate}
            onChange={(e) => setHasUpdatedDate(e.target.checked)}
            />
          {hasUpdatedDate
            && (
              <DateTimePicker
                name="updated_date"
                onChangeDate={date => setUpdatedDate(changedDate(date).updatedDate)}
                onChangeTime={({ target: { value: time } }) => setUpdatedDate(changedTime(time).updatedDate)}
                updatedDate={updatedDate}
              />
            )}
        </FormGroup>
        <SwitchField name="aside" label="Aside" />
      </ModalBody>
      { valid && <TwitterTweetPreview tweetId={tweetId} hideMedia={hideMedia} hideThread={hideThread} /> }
    </div>
  );
}

export default withBlockModal(TwitterTweetEmbedBlockModal);
