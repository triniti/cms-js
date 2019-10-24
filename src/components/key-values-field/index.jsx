import { Button, Col, FormGroup, Icon, Label, Row } from '@triniti/admin-ui-plugin/components';
import { Field } from 'redux-form';
import NumberField from '@triniti/cms/components/number-field';
import PropTypes from 'prop-types';
import React from 'react';
import SelectField from '@triniti/cms/components/select-field';
import TextField from '@triniti/cms/components/text-field';
import TrinaryField from '@triniti/cms/components/trinary-field';
import unCamelCase from '@triniti/cms/utils/unCamelCase';
import './styles.scss';

const KeyValuesField = ({
  fields,
  keyFieldComponent,
  keyPlaceholder,
  label,
  readOnly,
  selectFieldOptions,
  type,
  valuePlaceholder,
  valueType,
}) => {
  function handleAddEmptyField() {
    fields.push({ key: null, value: null });
  }

  function handleRemoveField(i) {
    fields.remove(i);
  }

  return (
    <FormGroup>
      <Row>
        <Col>
          <Label for={fields.name}>{label || unCamelCase(fields.name)}</Label>
        </Col>
      </Row>
      {fields.map((field, i) => (
        <FormGroup key={field} inline className="mb-2 flex-nowrap align-items-start">
          {keyFieldComponent === 'textField'
          && (
            <Field
              component={TextField}
              inline={false}
              name={`${field}.key`}
              placeholder={keyPlaceholder}
              readOnly={readOnly}
            />
          )}
          {keyFieldComponent === 'selectField'
          && (
            <Field
              className="key-values-field__select-dropdown"
              component={SelectField}
              disabled={readOnly}
              inline={false}
              name={`${field}.key`}
              options={selectFieldOptions}
              placeholder={keyPlaceholder}
              style={{ width: '7rem' }}
            />
          )}
          {valueType === 'string'
          && (
            <Field
              component={TextField}
              inline={false}
              name={`${field}.value`}
              placeholder={valuePlaceholder}
              readOnly={readOnly}
              style={{ width: '22rem' }}
            />
          )}
          {valueType === 'number'
          && (
            <Field
              component={NumberField}
              name={`${field}.value`}
              normalize={(value) => +value}
              placeholder={valuePlaceholder}
              readOnly={readOnly}
              style={{ width: '7rem' }}
            />
          )}
          {valueType === 'boolean'
          && (
            <Field
              component={SelectField}
              disabled={readOnly}
              inline={false}
              name={`${field}.value`}
              options={[{ label: 'true', value: true }, { label: 'false', value: false }]}
              placeholder={valuePlaceholder}
              style={{ width: '6rem' }}
            />
          )}
          {valueType === 'trinary'
          && (
            <Field
              component={TrinaryField}
              disabled={readOnly}
              inline={false}
              label=""
              name={`${field}.value`}
            />
          )}
          {!readOnly
          && (
          <Button
            className="align-self-start"
            color="hover"
            onClick={() => handleRemoveField(i)}
            radius="circle"
            style={{ marginTop: '2px' }}
          >
            <Icon imgSrc="delete" alt="delete" />
          </Button>
          )}
        </FormGroup>
      ))}
      {!readOnly
        && (
          <Button onClick={handleAddEmptyField}>
            <Icon imgSrc="plus-outline" size="sm" className="mr-2" />{`Add ${type}`}
          </Button>
        )}
    </FormGroup>
  );
};

KeyValuesField.propTypes = {
  fields: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  keyFieldComponent: PropTypes.string,
  keyPlaceholder: PropTypes.string,
  label: PropTypes.string,
  readOnly: PropTypes.bool,
  selectFieldOptions: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
  })),
  type: PropTypes.string,
  valuePlaceholder: PropTypes.string,
  valueType: PropTypes.string,
};

KeyValuesField.defaultProps = {
  keyFieldComponent: 'textField',
  keyPlaceholder: 'Enter name',
  label: null,
  readOnly: false,
  selectFieldOptions: null,
  type: 'Pair',
  valuePlaceholder: 'Enter value',
  valueType: 'string',
};

export default KeyValuesField;
