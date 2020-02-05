import { Card, CardBody, CardHeader } from '@triniti/admin-ui-plugin/components';
import { Field, FieldArray } from 'redux-form';
import CheckboxField from '@triniti/cms/components/checkbox-field';
import DatePickerField from '@triniti/cms/components/date-picker-field';
import ImageAssetPickerField from '@triniti/cms/plugins/dam/components/image-asset-picker-field';
import Message from '@gdbots/pbj/Message';
import PicklistPickerField from '@triniti/cms/plugins/sys/components/picklist-picker-field';
import PropTypes from 'prop-types';
import React from 'react';
import Schema from '@gdbots/pbj/Schema';
import SlugEditor from '@triniti/cms/plugins/ncr/components/slug-editor';
import SponsorPickerField from '@triniti/cms/plugins/boost/components/sponsor-picker-field';
import TextareaField from '@triniti/cms/components/textarea-field';
import TextField from '@triniti/cms/components/text-field';
import TimelinePickerField from '@triniti/cms/plugins/curator/components/timeline-picker-field';

const TimelineFields = ({ formName, isEditMode, node, schemas }) => ([
  <Card key="a">
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
      <Field
        name="displayTitle"
        component={TextField}
        label="Display Title"
        placeholder="enter display title"
        readOnly={!isEditMode}
      />
      <SlugEditor
        formName={formName}
        nodeRef={node.get('_id').toNodeRef()}
        schemas={schemas}
        isEditMode={isEditMode}
      />
      {
        schemas.node.hasMixin('triniti:curator:mixin:teaserable') && (
          <Field
            component={DatePickerField}
            label="Order Date"
            name="orderDate"
            readOnly={!isEditMode}
          />
        )
      }
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
        name="imageRef"
        component={ImageAssetPickerField}
        isEditMode={isEditMode}
        node={node}
        label="Primary Image"
      />
      <Field
        name="description"
        component={TextareaField}
        label="Description"
        placeholder="Enter description"
        readOnly={!isEditMode}
      />
      {
        schemas.node.hasMixin('triniti:boost:mixin:sponsorable')
          && <FieldArray name="sponsorRefs" component={SponsorPickerField} isEditMode={isEditMode} />
      }
    </CardBody>
  </Card>,
  <Card key="b">
    <CardHeader>Contents</CardHeader>
    <CardBody indent>
      <Field
        className="mr-2"
        component={CheckboxField}
        disabled={!isEditMode}
        label="Allow Comments"
        name="allowComments"
        size="sm"
      />
      <Field
        component={PicklistPickerField}
        isEditMode={isEditMode}
        label="Theme"
        name="theme"
        picklistId="timeline-themes"
      />
      <FieldArray
        closeOnSelect
        component={TimelinePickerField}
        isEditMode={isEditMode}
        name="relatedTimelineRefs"
      />
    </CardBody>
  </Card>,
]);

TimelineFields.propTypes = {
  formName: PropTypes.string.isRequired,
  isEditMode: PropTypes.bool,
  node: PropTypes.instanceOf(Message).isRequired,
  schemas: PropTypes.objectOf(PropTypes.instanceOf(Schema)).isRequired,
};

TimelineFields.defaultProps = {
  isEditMode: false,
};

export default TimelineFields;
