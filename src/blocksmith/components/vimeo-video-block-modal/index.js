import React, { useState } from 'react';
import { FormText } from 'reactstrap';
import { SwitchField, TextareaField, TextField, useFormContext } from '@triniti/cms/components/index.js';
import ImageAssetPickerField from '@triniti/cms/plugins/dam/components/image-asset-picker-field/index.js';
import withBlockModal from '@triniti/cms/blocksmith/components/with-block-modal/index.js';

const VIDEO_PATTERN = /.*\/\/(player\.)?vimeo\.com\/(video\/)?(\d+).*/;
const USER_PATTERN = /.*\/\/vimeo\.com\/([\w\.-]+).*/;

function VimeoVideoBlockModal(props) {
  const { nodeRef: containerRef } = props.containerFormContext;
  const formContext = useFormContext();
  const [embed, setEmbed] = useState(null);
  const [embedError, setEmbedError] = useState(null);

  const handleChangeEmbed = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const value = event.target.value || '';
    setEmbed(value);

    if (!VIDEO_PATTERN.test(value)) {
      setEmbedError('This value doesn\'t look like a Vimeo URL or Embed code.');
      return;
    }

    setEmbedError(null);
    const id = value.match(VIDEO_PATTERN)[3] || undefined;

    let userId = null;
    const valueWithoutId = value.replaceAll(id, '');
    if (USER_PATTERN.test(valueWithoutId)) {
      userId = valueWithoutId.match(USER_PATTERN)[1] || undefined;
    }

    let title = null;
    let description = null;
    if (userId) {
      try {
        const parser = new DOMParser();
        const dom = parser.parseFromString(value, 'text/html');
        const p = dom.querySelector('p > a');
        title = p && p.innerHTML || null;

        const ps = dom.querySelectorAll('p');
        description = ps[1] && ps[1].innerHTML || null;
        if (description) {
          description = description.split('<br>')[0];
        }
      } catch (e) {
        console.error('VimeoVideoBlockModal.parseTitle', value, e);
      }
    }

    const form = formContext.form;
    form.batch(() => {
      form.change('id', id);
      form.change('user_id', userId);
      form.change('title', title);
      form.change('description', description);
      form.change('autoplay', value.includes('autoplay=1'));
      form.change('loop', value.includes('loop=1'));
      form.change('show_byline', !value.includes('byline=0'));
      form.change('show_portrait', !value.includes('portrait=0'));
      form.change('show_title', !value.includes('title=0'));
    });
  };

  return (
    <>
      <div className="form-group">
        <textarea
          className="form-control"
          rows={4}
          placeholder="Paste in a Vimeo URL or Embed Code"
          onChange={handleChangeEmbed}
        />
        {embed && embedError && <FormText color="danger">{embedError}</FormText>}
      </div>
      <TextField name="id" label="Vimeo Video ID" required />
      <ImageAssetPickerField name="poster_image_ref" label="Poster Image" nodeRef={containerRef} />
      <TextField name="title" label="Title" />
      <TextareaField name="description" label="Description" rows={2} />
      <TextField name="user_id" label="User ID" />
      {/*<TextField name="user_name" label="User Name" />*/}
      <SwitchField name="autoplay" label="Autoplay" />
      <SwitchField name="loop" label="Loop" />
      <SwitchField name="show_byline" label="Show Byline" />
      <SwitchField name="show_portrait" label="Show Portrait" />
      <SwitchField name="show_title" label="Show Title" />
    </>
  );
}

export default withBlockModal(VimeoVideoBlockModal);
