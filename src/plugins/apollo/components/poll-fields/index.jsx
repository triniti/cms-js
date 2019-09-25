import PropTypes from 'prop-types';
import React from 'react';
import { Field, FieldArray } from 'redux-form';

import Checkbox from '@triniti/cms/components/checkbox-field';
import DatePickerField from '@triniti/cms/components/date-picker-field';
import ImageAssetPickerField from '@triniti/cms/plugins/dam/components/image-asset-picker-field';
import Message from '@gdbots/pbj/Message';
import SponsorPickerField from '@triniti/cms/plugins/boost/components/sponsor-picker-field';
import TextField from '@triniti/cms/components/text-field';
import { Card, CardBody, CardHeader } from '@triniti/admin-ui-plugin/components';

import Schema from '@gdbots/pbj/Schema';
import PollAnswers from './PollAnswers';

const PollFields = ({ isEditMode, node, schemas }) => (
  <>
    <Card>
      <CardHeader>Details</CardHeader>
      <CardBody indent>
        <Field name="title" component={TextField} readOnly={!isEditMode} label="Title" size="xlg" />
        <Field
          component={Checkbox}
          disabled={!isEditMode}
          label="Multiple Responses"
          name="allowMultipleResponses"
        />
        <Field name="question" component={TextField} readOnly={!isEditMode} label="Question" />
        <Field
          component={TextField}
          label="Question Link"
          name="questionUrl"
          readOnly={!isEditMode}
        />
        {
          schemas.node.hasMixin('gdbots:ncr:mixin:expirable') && (
            <Field
              component={DatePickerField}
              label="Expires At"
              name="expiresAt"
              readOnly={!isEditMode}
            />
          )
        }
        <Field
          component={ImageAssetPickerField}
          isEditMode={isEditMode}
          label="Primary Image"
          name="imageRef"
          node={node}
        />
        {
          schemas.node.hasMixin('triniti:boost:mixin:sponsorable')
          && <FieldArray name="sponsorRefs" component={SponsorPickerField} isEditMode={isEditMode} />
        }
      </CardBody>
    </Card>
    <Card key="answers">
      <CardHeader>Answers</CardHeader>
      <CardBody indent>
        <FieldArray
          component={PollAnswers}
          label="Poll answers"
          name="answers"
          readOnly={!isEditMode}
        />
      </CardBody>
    </Card>
  </>
);

PollFields.propTypes = {
  isEditMode: PropTypes.bool,
  node: PropTypes.instanceOf(Message),
  schemas: PropTypes.objectOf(PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.instanceOf(Schema)),
    PropTypes.instanceOf(Schema),
  ])).isRequired,
};

PollFields.defaultProps = {
  isEditMode: true,
  node: null,
};

export default PollFields;
