import { Card, CardBody, CardHeader } from '@triniti/admin-ui-plugin/components';
import { Field, FieldArray } from 'redux-form';
import CheckboxField from '@triniti/cms/components/checkbox-field';
import DatePickerField from '@triniti/cms/components/date-picker-field';
import ImageAssetPickerField from '@triniti/cms/plugins/dam/components/image-asset-picker-field';
import Message from '@gdbots/pbj/Message';
import noop from 'lodash/noop';
import PicklistPickerField from '@triniti/cms/plugins/sys/components/picklist-picker-field';
import PropTypes from 'prop-types';
import React from 'react';
import Schema from '@gdbots/pbj/Schema';
import SponsorPickerField from '@triniti/cms/plugins/boost/components/sponsor-picker-field';
import TextareaField from '@triniti/cms/components/textarea-field';
import TextField from '@triniti/cms/components/text-field';
import TimelinePickerField from '@triniti/cms/plugins/curator/components/timeline-picker-field';

const TeaserFields = ({
  additionalFields: AdditionalFields,
  isEditMode,
  node,
  pickerComponent: Picker,
  schemas,
}) => (
  <>
    <Card>
      <CardHeader>Details</CardHeader>
      <CardBody indent>
        <Field readOnly={!isEditMode} name="title" component={TextField} label="Title" placeholder="Enter Title" size="xlg" />
        <Picker readOnly={!isEditMode} />
        <Field
          component={DatePickerField}
          label="Order Date"
          name="orderDate"
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
          areLinkedImagesAllowed={false}
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

        {
          AdditionalFields && (<AdditionalFields readOnly={!isEditMode} />)
        }

      </CardBody>
    </Card>
    <Card>
      <CardHeader>Contents</CardHeader>
      <CardBody indent>
        {
          schemas.node.fields.has('sync_with_target') && (
            <Field
              component={CheckboxField}
              disabled={!isEditMode}
              label="Sync With Target"
              name="syncWithTarget"
            />
          )
        }
        <Field
          component={PicklistPickerField}
          isEditMode={isEditMode}
          label="Theme"
          name="theme"
          picklistId="teaser-themes"
        />
        <Field
          component={PicklistPickerField}
          isEditMode={isEditMode}
          label="Swipe"
          name="swipe"
          placeholder="Enter swipe"
          readOnly={!isEditMode}
          picklistId="teaser-swipes"
        />
        <Field
          component={TextField}
          label="Call to Action Label"
          name="ctaText"
          placeholder="Enter call to action label"
          readOnly={!isEditMode}
        />
        <Field
          component={TextareaField}
          label="Description"
          name="description"
          placeholder="Enter description"
          readOnly={!isEditMode}
        />
        <FieldArray
          component={TimelinePickerField}
          isEditMode={isEditMode}
          label="TIMELINE"
          multi={false}
          name="timelineRefs"
          placeholder="Select timeline..."
        />
      </CardBody>
    </Card>
  </>
);

TeaserFields.propTypes = {
  isEditMode: PropTypes.bool,
  node: PropTypes.instanceOf(Message).isRequired,
  pickerComponent: PropTypes.func,
  additionalFields: PropTypes.node,
  schemas: PropTypes.objectOf(PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.instanceOf(Schema)),
    PropTypes.instanceOf(Schema),
  ])).isRequired,
};

TeaserFields.defaultProps = {
  isEditMode: false,
  pickerComponent: noop,
  additionalFields: null,
};

export default TeaserFields;
