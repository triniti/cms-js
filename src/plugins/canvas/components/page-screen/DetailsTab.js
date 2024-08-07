import React from 'react';
import { Card, CardBody, CardHeader } from 'reactstrap';
import { DatePickerField, SelectField, TextField } from '@triniti/cms/components/index.js';
import Blocksmith from '@triniti/cms/blocksmith/index.js';
import AdvertisingFields from '@triniti/cms/plugins/common/components/advertising-fields/index.js';
import SeoTitleField from '@triniti/cms/plugins/common/components/seo-title-field/index.js';
import ImageAssetPickerField from '@triniti/cms/plugins/dam/components/image-asset-picker-field/index.js';
import PicklistField from '@triniti/cms/plugins/sys/components/picklist-field/index.js';
import SlugField from '@triniti/cms/plugins/ncr/components/slug-field/index.js';
import SponsorPickerField from '@triniti/cms/plugins/boost/components/sponsor-picker-field/index.js';
import TaggableFields from '@triniti/cms/plugins/common/components/taggable-fields/index.js';
import RedirectPickerField from '@triniti/cms/plugins/sys/components/redirect-picker-field/index.js';
import pageLayouts from '@triniti/app/config/pageLayouts.js';

export default function DetailsTab(props) {
  const { node, tab } = props;
  const schema = node.schema();

  return (
    <>
      <Card>
        <CardHeader>Details</CardHeader>
        <CardBody>
          <SeoTitleField />
          <SlugField />

          {schema.hasMixin('triniti:curator:mixin:teaserable') && (
            <DatePickerField name="order_date" label="Order Date" />
          )}

          {schema.hasMixin('gdbots:ncr:mixin:expirable') && (
            <DatePickerField name="expires_at" label="Expires At" />
          )}

          <ImageAssetPickerField name="image_ref" label="Primary Image" />
          <SelectField name="layout" label="Layout" options={pageLayouts} />

          {schema.hasMixin('triniti:sys:mixin:vanity-urlable') && (
            <RedirectPickerField name="redirect_ref" label="Vanity URL" />
          )}

          {schema.hasMixin('triniti:boost:mixin:sponsorable') && (
            <SponsorPickerField name="sponsor_ref" label="Sponsor" />
          )}

          {schema.hasMixin('triniti:common:mixin:themeable') && (
            <PicklistField picklist="page-themes" name="theme" label="Theme" />
          )}
        </CardBody>
      </Card>

      {schema.hasMixin('triniti:canvas:mixin:has-blocks') && (
        <Blocksmith isVisible={tab === 'details'} />
      )}

      <AdvertisingFields />
      <TaggableFields />
    </>
  );
}
