import PropTypes from 'prop-types';
import React from 'react';
import { Field } from 'redux-form';
import Datalist from '@triniti/cms/components/datalist-field';
import { Button, FormGroup } from '@triniti/admin-ui-plugin/components';

const Permissions = ({ fields, options, meta: { error } }) => (
  <div className="mb-4">
    <FormGroup className="mb-2">
      {fields.map((field, index) => (
        <Field
          addon={{
            show: true,
            imgAlt: 'remove permission',
            imgSrc: 'trash',
            onClick: () => fields.remove(index),
          }}
          component={Datalist}
          key={`${fields.name}-${index + 1}`}
          name={field}
          options={options}
          placeholder={`some:${fields.name}:permission`}
        />
      ))}
      {error && <span>{error.message}</span>}
    </FormGroup>
    <Button onClick={() => fields.push()} color="primary">Add</Button>
  </div>
);

Permissions.propTypes = {
  fields: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  meta: PropTypes.objectOf(PropTypes.any),
  options: PropTypes.arrayOf(PropTypes.any).isRequired,
};

Permissions.defaultProps = {
  fields: [],
  meta: null,
};

export default Permissions;
