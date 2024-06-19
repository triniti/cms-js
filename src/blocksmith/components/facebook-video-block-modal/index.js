import React from 'react';
import { ModalBody } from 'reactstrap';
import { SwitchField, TextareaField } from '@triniti/cms/components/index.js';
import withBlockModal from '@triniti/cms/blocksmith/components/with-block-modal/index.js';
import Preview from '@triniti/cms/blocksmith/components/facebook-video-block-modal/Preview.js';
import MoreInfo from '@triniti/cms/blocksmith/components/more-info/index.js';
import AssetPickerField from '@triniti/cms/plugins/dam/components/asset-picker-field/index.js';

const FB_VIDEO_REGEX = new RegExp('(?:(?:https?:)?\\/\\/)?(?:www\\.)?facebook\\.com\\/[a-zA-Z0-9\\.]+\\/videos\\/(?:[a-z0-9\\.]+\\/)?([0-9]+)\\/?(?:\\?.*)?');
const FB_VIDEO_AUTOPLAY_ATTR_REGEX = new RegExp('data-autoplay=".+?"');
const FB_VIDEO_SHOW_CAPTIONS_ATTR_REGEX = new RegExp('data-show-captions=".+?"');
const FB_VIDEO_SHOW_TEXT_ATTR_REGEX = new RegExp('data-show-text=".+?"');
const FB_VIDEO_SHOW_TEXT_QUERY_STRING_REGEX = new RegExp('show_text=.');
// i could not find examples of query strings for autoplay or show_captions.
// maybe they follow the same pattern, i dunno.

function FacebookVideoBlockModal(props) {
  const { form, formState } = props;
  const { valid } = formState;

  const handleHref = (input) => {
    let autoplay = false, href = null, showCaptions = false, showText = false;
    if (FB_VIDEO_REGEX.test(input)) {
      if (FB_VIDEO_AUTOPLAY_ATTR_REGEX.test(input)) {
        autoplay = input.match(FB_VIDEO_AUTOPLAY_ATTR_REGEX)[0].replace('data-autoplay="', '') === 'true"';
      }
      if (FB_VIDEO_SHOW_CAPTIONS_ATTR_REGEX.test(input)) {
        showCaptions = input.match(FB_VIDEO_SHOW_CAPTIONS_ATTR_REGEX)[0].replace('data-show-captions="', '') === 'true"';
      }
      if (FB_VIDEO_SHOW_TEXT_ATTR_REGEX.test(input)) {
        showText = input.match(FB_VIDEO_SHOW_TEXT_ATTR_REGEX)[0].replace('data-show-text="', '') === 'true"';
      }
      if (FB_VIDEO_SHOW_TEXT_QUERY_STRING_REGEX.test(input)) {
        showText = !!+input.match(FB_VIDEO_SHOW_TEXT_QUERY_STRING_REGEX)[0].replace('show_text=', '');
      }
      href = input.match(FB_VIDEO_REGEX)[0];
    }
    form.change('autoplay', autoplay);
    form.change('show_captions', showCaptions);
    form.change('show_text', showText);
    return href;
  }

  return (
    <div className="modal-scrollable">
      <ModalBody>
        <TextareaField name="href" label="URL" placeholder="enter url or embed code" parse={handleHref} />
        {valid && (<Preview {...props} width="526" />)}
        <AssetPickerField name="poster_image_ref" previewImage={false} />
        <SwitchField name="autoplay" label="Autoplay" />
        <SwitchField name="show_captions" label="Show Captions" />
        <SwitchField name="show_text" label="Show Text" />
        <SwitchField name="aside" label="Aside" tooltip="Is only indirectly related to the main content." />
        <MoreInfo>
          See the <a href="https://developers.facebook.com/docs/plugins/embedded-video-player" target="_blank">Facebook embed video docs.</a>
        </MoreInfo>
      </ModalBody>
    </div>
  );
}

export default withBlockModal(FacebookVideoBlockModal);
