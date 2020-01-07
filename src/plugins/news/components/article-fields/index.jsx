import { Card, CardBody, CardHeader, FormGroup } from '@triniti/admin-ui-plugin/components';
import { Field, FieldArray } from 'redux-form';
import ArticlePicker from '@triniti/cms/plugins/news/components/article-picker-field';
import CheckboxField from '@triniti/cms/components/checkbox-field';
import ImageAssetPickerField from '@triniti/cms/plugins/dam/components/image-asset-picker-field';
import Message from '@gdbots/pbj/Message';
import PicklistPickerField from '@triniti/cms/plugins/sys/components/picklist-picker-field';
import PropTypes from 'prop-types';
import React from 'react';
import Schema from '@gdbots/pbj/Schema';
import SponsorPickerField from '@triniti/cms/plugins/boost/components/sponsor-picker-field';
import TextField from '@triniti/cms/components/text-field';
import UserPicker from '@triniti/cms/plugins/iam/components/user-picker-field';

const ArticleFields = ({ article, isEditMode, schemas }) => (
  <>
    <Card>
      <CardHeader>Details</CardHeader>
      <CardBody indent>
        <Field
          component={ImageAssetPickerField}
          isEditMode={isEditMode}
          label="Primary Image"
          name="imageRef"
          node={article}
        />
        <hr />
        {schemas.node.hasMixin('triniti:common:mixin:swipeable') && (
        <Field
          component={PicklistPickerField}
          isEditMode={isEditMode}
          label="Swipe"
          name="swipe"
          picklistId="article-swipes"
        />
        )}
        <div className="pb-1 d-md-inline-flex">
          <Field name="isHomepageNews" component={CheckboxField} disabled={!isEditMode} label="Homepage News" />
          <Field name="allowComments" component={CheckboxField} disabled={!isEditMode} label="Allow Comments" />
          <Field name="ampEnabled" component={CheckboxField} disabled={!isEditMode} label="Google Amp" />
          <Field name="smartnewsEnabled" component={CheckboxField} disabled={!isEditMode} label="SmartNews" />
        </div>
        {schemas.node.hasMixin('triniti:boost:mixin:sponsorable')
          && <FieldArray name="sponsorRefs" component={SponsorPickerField} isEditMode={isEditMode} />}
        {schemas.node.hasMixin('triniti:common:mixin:themeable')
          && (
          <Field
            component={PicklistPickerField}
            isEditMode={isEditMode}
            label="Theme"
            name="theme"
            picklistId="article-themes"
          />
          )}
        <FieldArray
          component={UserPicker}
          isEditMode={isEditMode}
          label="Author"
          name="authorRefs"
          placeholder="Select an author..."
        />
      </CardBody>
    </Card>
    <Card>
      <CardHeader>Related Articles</CardHeader>
      <CardBody indent>
        <Field
          component={CheckboxField}
          disabled={!isEditMode}
          label="Show Related Articles"
          name="showRelatedArticles"
        />
        <Field
          component={TextField}
          label="Related Article Heading Override"
          name="relatedArticlesHeading"
          placeholder="e.g: See also..."
          readOnly={!isEditMode}
        />
        <FormGroup>
          <FieldArray name="relatedArticleRefs" component={ArticlePicker} isEditMode={isEditMode} />
        </FormGroup>
      </CardBody>
    </Card>
  </>
);

ArticleFields.propTypes = {
  article: PropTypes.instanceOf(Message).isRequired,
  isEditMode: PropTypes.bool,
  schemas: PropTypes.objectOf(PropTypes.instanceOf(Schema)).isRequired,
};

ArticleFields.defaultProps = {
  isEditMode: true,
};

export default ArticleFields;
