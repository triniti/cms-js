import React from 'react';
import { Card, CardBody, CardHeader } from 'reactstrap';
import { DatePickerField, SelectField, TextField } from 'components';
import BlocksmithField from 'components/blocksmith-field';
import AdvertisingFields from 'plugins/common/components/advertising-fields';
import ImagePickerField from 'plugins/dam/components/image-picker-field';
import PicklistField from 'plugins/sys/components/picklist-field';
import SlugField from 'plugins/ncr/components/slug-field';
import SponsorPickerField from 'plugins/boost/components/sponsor-picker-field';
import TaggableFields from 'plugins/common/components/taggable-fields';
import RedirectPickerField from 'plugins/sys/components/redirect-picker-field';

const pageLayouts = [
  {
    label: 'Content Only (no NAV, header or footer)',
    value: 'content-only',
  },
  {
    label: 'One Column',
    value: 'one-column',
  },
  {
    label: 'Two Column',
    value: 'two-column',
  },
  {
    label: 'None (no HTML wrapper)',
    value: 'none',
  },
];

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
          <BlocksmithField node={node} />
        </CardBody>
      </Card>
      <AdvertisingFields />
      <TaggableFields />
    </>
  );
}
