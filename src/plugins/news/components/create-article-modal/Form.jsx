import get from 'lodash/get';
import PropTypes from 'prop-types';
import React from 'react';
import { reduxForm, Field } from 'redux-form';
import TextField from '@triniti/cms/components/text-field';
import { Card, CardBody } from '@triniti/admin-ui-plugin/components';
import { formRules } from '@triniti/cms/plugins/news/constants';

const Form = ({ formValues, onBlurSlug: handleBlurSlug, onKeyDown: handleKeyDown }) => {
  const { TITLE_LENGTH_LIMIT } = formRules;
  const titleLength = get(formValues, 'title', '').length;

  return (
    <Card>
      <CardBody indent>
        <Field
          component={TextField}
          label="Title"
          name="title"
          onKeyDown={handleKeyDown}
          placeholder="enter title"
          type="text"
        />
        {titleLength > TITLE_LENGTH_LIMIT + 14
         && (
           <small style={{ 'margin-bottom': '1.25rem' }} className="ml-1 mt-n3 form-text text-danger">
             {`recommendation: keep title less than ${TITLE_LENGTH_LIMIT} characters to avoid title extending too long in search results. (${titleLength}/${TITLE_LENGTH_LIMIT})`}
           </small>
         )}
        <Field
          component={TextField}
          label="Slug"
          name="slug"
          onBlur={handleBlurSlug}
          onKeyDown={handleKeyDown}
          placeholder="enter slug"
          type="text"
        />
      </CardBody>
    </Card>
  );
};

Form.propTypes = {
  formValues: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  onKeyDown: PropTypes.func.isRequired,
  onBlurSlug: PropTypes.func.isRequired,
};

Form.defaultProps = {
  formValues: {},
};

export default reduxForm()(Form);
