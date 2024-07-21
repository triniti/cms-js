import React from 'react';
import { Card, CardBody, CardHeader } from 'reactstrap';
import {
  DatePickerField,
  SwitchField,
  TextareaField,
  TextField
} from '@triniti/cms/components/index.js';
import AdvertisingFields from '@triniti/cms/plugins/common/components/advertising-fields/index.js';
import TaggableFields from '@triniti/cms/plugins/common/components/taggable-fields/index.js';
import ImageAssetPickerField from '@triniti/cms/plugins/dam/components/image-asset-picker-field/index.js';
import SlugField from '@triniti/cms/plugins/ncr/components/slug-field/index.js';
import PicklistField from '@triniti/cms/plugins/sys/components/picklist-field/index.js';
import SponsorPickerField from '@triniti/cms/plugins/boost/components/sponsor-picker-field/index.js';
import TeaserPickerField from '@triniti/cms/plugins/curator/components/teaser-picker-field/index.js';
import VideoPickerField from '@triniti/cms/plugins/ovp/components/video-picker-field/index.js';
import SyndicationCard from '@triniti/cms/plugins/ovp/components/video-screen/SyndicationCard.js';
import parseYouTubeId from '@triniti/cms/utils/parseYouTubeId.js';

export default function DetailsTab(props) {
  const { node } = props;
  const schema = node.schema();

  return (
    <>
      <Card>
        <CardHeader>Details</CardHeader>
        <CardBody>
          <TextField name="title" label="Title" required />
          <SlugField />

          {schema.hasMixin('triniti:curator:mixin:teaserable') && (
            <DatePickerField name="order_date" label="Order Date" />
          )}

          {schema.hasMixin('gdbots:ncr:mixin:expirable') && (
            <DatePickerField name="expires_at" label="Expires At" />
          )}

          <TextareaField name="description" label="Description" rows={5} />
          <ImageAssetPickerField name="image_ref" label="Primary Image" />
          <ImageAssetPickerField name="poster_image_ref" label="Poster Image" />
          <TextField name="launch_text" label="Launch Text" />
          <PicklistField picklist="video-credits" name="credit" label="Credit" />

          {schema.hasMixin('triniti:common:mixin:swipeable') && (
            <PicklistField picklist="video-swipes" name="swipe" label="Swipe" />
          )}

          {schema.hasMixin('triniti:boost:mixin:sponsorable') && (
            <SponsorPickerField name="sponsor_ref" label="Sponsor" />
          )}

          {schema.hasMixin('triniti:common:mixin:themeable') && (
            <PicklistField picklist="video-themes" name="theme" label="Theme" />
          )}

          <SwitchField name="allow_comments" label="Allow Comments" />
          <SwitchField name="sharing_enabled" label="Sharing Enabled" />
        </CardBody>
      </Card>

      {schema.hasMixin('triniti:ovp.jwplayer:mixin:has-media') && (
        <Card>
          <CardHeader>JW Player</CardHeader>
          <CardBody>
            <SwitchField name="jwplayer_sync_enabled" label="JW Player Sync Enabled" />
            <TextField name="jwplayer_media_id" label="JW Player Media ID" />
            <DatePickerField name="jwplayer_synced_at" label="JW Player Synced At" readOnly />
          </CardBody>
        </Card>
      )}

      <Card>
        <CardHeader>YouTube</CardHeader>
        <CardBody>
          <TextField name="youtube_video_id" label="YouTube Video ID" parse={parseYouTubeId} placeholder="Paste in a YouTube URL or Video ID" />
          <TextField name="youtube_custom_id" label="YouTube Custom ID" />
        </CardBody>
      </Card>

      <SyndicationCard {...props} />

      <Card>
        <CardHeader>Related Videos</CardHeader>
        <CardBody>
          <SwitchField name="recommendations_enabled" label="Recommendations Enabled" />
          <SwitchField name="show_related_videos" label="Show Related Videos" />
          <TextField name="related_videos_heading" label="Related Videos Heading" />
          <VideoPickerField name="related_video_refs" label="Related Videos" isMulti sortable />
        </CardBody>
      </Card>

      {schema.hasMixin('triniti:curator:mixin:has-related-teasers') && (
        <Card>
          <CardHeader>Related Teasers</CardHeader>
          <CardBody>
            <TextField name="related_teasers_heading" label="Related Teasers Heading" />
            <TeaserPickerField name="related_teaser_refs" label="Related Teasers" isMulti />
          </CardBody>
        </Card>
      )}

      <AdvertisingFields />
      <TaggableFields />
    </>
  );
}
