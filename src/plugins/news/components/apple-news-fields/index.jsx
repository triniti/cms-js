import PropTypes from 'prop-types';
import React from 'react';
import { Field } from 'redux-form';
import CheckboxField from '@triniti/cms/components/checkbox-field';
import Message from '@gdbots/pbj/Message';
import TextField from '@triniti/cms/components/text-field';
import convertReadableTime from '@triniti/cms/utils/convertReadableTime';
import { Card, CardBody, Label, ListGroupItem } from '@triniti/admin-ui-plugin/components';

const AppleNewsFields = ({ article, isEditMode }) => (
  <Card title="Apple News">
    <CardBody indent>
      <Field
        component={CheckboxField}
        disabled={!isEditMode}
        label="Apple News Enabled"
        name="appleNewsEnabled"
      />
      <Field
        component={TextField}
        disabled={!isEditMode}
        label="Apple News Revision"
        name="appleNewsRevision"
      />
      <Field
        component={TextField}
        disabled={!isEditMode}
        label="Apple News ID"
        name="appleNewsId"
      />
      <Field
        component={TextField}
        disabled={!isEditMode}
        label="Apple News Share URL"
        name="appleNewsShareUrl"
      />
      {
        article.has('apple_news_updated_at') && (
          <>
            <Label>Apple News Updated At</Label>
            <ListGroupItem className="mb-4 pt-2 pb-2 border-0 pl-0">
              {convertReadableTime(article.get('apple_news_updated_at'))}
            </ListGroupItem>
          </>
        )
      }
    </CardBody>
  </Card>
);

AppleNewsFields.propTypes = {
  article: PropTypes.instanceOf(Message),
  isEditMode: PropTypes.bool,
};

AppleNewsFields.defaultProps = {
  article: null,
  isEditMode: false,
};

export default AppleNewsFields;
