import React from 'react';
import { Card, CardBody, CardHeader } from 'reactstrap';
import { DatePickerField, SelectField, TextField } from '@triniti/cms/components/index.js';
import BlocksmithField from '@triniti/cms/components/blocksmith-field/index.js';
import AdvertisingFields from '@triniti/cms/plugins/common/components/advertising-fields/index.js';
import ImagePickerField from '@triniti/cms/plugins/dam/components/image-picker-field/index.js';
import PicklistField from '@triniti/cms/plugins/sys/components/picklist-field/index.js';
import SlugField from '@triniti/cms/plugins/ncr/components/slug-field/index.js';
import SponsorPickerField from '@triniti/cms/plugins/boost/components/sponsor-picker-field/index.js';
import TaggableFields from '@triniti/cms/plugins/common/components/taggable-fields/index.js';
import RedirectPickerField from '@triniti/cms/plugins/sys/components/redirect-picker-field/index.js';
import pageLayouts from '@triniti/app/config/pageLayouts.js';

export default function DetailsTab(props) {
  const { node, nodeRef } = props;
  const schema = node.schema();

  return (
    <>
      <Card>
        <CardHeader>Details</CardHeader>
        <CardBody>
          <TextField name="title" label="Title" required />
          <SlugField nodeRef={nodeRef} />
          <DatePickerField name="order_date" label="Order Date" />
          <DatePickerField name="expires_at" label="Expires At" />
          <ImagePickerField name="image_ref" label="Primary Image" nodeRef={nodeRef} />
          <SelectField name="layout" label="Layout" options={pageLayouts} />
          <RedirectPickerField name="redirect_ref" label="Vanity URL" />
          {schema.hasMixin('triniti:boost:mixin:sponsorable') && (
            <SponsorPickerField name="sponsor_ref" label="Sponsor" />
          )}
          {schema.hasMixin('triniti:common:mixin:themeable') && (
            <PicklistField picklist="page-themes" name="theme" label="Theme" />
          )}
        </CardBody>
      </Card>
      <Card>
        <CardHeader>Content</CardHeader>
        <CardBody>
          <BlocksmithField name="blocks" />
        </CardBody>
      </Card>
      <AdvertisingFields />
      <TaggableFields />
    </>
  );
}
