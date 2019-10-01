import PropTypes from 'prop-types';
import React from 'react';
import { Field, FieldArray } from 'redux-form';
import KeyValuesField from '@triniti/cms/components/key-values-field';
import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';
import PicklistPickerField from '@triniti/cms/plugins/sys/components/picklist-picker-field';
import DatePickerField from '@triniti/cms/components/date-picker-field';
import Schema from '@gdbots/pbj/Schema';
import SlugEditor from '@triniti/cms/plugins/ncr/components/slug-editor';
import TextField from '@triniti/cms/components/text-field';
import { Card, CardBody, CardHeader } from '@triniti/admin-ui-plugin/components';

const StoryFields = ({
  formName, isEditMode, nodeRef, schemas,
}) => (
  <Card>
    <CardHeader>Story</CardHeader>
    <CardBody indent className="pb-4">
      <Field name="title" type="text" component={TextField} readOnly={!isEditMode} label="Title" placeholder="enter title" size="xlg" />
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
      <Field
        component={PicklistPickerField}
        isEditMode={isEditMode}
        label="Classification"
        name="classification"
        picklistId="article-classifications"
      />
      <FieldArray
        component={KeyValuesField}
        keyFieldComponent="selectField"
        label="Slotting"
        name="slotting"
        readOnly={!isEditMode}
        selectFieldOptions={[{ label: 'home', value: 'home' }, { label: 'sports', value: 'sports' }]}
        type="Slot Value"
        valueType="number"
      />
    </CardBody>
  </Card>
);

StoryFields.propTypes = {
  formName: PropTypes.string,
  isEditMode: PropTypes.bool,
  nodeRef: PropTypes.instanceOf(NodeRef).isRequired,
  schemas: PropTypes.objectOf(PropTypes.instanceOf(Schema)).isRequired,
};

StoryFields.defaultProps = {
  formName: '',
  isEditMode: true,
};

export default StoryFields;
