import { Card, CardBody, CardHeader } from '@triniti/admin-ui-plugin/components';
import { Field, FieldArray } from 'redux-form';
import ImageAssetPickerField from '@triniti/cms/plugins/dam/components/image-asset-picker-field';
import Message from '@gdbots/pbj/Message';
import PropTypes from 'prop-types';
import React from 'react';
import Schema from '@gdbots/pbj/Schema';
import SlugEditor from '@triniti/cms/plugins/ncr/components/slug-editor';
import SponsorPickerField from '@triniti/cms/plugins/boost/components/sponsor-picker-field';
import TextField from '@triniti/cms/components/text-field';

const CategoryFields = ({ category, formName, isEditMode, schemas }) => (
  <Card>
    <CardHeader>Details</CardHeader>
    <CardBody indent>
      <Field readOnly={!isEditMode} name="title" component={TextField} label="Title" placeholder="Enter Title" size="xlg" />
      <Field
        areLinkedImagesAllowed={false}
        name="imageRef"
        component={ImageAssetPickerField}
        isEditMode={isEditMode}
        node={category}
        label="Primary Image"
      />
      <SlugEditor
        formName={formName}
        initialSlug={category.get('slug')}
        isEditMode={isEditMode}
        nodeRef={category.get('_id').toNodeRef()}
        schemas={schemas}
      />
      {schemas.node.hasMixin('triniti:boost:mixin:sponsorable')
        && <FieldArray name="sponsorRefs" component={SponsorPickerField} isEditMode={isEditMode} />}
    </CardBody>
  </Card>
);

CategoryFields.propTypes = {
  category: PropTypes.instanceOf(Message),
  formName: PropTypes.string,
  isEditMode: PropTypes.bool,
  schemas: PropTypes.objectOf(PropTypes.instanceOf(Schema)),
};

CategoryFields.defaultProps = {
  category: null,
  formName: '',
  isEditMode: false,
  schemas: {},
};

export default CategoryFields;
