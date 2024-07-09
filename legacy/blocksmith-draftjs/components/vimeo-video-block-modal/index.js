import React from 'react';
import { ModalBody } from 'reactstrap';
import { SwitchField, TextareaField, TextField } from '@triniti/cms/components/index.js';
import withBlockModal from '@triniti/cms/blocksmith/components/with-block-modal/index.js';
import Preview from '@triniti/cms/blocksmith/components/vimeo-video-block-modal/Preview.js';
import ImageAssetPickerField from '@triniti/cms/plugins/dam/components/image-asset-picker-field/index.js';
import he from 'he';

const EMBED_REGEX = /https?:\/\/player\.vimeo\.com\/video\/\d+/;
const URL_REGEX = /^https?:\/\/vimeo\.com\/\d+$/;
const AUTOPLAY_QUERY_STRING_REGEX = /(\?|&)autoplay=(true|false|1|0)/;
const LOOP_QUERY_STRING_REGEX = /(\?|&)loop=(true|false|1|0)/;
const BYLINE_QUERY_STRING_REGEX = /(\?|&)byline=(0|false)/;
const TITLE_QUERY_STRING_REGEX = /(\?|&)title=(0|false)/;
const PORTRAIT_QUERY_STRING_REGEX = /(\?|&)portrait=(0|false)/;
const USER_REGEX = /from\s<a\shref="https?:\/\/vimeo\.com\/.+">.+<\/a>\son/;
const snippetRegex = (id) => new RegExp(`<p><a\\shref="https?:\\/\\/vimeo.com\\/${id}">.+<a\\shref="https?:\\/\\/vimeo.com">Vimeo<\\/a>\\.<\\/p>`);
const titleRegex = (id) => new RegExp(`<p><a\\shref="https?:\\/\\/vimeo.com\\/${id}">.+?<\\/a>`);

const findTitle = (input, id) => input.match(titleRegex(id))[0]
  .replace(`<p><a href="https://vimeo.com/${id}">`, '')
  .replace('</a>', '');

const findUserName = (input) => input.match(USER_REGEX)[0]
  .replace(/from\s<a\shref="https?:\/\/vimeo\.com\/.+">/, '')
  .replace('</a> on', '');

const findUserId = (input, id) => input.match(USER_REGEX)[0]
  .replace(/from\s<a\shref="https?:\/\/vimeo\.com\//, '')
  .replace(`">${id}</a> on`, '');

function VimeoVideoBlockModal(props) {
  const { form, formState } = props;
  const { valid } = formState;
  const { id } = formState.values;

  const parseVimeoInput = (input) => {
    let description = '', title = '', userName = '', userId = '';
    let id = input;

    form.change('autoplay', false);
    form.change('loop', false);
    form.change('show_byline', false);
    form.change('show_title', false);
    form.change('show_portrait', false);

    if (URL_REGEX.test(input)) {
      id = input.match(URL_REGEX)[0].replace(/https?:\/\/vimeo\.com\//, '');
      form.change('show_byline', true);
      form.change('show_title', true);
      form.change('show_portrait', true);
    } else if (EMBED_REGEX.test(input)) {
      id = input.match(EMBED_REGEX)[0].replace(/https?:\/\/player\.vimeo\.com\/video\//, '');
      if (AUTOPLAY_QUERY_STRING_REGEX.test(input)) {
        form.change('autoplay', !!input.match(AUTOPLAY_QUERY_STRING_REGEX)[0].match(/(true|1)/));
      }
      if (LOOP_QUERY_STRING_REGEX.test(input)) {
        form.change('loop', !!input.match(LOOP_QUERY_STRING_REGEX)[0].match(/(true|1)/));
      }
      form.change('show_byline', !BYLINE_QUERY_STRING_REGEX.test(input));
      form.change('show_title', !TITLE_QUERY_STRING_REGEX.test(input));
      form.change('show_portrait', !PORTRAIT_QUERY_STRING_REGEX.test(input));
      const numberOfPTags = /<\/p>/g.test(input) ? input.match(/<\/p>/g).length : null;
      switch (numberOfPTags) {
        case 1: // title or description
          if (snippetRegex(id).test(input)) {
            title = findTitle(input, id);
            userName = findUserName(input);
            userId = findUserId(input, userName);
          } else {
            description = input.match(/<p>(.|\n)+<\/p>/)[0]
              .replace(/(?:<br\s\/>\n?)+\s+/g, ' ')
              .replace(/<\/?p>/g, '');
          }
          break;
        case 2: // title and description
          title = findTitle(input, id);
          userName = findUserName(input);
          userId = findUserId(input, userName);
          description = input.split('</p>\n<p>')[1]
            .replace(/(?:<br\s\/>\n?)+\s+/g, ' ')
            .replace('</p>', '');
          break;
        default:
          break;
      }
    }

    form.change('title', title);
    form.change('user_name', userName);
    form.change('user_id', userId);
    form.change('description', he.decode(description));
    return id;
  }

  return (
    <div className="modal-scrollable">
      <ModalBody>
        <TextareaField name="id" label="Track Id" placeholder="enter url or embed code" parse={parseVimeoInput} required />
        <TextField name="title" style={{ display: 'none' }} />
        <TextField name="user_id" style={{ display: 'none' }} />
        <TextField name="user_name" style={{ display: 'none' }} />
        <TextField name="description" style={{ display: 'none' }} />
        {valid && <Preview {...props} />}
        {valid && id && <ImageAssetPickerField name="poster_image_ref" previewImage={false} />}
        <SwitchField name="autoplay" label="Autoplay" />
        <SwitchField name="loop" label="Loop" />
        <SwitchField name="show_byline" label="Show Byline in Overlay" />
        <SwitchField name="show_portrait" label="Show Portrait in Overlay" />
        <SwitchField name="show_title" label="Show Title in Overlay" />
        <SwitchField name="aside" label="Aside" tooltip="Is only indirectly related to the main content." />
      </ModalBody>
    </div>
  );
}

export default withBlockModal(VimeoVideoBlockModal);
