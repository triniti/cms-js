import React from 'react';
import { ModalBody } from 'reactstrap';
import { SwitchField, TextareaField } from '@triniti/cms/components';
import isValidUrl from '@gdbots/pbj/utils/isValidUrl';
import withBlockModal from '@triniti/cms/components/blocksmith-field/components/with-block-modal';
import Preview from '@triniti/cms/components/blocksmith-field/components/facebook-post-block-modal/Preview';
import MoreInfo from '@triniti/cms/components/blocksmith-field/components/more-info';

// supports list of valid Post Urls - https://developers.facebook.com/docs/plugins/oembed
const getFacebookPostUrl = (str) => {
  try {
    const regex = new RegExp('(?:(?:https?:)?\\/\\/)?(?:www\\.)?facebook\\.com\\/([^\\/]+\\/photo(\\.php|s|)(\\/|)|photo(\\.php|s|)(\\/|)|permalink\\.php(\\/|)|media\\/set(\\/|)|questions|notes|[^\\/]+\\/(activity|posts))[\\/?](set=|fbid=|[^\\/]+\\/[^\\/]+\\/|(?=.*\\bstory_fbid=\\b)(?=.*\\bid=\\b).+)?(?:[a-z0-9\\.]+\\/)?([0-9]+)\\/?(?:\\?.[^\\s"]*)?');
    const postUrlMatches = decodeURIComponent(str).match(regex);
    return postUrlMatches && isValidUrl(postUrlMatches[0]) ? postUrlMatches[0] : null;
  } catch (e) {
    // possible URIError ("malformed URI sequence") exception when used wrongly
    console.error('getFacebookPostUrl: ', e);
    return null;
  }
};

function FacebookPostBlockModal(props) {
  const { formState } = props;
  const { valid } = formState;

  return (
    <div className="modal-scrollable">
      <ModalBody>
        <TextareaField name="href" label="URL" placeholder="enter url or embed code" parse={getFacebookPostUrl} />
        <SwitchField name="show_text" label="Show Text" />
        <SwitchField name="aside" label="Aside" tooltip="Is only indirectly related to the main content." />
        {valid && <Preview {...props} />}
        <MoreInfo>
          See the <a href="https://developers.facebook.com/docs/plugins/embedded-posts/" target="_blank">Facebook embed post docs.</a>
        </MoreInfo>
      </ModalBody>
    </div>
  );
}

export default withBlockModal(FacebookPostBlockModal);
