import { Card, CardBody, CardHeader, Label } from '@triniti/admin-ui-plugin/components';
import { DATE_FIELD_QUICK_SELECT_OPTIONS } from '@triniti/cms/plugins/curator/constants';
import { Field, FieldArray } from 'redux-form';
import CheckboxField from '@triniti/cms/components/checkbox-field';
import DatePickerField from '@triniti/cms/components/date-picker-field';
import GalleryPickerField from '@triniti/cms/plugins/curator/components/gallery-picker-field';
import ImageAssetPickerField from '@triniti/cms/plugins/dam/components/image-asset-picker-field';
import Message from '@gdbots/pbj/Message';
import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';
import PicklistPickerField from '@triniti/cms/plugins/sys/components/picklist-picker-field';
import PropTypes from 'prop-types';
import React from 'react';
import Schema from '@gdbots/pbj/Schema';
import SlugEditor from '@triniti/cms/plugins/ncr/components/slug-editor';
import SponsorPickerField from '@triniti/cms/plugins/boost/components/sponsor-picker-field';
import TextareaField from '@triniti/cms/components/textarea-field';
import TextField from '@triniti/cms/components/text-field';

const GalleryFields = ({ isEditMode, gallery, formName, nodeRef, schemas }) => {
  const required = (value) => (value ? undefined : 'Primary Image is Required');
  return (
    <Card key="details">
      <CardHeader>Gallery</CardHeader>
      <CardBody indent className="pb-4">
        <Field
          component={TextField}
          label="Title"
          name="title"
          placeholder="enter title"
          readOnly={!isEditMode}
          size="xlg"
          type="text"
        />
        <SlugEditor
          formName={formName}
          isEditMode={isEditMode}
          nodeRef={nodeRef}
          schemas={schemas}
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
              quickSelectOptions={DATE_FIELD_QUICK_SELECT_OPTIONS}
              label="Expires At"
              name="expiresAt"
              readOnly={!isEditMode}
              showQuickSelect
              showSetCurrentDateTimeIcon={false}
              showTime={false}
            />
          )
        }
        <Field
          className="mb-0"
          component={TextareaField}
          label="Description"
          name="description"
          readOnly={!isEditMode}
        />
        <hr />
        <Field
          areLinkedImagesAllowed={false}
          component={ImageAssetPickerField}
          isEditMode={isEditMode}
          label="Media"
          name="imageRef"
          node={gallery}
          validate={[required]}
        />
        <Field
          component={TextField}
          readOnly={!isEditMode}
          label="Launch Text"
          name="launchText"
          placeholder="Enter launch text"
        />
        <Field
          component={CheckboxField}
          disabled={!isEditMode}
          label="Allow Comments"
          name="allowComments"
        />
        <hr />
        <Label>Related Galleries</Label>
        <FieldArray
          component={GalleryPickerField}
          isEditMode={isEditMode}
          name="relatedGalleryRefs"
        />
        <Field
          component={PicklistPickerField}
          isEditMode={isEditMode}
          label="Credit"
          name="credit"
          picklistId="gallery-credits"
        />
        <Field
          component={TextField}
          isEditMode={isEditMode}
          label="Credit Url"
          name="creditUrl"
          />
        {schemas.node.hasMixin('triniti:boost:mixin:sponsorable')
          && <FieldArray label="Sponsor" name="sponsorRefs" component={SponsorPickerField} isEditMode={isEditMode} />}
      </CardBody>
    </Card>
  );
};

GalleryFields.propTypes = {
  formName: PropTypes.string,
  gallery: PropTypes.instanceOf(Message),
  isEditMode: PropTypes.bool,
  nodeRef: PropTypes.instanceOf(NodeRef).isRequired,
  schemas: PropTypes.objectOf(PropTypes.instanceOf(Schema)).isRequired,
};

GalleryFields.defaultProps = {
  formName: '',
  gallery: null,
  isEditMode: true,
};

export default GalleryFields;
