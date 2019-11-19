import React from 'react';
import { Field } from 'redux-form';
import { Col, FormGroup, Row } from '@triniti/admin-ui-plugin/components';
import DatePickerField from '@triniti/cms/components/date-picker-field';
import PicklistPickerField from '@triniti/cms/plugins/sys/components/picklist-picker-field';
import TextareaField from '@triniti/cms/components/textarea-field';
import TextField from '@triniti/cms/components/text-field';
import { DATE_FIELD_QUICK_SELECT_OPTIONS } from '@triniti/cms/plugins/dam/constants';

function BatchEditFields() {
  return (
    <div>
      <Row>
        <Col>
          <FormGroup>
            <Field name="title" component={TextField} label="Title" placeholder="Title" size="sm" />
          </FormGroup>
        </Col>
      </Row>
      <Row className="gutter-sm">
        <Col>
          <FormGroup>
            <Field
              component={PicklistPickerField}
              isEditMode
              label="Credit"
              name="credit"
              picklistId="image-asset-credits"
              size="sm"
            />
          </FormGroup>
        </Col>
      </Row>
      <Row className="gutter-sm">
        <Col>
          <Field
            component={DatePickerField}
            label="Expires At"
            name="expiresAt"
            quickSelectOptions={DATE_FIELD_QUICK_SELECT_OPTIONS}
            showQuickSelect
            showSetCurrentDateTimeIcon={false}
            showTime={false}
            size="sm"
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <FormGroup className="mb-3">
            <Field name="description" component={TextareaField} label="description" size="sm" />
          </FormGroup>
        </Col>
      </Row>
    </div>
  );
}

export default BatchEditFields;
