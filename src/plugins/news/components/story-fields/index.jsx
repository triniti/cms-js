import { Card, CardBody, CardHeader } from '@triniti/admin-ui-plugin/components';
import { connect } from 'react-redux';
import { Field, FieldArray } from 'redux-form';
import { formRules } from '@triniti/cms/plugins/news/constants';
import DatePickerField from '@triniti/cms/components/date-picker-field';
import get from 'lodash/get';
import KeyValuesField from '@triniti/cms/components/key-values-field';
import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';
import PicklistPickerField from '@triniti/cms/plugins/sys/components/picklist-picker-field';
import PropTypes from 'prop-types';
import React from 'react';
import Schema from '@gdbots/pbj/Schema';
import slottingConfig from 'config/slottingConfig'; // eslint-disable-line import/no-unresolved
import SlugEditor from '@triniti/cms/plugins/ncr/components/slug-editor';
import TextField from '@triniti/cms/components/text-field';
import selector from './selector';

const StoryFields = ({ formName, formValues, isEditMode, nodeRef, schemas }) => {
  const { TITLE_LENGTH_LIMIT } = formRules;
  const titleLength = get(formValues, 'title', '').length;

  return (
    <Card>
      <CardHeader>Story</CardHeader>
      <CardBody indent className="pb-4">
        <Field
          name="title"
          type="text"
          component={TextField}
          readOnly={!isEditMode}
          label="Title"
          placeholder="enter title"
          size="xlg"
        />
        {titleLength > TITLE_LENGTH_LIMIT + 14
        && (
        <small style={{ 'margin-bottom': '1.55rem', 'margin-top': '-1.3rem' }} className="ml-1 form-text text-danger">
          {`recommendation: keep title less than ${TITLE_LENGTH_LIMIT} characters to avoid title extending too long in search results. (${titleLength}/${TITLE_LENGTH_LIMIT})`}
        </small>
        )}
        <SlugEditor
          formName={formName}
          isEditMode={isEditMode}
          nodeRef={nodeRef}
          schemas={schemas}
        />
        {schemas.node.hasMixin('triniti:curator:mixin:teaserable') && (
          <Field
            component={DatePickerField}
            label="Order Date"
            name="orderDate"
            readOnly={!isEditMode}
          />
        )}
        {schemas.node.hasMixin('gdbots:ncr:mixin:expirable') && (
          <Field
            component={DatePickerField}
            label="Expires At"
            name="expiresAt"
            readOnly={!isEditMode}
          />
        )}
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
          selectFieldOptions={slottingConfig}
          type="Slot Value"
          valueType="number"
        />
      </CardBody>
    </Card>
  );
};

StoryFields.propTypes = {
  formName: PropTypes.string,
  formValues: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  isEditMode: PropTypes.bool,
  nodeRef: PropTypes.instanceOf(NodeRef).isRequired,
  schemas: PropTypes.objectOf(PropTypes.instanceOf(Schema)).isRequired,
};

StoryFields.defaultProps = {
  formName: '',
  formValues: {},
  isEditMode: true,
};

export default connect(selector)(StoryFields);
