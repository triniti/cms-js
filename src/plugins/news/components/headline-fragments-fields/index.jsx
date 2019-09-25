import PropTypes from 'prop-types';
import React from 'react';
import { Card, CardBody, CardHeader } from '@triniti/admin-ui-plugin/components';
import { FieldArray } from 'redux-form';

import HeadlineFragment from './HeadlineFragment';

const HeadlineFragmentsFields = ({ isEditMode, ...rest }) => (
  <Card>
    <CardHeader>Headline Fragments</CardHeader>
    <CardBody indent className="pb-4">
      <FieldArray component={HeadlineFragment} isEditMode={isEditMode} name="hf" {...rest} />
    </CardBody>
  </Card>
);

HeadlineFragmentsFields.propTypes = {
  isEditMode: PropTypes.bool,
};

HeadlineFragmentsFields.defaultProps = {
  isEditMode: true,
};

export default HeadlineFragmentsFields;
