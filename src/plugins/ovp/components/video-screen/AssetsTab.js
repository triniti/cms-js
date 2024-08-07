import React, { lazy, Suspense } from 'react';
import {
  ErrorBoundary,
  KeyValuesField,
  Loading,
  NumberField,
  SwitchField,
  TextField,
  UrlField
} from '@triniti/cms/components/index.js';
import { Card, CardBody, CardHeader } from 'reactstrap';
import AudioAssetPickerField from '@triniti/cms/plugins/dam/components/audio-asset-picker-field/index.js';
import CaptionAssetPickerField from '@triniti/cms/plugins/dam/components/caption-asset-picker-field/index.js';
import MezzanineCard from '@triniti/cms/plugins/ovp/components/video-screen/MezzanineCard.js';
import videoLanguages from '@triniti/app/config/videoLanguages.js';

const LinkedAssetsCard = lazy(() => import('@triniti/cms/plugins/dam/components/linked-assets-card/index.js'));

export default function AssetsTab(props) {
  const { tab, nodeRef, node } = props;
  if (tab !== 'assets') {
    return null;
  }

  const schema = node.schema();

  return (
    <>
      <Card>
        <CardHeader>Sources</CardHeader>
        <CardBody>
          <NumberField name="duration" label="Duration" description="Length of the video in seconds." />
          <KeyValuesField name="source_urls" label="Source URLs" component={UrlField} />
          <SwitchField name="is_live" label="Is Live Stream" />
          <UrlField name="live_m3u8_url" label="Live M3U8 URL" />
          {schema.hasMixin('triniti:ovp.medialive:mixin:has-channel') && (
            <TextField name="medialive_channel_arn" label="MediaLive Channel ARN" />
          )}
        </CardBody>
      </Card>

      <MezzanineCard {...props} />

      <Card>
        <CardHeader>Captions</CardHeader>
        <CardBody>
          <AudioAssetPickerField name="audio_ref" label="Audio Asset" />
          <CaptionAssetPickerField name="caption_ref" label="Caption Asset" />
          <KeyValuesField
            name="caption_urls"
            label="Caption URLs"
            component={UrlField}
            selectKeyProps={{ options: videoLanguages }}
          />
        </CardBody>
      </Card>

      <Suspense fallback={<Loading />}>
        <ErrorBoundary>
          <LinkedAssetsCard linkedRef={nodeRef} />
        </ErrorBoundary>
      </Suspense>
    </>
  );
}
