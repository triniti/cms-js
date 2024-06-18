import React from 'react';
import { Card, CardBody, CardHeader, Dropdown } from 'reactstrap';
import SlugField from '@triniti/cms/plugins/ncr/components/slug-field/index.js';
import { CheckboxField, DatePickerField, KeyValuesField, SwitchField, TextareaField, TextField } from '@triniti/cms/components/index.js';
import AdvertisingFields from '@triniti/cms/plugins/common/components/advertising-fields/index.js';
import ImagePickerField from '@triniti/cms/plugins/dam/components/image-picker-field/index.js';
import TaggableFields from '@triniti/cms/plugins/common/components/taggable-fields/index.js';
import PicklistField from '@triniti/cms/plugins/sys/components/picklist-field/index.js';
import SponsorPickerField from '@triniti/cms/plugins/boost/components/sponsor-picker-field/index.js';
import TranscodeableCard from '@triniti/cms/plugins/ovp/components/video-screen/TranscodeableCard.js';

export default function DetailsTab(props) {
  const { nodeRef, node } = props;
  const schema = node.schema();

  return (
    <>
      <Card>
        <CardHeader>
          Details
        </CardHeader>
        <CardBody>
          <TextField name="title" label="Title" required />
          <SlugField nodeRef={nodeRef} withDatedSlug />

          {schema.hasMixin('triniti:curator:mixin:teaserable') && (
            <DatePickerField name="order_date" label="Order Date" />
          )}

          {schema.hasMixin('gdbots:ncr:mixin:expirable') && (
            <DatePickerField name="expires_At" label="Expires At" />
          )}

          <TextareaField name="description" label="Description" placeholder="enter description" />
          <ImagePickerField name="image_ref" label="Primary Image" nodeRef={nodeRef} />
          <TextField name="launchText" label="Launch Text" placeholder="enter launch text" />
          <PicklistField picklist="video-credits" name="credit" label="Credit" />
          {schema.hasMixin('triniti:common:mixin:swipeable') && <PicklistField picklist="video-swipes" name="swipe" label="Swipe" /> }

          <KeyValuesField name="caption_urls" label="Caption URLs" component={TextField} selectKeyProps={{options: [{value: 'en', label: 'en'}, {value: 'es', label: 'es'}, {value: 'fr', label: 'fr'}]}} />

          <TextField label="Mezzanine URL" name="mezzanineUrl" placeholder="mezzanine url" />
          {!schema.hasMixin('triniti:ovp.medialive:mixin:has-channel') && <TextField name="live_m3u8_url" label="Live M3U8 URL" />}
          <DatePickerField label="Original Air Date" name="originalAirDate" />
          <div className="pb-1 d-flex">
            <CheckboxField
              name="isLive"
              label="Is Live"
              className="flex-fill"
            />
            <CheckboxField
              label="Allow Comments"
              name="allowComments"
              className="flex-fill"
            />
            <CheckboxField
              label="Sharing Enabled"
              name="sharingEnabled"
              className="flex-fill"
            />
            <CheckboxField
              label="Is Full Episode"
              name="isFullEpisode"
              className="flex-fill"
            />
            <CheckboxField
              label="Is Promo"
              name="isPromo"
              className="flex-fill"
            />
            <CheckboxField
              label="Xumo Enabled"
              name="xumoEnabled"
              className="flex-fill"
            />
          </div>

          {schema.hasMixin('triniti:boost:mixin:sponsorable') && <SponsorPickerField label="Sponsor" name="sponsor_refs" />}

        </CardBody>
      </Card>

      {schema.hasMixin('triniti:ovp:mixin:transcodeable') && (
       <TranscodeableCard node={node} />
      )}

      <Card>
        <CardHeader>Related Videos</CardHeader>
        <CardBody>
          <SwitchField name="show_related_videos" label="Show Related Videos" />
          <TextField name="related_videos_heading" label="Related Videos Heading" />
        </CardBody>
      </Card>
      {schema.hasMixin('triniti:curator:mixin:has-related-teasers') && (
        <Card>
          <CardHeader>Related Teasers</CardHeader>
          <CardBody>
            <TextField name="related_teasers_heading" label="Related Teasers Heading" />
          </CardBody>
        </Card>
      )}
      <AdvertisingFields />
      <TaggableFields />
    </>
  );
}
