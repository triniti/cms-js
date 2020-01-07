import PropTypes from 'prop-types';
import React from 'react';
import { Field, FieldArray } from 'redux-form';

import CategoryPickerField from '@triniti/cms/plugins/taxonomy/components/category-picker-field';
import ChannelPickerField from '@triniti/cms/plugins/taxonomy/components/channel-picker-field';
import HashtagsPickerField from '@triniti/cms/plugins/taxonomy/components/hashtags-picker-field';
import PeoplePickerField from '@triniti/cms/plugins/people/components/people-picker-field';
import Schema from '@gdbots/pbj/Schema';
import { Card, CardBody, CardHeader } from '@triniti/admin-ui-plugin/components';

const TaxonomyFields = ({ schemas, isEditMode }) => (
  <Card>
    <CardHeader>Taxonomy</CardHeader>
    <CardBody indent>
      {
        schemas.node.hasMixin('triniti:people:mixin:has-people')
        && (
          <>
            <FieldArray
              component={PeoplePickerField}
              isEditMode={isEditMode}
              label="Primary People"
              name="primaryPersonRefs"
              placeholder="Select primary people..."
            />
            <FieldArray
              component={PeoplePickerField}
              isEditMode={isEditMode}
              label="Related People"
              name="personRefs"
              placeholder="Select related people..."
            />
          </>
        )
      }
      {
        schemas.node.hasMixin('triniti:taxonomy:mixin:has-channel')
        && <FieldArray name="channelRefs" component={ChannelPickerField} isEditMode={isEditMode} />
      }
      {
        schemas.node.hasMixin('triniti:taxonomy:mixin:categorizable')
        && <FieldArray name="categoryRefs" component={CategoryPickerField} isEditMode={isEditMode} />
      }
      {
        schemas.node.hasMixin('triniti:taxonomy:mixin:hashtaggable')
        && <Field name="hashtags" component={HashtagsPickerField} isEditMode={isEditMode} />
      }
    </CardBody>
  </Card>
);

TaxonomyFields.propTypes = {
  isEditMode: PropTypes.bool,
  schemas: PropTypes.objectOf(PropTypes.oneOfType([
    PropTypes.instanceOf(Schema),
    PropTypes.arrayOf(PropTypes.instanceOf(Schema)),
  ])).isRequired,
};

TaxonomyFields.defaultProps = {
  isEditMode: true,
};

export default TaxonomyFields;
