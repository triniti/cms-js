import PropTypes from 'prop-types';
import React from 'react';
import { Field } from 'redux-form';

import Schema from '@gdbots/pbj/Schema';
import TextField from '@triniti/cms/components/text-field';
import DatePickerField from '@triniti/cms/components/date-picker-field';
import { Card, CardBody, CardHeader } from '@triniti/admin-ui-plugin/components';
import SlugEditor from '@triniti/cms/plugins/ncr/components/slug-editor';
import Message from '@gdbots/pbj/Message';
import SelectField from '@triniti/cms/components/select-field';
import TextareaField from '@triniti/cms/components/textarea-field';
import SponsorType from '@triniti/schemas/triniti/boost/enums/SponsorType';

const sponsorOptions = Object
  .entries(SponsorType.getValues())
  .map((arr) => ({ label: arr[1], value: arr[0].toLowerCase() }));

const SponsorFields = ({ sponsor, formName, isEditMode, schemas }) => ([
  <Card key="details">
    <CardHeader>Details</CardHeader>
    <CardBody indent>
      <Field readOnly={!isEditMode} name="title" component={TextField} label="Title" placeholder="Enter Title" size="xlg" />
      { sponsor && (
        <SlugEditor
          formName={formName}
          nodeRef={sponsor.get('_id').toNodeRef()}
          initialSlug={sponsor.get('slug')}
          isEditMode={isEditMode}
          schemas={schemas}
        />
      )}
      {
        schemas.node.hasMixin('gdbots:ncr:mixin:expirable')
        && (
          <Field
            component={DatePickerField}
            label="Expires At"
            name="expiresAt"
            readOnly={!isEditMode}
          />
        )
      }
      <Field disabled={!isEditMode} name="type" component={SelectField} label="Sponsor Type" options={sponsorOptions} />
      <Field
        name="permalinkHtmlHead"
        component={TextareaField}
        label="Append to HTML HEAD Tag"
        placeholder="enter html code"
        readOnly={!isEditMode}
      />
      <Field
        name="permalinkBadge"
        component={TextareaField}
        label="Permalink Badge"
        placeholder="enter html code"
        readOnly={!isEditMode}
      />
      <Field
        name="timelineBadge"
        component={TextareaField}
        label="Timeline Badge"
        placeholder="enter html code"
        readOnly={!isEditMode}
      />
    </CardBody>
  </Card>,
]);

SponsorFields.propTypes = {
  isEditMode: PropTypes.bool,
  schemas: PropTypes.objectOf(PropTypes.instanceOf(Schema)),
  sponsor: PropTypes.instanceOf(Message),
  formName: PropTypes.string,
};

SponsorFields.defaultProps = {
  sponsor: null,
  formName: '',
  isEditMode: false,
  schemas: {},
};

export default SponsorFields;
