import PropTypes from 'prop-types';
import React from 'react';
import { Field } from 'redux-form';

import TextareaField from '@triniti/cms/components/textarea-field';
import { Card, CardBody, CardHeader } from '@triniti/admin-ui-plugin/components';

const PromotionCodeFields = ({ isEditMode }) => (
  <Card>
    <CardHeader>Code</CardHeader>
    <CardBody indent>
      <Field
        component={TextareaField}
        label="Pre Render Content"
        name="preRenderCode"
        readOnly={!isEditMode}
        rows={5}
        type="textarea"
      />
      <Field
        component={TextareaField}
        label="Post Render Content"
        name="postRenderCode"
        readOnly={!isEditMode}
        rows={5}
        type="textarea"
      />
    </CardBody>
  </Card>
);

PromotionCodeFields.propTypes = {
  isEditMode: PropTypes.bool,
};

PromotionCodeFields.defaultProps = {
  isEditMode: false,
};

export default PromotionCodeFields;
