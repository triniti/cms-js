import React from 'react';
import { Card, CardBody, CardHeader } from 'reactstrap';
import { SwitchField, TextField } from '@triniti/cms/components/index.js';
import AdvertisingFields from '@triniti/cms/plugins/common/components/advertising-fields/index.js';
import ImageAssetPickerField from '@triniti/cms/plugins/dam/components/image-asset-picker-field/index.js';
import PicklistField from '@triniti/cms/plugins/sys/components/picklist-field/index.js';
import ArticlePickerField from '@triniti/cms/plugins/news/components/article-picker-field/index.js';
import SponsorPickerField from '@triniti/cms/plugins/boost/components/sponsor-picker-field/index.js';
import TeaserPickerField from '@triniti/cms/plugins/curator/components/teaser-picker-field/index.js';
import UserPickerField from '@triniti/cms/plugins/iam/components/user-picker-field/index.js';
import TaggableFields from '@triniti/cms/plugins/common/components/taggable-fields/index.js';
import SyndicationCard from '@triniti/cms/plugins/news/components/article-screen/SyndicationCard.js';

export default function DetailsTab(props) {
  const { node } = props;
  const schema = node.schema();

  return (
    <>
      <Card>
        <CardHeader>Details</CardHeader>
        <CardBody>
          <ImageAssetPickerField name="image_ref" label="Primary Image" />

          {schema.hasMixin('triniti:common:mixin:swipeable') && (
            <PicklistField picklist="article-swipes" name="swipe" label="Swipe" />
          )}

          {schema.hasMixin('triniti:boost:mixin:sponsorable') && (
            <SponsorPickerField name="sponsor_ref" label="Sponsor" />
          )}

          {schema.hasMixin('triniti:common:mixin:themeable') && (
            <PicklistField picklist="article-themes" name="theme" label="Theme" />
          )}

          <UserPickerField name="author_ref" label="Author" />
          <SwitchField name="allow_comments" label="Allow Comments" />
        </CardBody>
      </Card>

      <SyndicationCard />

      <Card>
        <CardHeader>Related Articles</CardHeader>
        <CardBody>
          <SwitchField name="show_related_articles" label="Show Related Articles" />
          <TextField name="related_articles_heading" label="Related Articles Heading" />
          <ArticlePickerField name="related_article_refs" label="Related Articles" isMulti sortable />
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
