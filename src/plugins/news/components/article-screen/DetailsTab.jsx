import React from 'react';
import { Card, CardBody, CardHeader } from 'reactstrap';
import { SwitchField, TextField } from 'components';
import AdvertisingFields from 'plugins/common/components/advertising-fields';
import TaggableFields from 'plugins/common/components/taggable-fields';
import ImagePickerField from 'plugins/dam/components/image-picker-field';
import PicklistField from 'plugins/sys/components/picklist-field';
import ArticlePickerField from 'plugins/news/components/article-picker-field';
import SponsorPickerField from 'plugins/boost/components/sponsor-picker-field';

export default function DetailsTab(props) {
  const { node, nodeRef } = props;
  const schema = node.schema();

  return (
    <>
      <Card>
        <CardHeader>Details</CardHeader>
        <CardBody>
          <ImagePickerField name="image_ref" label="Image" nodeRef={nodeRef} />
          <hr />
          <PicklistField picklist="article-swipes" name="swipe" label="Swipe" />
          <div className="row p-3">
            <div className='col-md-4'>
              <SwitchField name="is_homepage_news" label="Homepage News" />
            </div>
            <div className='col-md-4'>
              <SwitchField name="allow_comments" label="Allow Comments" />
            </div>
            <div className='col-md-4'>
              <SwitchField name="apple_news_enabled" label="Apple News" />
            </div>
            <div className='col-md-4'>
              <SwitchField name="amp_enabled" label="Google AMP" />
            </div>
            <div className='col-md-4'>
              <SwitchField name="smartnews_enabled" label="SmartNews" />
            </div>
            <div className='col-md-4'>
              <SwitchField name="facebook_instant_articles_enabled" label="Facebook Instant Articles" />
            </div>
          </div>
          <SponsorPickerField  name="sponsor_ref" label="Sponsor" />
          <PicklistField picklist="article-themes" name="theme" label="Theme" />
        </CardBody>
      </Card>
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
          </CardBody>
        </Card>
      )}
      <AdvertisingFields />
      <TaggableFields />
    </>
  );
}
