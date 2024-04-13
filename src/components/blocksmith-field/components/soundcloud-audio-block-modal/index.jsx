import React from 'react';
import { ModalBody } from 'reactstrap';
import { SwitchField, TextareaField } from '@triniti/cms/components';
import withBlockModal from '@triniti/cms/components/blocksmith-field/components/with-block-modal';
import ImagePickerField from '@triniti/cms/plugins/dam/components/image-picker-field';
import Preview from './Preview';

const TRACK_ID_REGEX = /api\.soundcloud\.com\/tracks\/\d+/;
const AUTOPLAY_QUERY_STRING_REGEX = /(\?|&)auto_play=(true|false)/;
const HIDE_RELATED_QUERY_STRING_REGEX = /(\?|&)hide_related=(true|false)/;
const SHOW_COMMENTS_QUERY_STRING_REGEX = /(\?|&)show_comments=(true|false)/;
const VISUAL_QUERY_STRING_REGEX = /(\?|&)visual=(true|false)/;

function SoundcloudAudioBlockModal(props) {
  const { form, formState } = props;
  const { valid, values } = formState;
  const { poster_image_ref: posterImageRef } = values;

  const parseTrackId = (input) => {
    if (TRACK_ID_REGEX.test(input)) {
      const trackId = input.match(TRACK_ID_REGEX)[0].replace('api.soundcloud.com/tracks/', '');
      if (AUTOPLAY_QUERY_STRING_REGEX.test(input)) {
        form.change('auto_play', input.match(AUTOPLAY_QUERY_STRING_REGEX)[0].includes('true'));
      }
      if (HIDE_RELATED_QUERY_STRING_REGEX.test(input)) {
        form.change('hide_related', input.match(HIDE_RELATED_QUERY_STRING_REGEX)[0].includes('true'));
      }
      if (SHOW_COMMENTS_QUERY_STRING_REGEX.test(input)) {
        form.change('show_comments', input.match(SHOW_COMMENTS_QUERY_STRING_REGEX)[0].includes('true'));
      }
      if (VISUAL_QUERY_STRING_REGEX.test(input)) {
        form.change('visual', input.match(VISUAL_QUERY_STRING_REGEX)[0].includes('true'));
      }
      return trackId;
    }
    return input;
  }

  return (
    <div className="modal-scrollable">
      <ModalBody>
        <TextareaField
          name="track_id"
          label="Track ID"
          placeholder="enter embed code"
          parse={parseTrackId}
          required
        />
        {valid && <Preview {...props} />}
        <ImagePickerField name="poster_image_ref" previewImage={false} />
        <SwitchField name="auto_play" label="Autoplay" disabled={!!posterImageRef} />
        <SwitchField name="visual" label="Visual Overlay" />
        <SwitchField name="hide_related" label="Hide Related" />
        <SwitchField name="show_comments" label="Show Comments" />
        <SwitchField name="aside" label="Aside" tooltip="Is only indirectly related to the main content." />
      </ModalBody>
    </div>
  );
}

export default withBlockModal(SoundcloudAudioBlockModal);
