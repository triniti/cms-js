import React from 'react';
import { Alert } from 'reactstrap';
import isString from 'lodash-es/isString';
import { FORM_ERROR } from 'final-form';
import getRootFields from 'utils/getRootFields';
import useFormContext from 'components/useFormContext';

// fixme: need to flatten nested errors or pretty this up
export default function FormErrors({ errors }) {
  const formContext = useFormContext();
  const touchedFields = getRootFields(Object.keys(formContext.form.getState().touched));

  return (
    <div>
      {Object.entries(errors).map(([name, error]) => {
        if (name === FORM_ERROR) {
          return (
            <Alert key={name} color="danger" className="rounded shadow">
              {isString(error) ? error : JSON.stringify(error)}
            </Alert>
          );
        }

        if (!touchedFields.includes(name)) {
          return null;
        }

        return (
          <Alert key={name} color="danger" className="rounded shadow">
            Field [{name}]: {isString(error) ? error : JSON.stringify(error)}
          </Alert>
        );
      })}
    </div>
  );
}
