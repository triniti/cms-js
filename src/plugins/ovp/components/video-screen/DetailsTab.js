import React from 'react';
import { Card, CardBody, CardHeader } from 'reactstrap';
import SlugField from '@triniti/cms/plugins/ncr/components/slug-field/index.js';
import { DatePickerField, SwitchField, TextareaField, TextField } from '@triniti/cms/components/index.js';
import AdvertisingFields from '@triniti/cms/plugins/common/components/advertising-fields/index.js';
import ImagePickerField from '@triniti/cms/plugins/dam/components/image-picker-field/index.js';
import TaggableFields from '@triniti/cms/plugins/common/components/taggable-fields/index.js';
import PicklistField from '@triniti/cms/plugins/sys/components/picklist-field/index.js';
import useNode from '@triniti/cms/plugins/ncr/components/useNode.js';

export default function DetailsTab(props) {
  const { nodeRef, node } = props;
  const schema = node.schema();

  const { node: mezzanineNode } = useNode(node.get('mezzanine_ref'), false);
  const mezzanineNodeStatus = mezzanineNode && mezzanineNode.has('transcoding_status') ? mezzanineNode.get('transcoding_status').getValue() : 'unknown';

  return (
    <>
      <Card>
        {
          mezzanineNode && mezzanineNode.schema().hasMixin('triniti:ovp:mixin:transcodeable') ?
          <CardHeader>
            Details
            <div>
              <small className="text-uppercase status-copy mr-0 pr-0">
                Transcoding Status:
              </small>
              <small className={`text-uppercase status-copy mr-2 transcoding-status-${mezzanineNodeStatus}`}>
                {mezzanineNodeStatus}
              </small>
            </div>
          </CardHeader>
          :
          <CardHeader>Details</CardHeader>
        }
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

          <PicklistField picklist="video-swipes" name="swipe" label="Swipe" />
        </CardBody>
      </Card>
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
