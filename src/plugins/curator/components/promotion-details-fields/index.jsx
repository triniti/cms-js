import { Card, CardBody, CardHeader } from '@triniti/admin-ui-plugin/components';
import { Field, FieldArray } from 'redux-form';
import DatePickerField from '@triniti/cms/components/date-picker-field';
import PicklistPickerField from '@triniti/cms/plugins/sys/components/picklist-picker-field';
import PropTypes from 'prop-types';
import React from 'react';
import Schema from '@gdbots/pbj/Schema';
import TextField from '@triniti/cms/components/text-field';
import WidgetPickerField from '@triniti/cms/plugins/curator/components/widget-picker-field';

const PromotionFields = ({ isEditMode, schemas }) => (
  <>
    <Card>
      <CardHeader>Details</CardHeader>
      <CardBody indent>
        <Field
          component={TextField}
          label="Title"
          name="title"
          placeholder="Enter Title"
          readOnly={!isEditMode}
          size="xlg"
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
          component={PicklistPickerField}
          isEditMode={isEditMode}
          label="Slot"
          name="slot"
          picklistId="promotion-slots"
          placeholder="Enter Slot"
        />
      </CardBody>
    </Card>
    <Card>
      <CardHeader>Content</CardHeader>
      <CardBody indent>
        <FieldArray
          component={WidgetPickerField}
          isEditMode={isEditMode}
          name="widgetRefs"
        />
      </CardBody>
    </Card>
  </>
);

PromotionFields.propTypes = {
  isEditMode: PropTypes.bool,
  schemas: PropTypes.objectOf(PropTypes.instanceOf(Schema)).isRequired,
};

PromotionFields.defaultProps = {
  isEditMode: false,
};

export default PromotionFields;
