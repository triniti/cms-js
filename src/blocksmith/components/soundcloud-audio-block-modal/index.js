import React, { useState } from 'react';
import { FormText } from 'reactstrap';
import { SwitchField, TextField, useFormContext } from '@triniti/cms/components/index.js';
import ImageAssetPickerField from '@triniti/cms/plugins/dam/components/image-asset-picker-field/index.js';
import withBlockModal from '@triniti/cms/blocksmith/components/with-block-modal/index.js';

const EMBED_PATTERN = /.*api\.soundcloud\.com\/tracks\/(\d+)&.*/;

function SoundcloudAudioBlockModal(props) {
  const { nodeRef: containerRef } = props.containerFormContext;
  const formContext = useFormContext();
  const [embed, setEmbed] = useState(null);
  const [embedError, setEmbedError] = useState(null);

  const handleChangeEmbed = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const value = event.target.value || '';
    setEmbed(value);

    if (!EMBED_PATTERN.test(value)) {
      setEmbedError('This value doesn\'t look like a SoundCloud Track Embed code.');
      return;
    }

    setEmbedError(null);
    const trackId = value.match(EMBED_PATTERN)[1] || undefined;

    const form = formContext.form;
    form.batch(() => {
      form.change('track_id', trackId);
      form.change('auto_play', value.includes('auto_play=true'));
      form.change('show_comments', value.includes('show_comments=true'));
      form.change('hide_related', value.includes('hide_related=true'));
      form.change('visual', value.includes('show_teaser=true'));
    });
  };

  return (
    <>
      <div className="form-group">
        <textarea
          className="form-control"
          rows={4}
          placeholder="Paste in a SoundCloud Track Embed Code"
          onChange={handleChangeEmbed}
        />
        {embed && embedError && <FormText color="danger">{embedError}</FormText>}
      </div>
      <TextField name="track_id" label="Soundcloud Track ID" required />
      <ImageAssetPickerField name="poster_image_ref" label="Poster Image" nodeRef={containerRef} />
      <SwitchField name="auto_play" label="Autoplay" />
      <SwitchField name="show_comments" label="Show Comments" />
      <SwitchField name="hide_related" label="Hide Related" />
      <SwitchField name="visual" label="Visual" />
    </>
  );
}

export default withBlockModal(SoundcloudAudioBlockModal);
