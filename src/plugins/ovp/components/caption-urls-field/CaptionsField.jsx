import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { Button, FormGroup, Icon } from '@triniti/admin-ui-plugin/components';
import SelectField from '@triniti/cms/components/select-field';
import TextField from '@triniti/cms/components/text-field';

const CaptionsField = ({ fields, options, isEditMode }) => (
  <FormGroup>
    {fields.map((caption, index) => (
      <div className="d-flex" key={caption}>
        <Field
          component={SelectField}
          disabled={!isEditMode}
          formGroupClassName="mr-2"
          formGroupStyle={{ width: '88px' }}
          name={`${caption}.language`}
          options={options}
        />
        <Field
          className="flex-grow-1 mr-2"
          component={TextField}
          name={`${caption}.url`}
          placeholder="caption url"
          readOnly={!isEditMode}
        />
        <Button
          color="hover"
          radius="circle"
          className="mr-0 mb-0"
          onClick={() => fields.remove(index)}
          style={{ width: '34px' }}
        ><Icon imgSrc="delete" alt="delete" />
        </Button>
      </div>
    ))}
    <button type="button" className="btn btn-light btn-sm" onClick={() => (fields.length < 3 ? fields.push() : fields)} disabled={!isEditMode}>
      <Icon imgSrc="plus-outline" size="sm" className="mr-2" />Add Caption
    </button>
  </FormGroup>
);

CaptionsField.propTypes = {
  fields: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  options: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.string,
  })),
  isEditMode: PropTypes.bool.isRequired,
};

CaptionsField.defaultProps = {
  fields: {},
  options: [],
};

export default CaptionsField;
