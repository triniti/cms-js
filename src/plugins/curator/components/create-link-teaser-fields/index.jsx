import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import TextField from '@triniti/cms/components/text-field';

const CreateLinkTeaserFields = ({ onKeyDown: handleKeyDown }) => ([
  <Field onKeyDown={handleKeyDown} key="a" name="title" label="title" component={TextField} />,
  <Field onKeyDown={handleKeyDown} key="b" name="linkUrl" label="Link URL" component={TextField} />,
]);

CreateLinkTeaserFields.propTypes = {
  onKeyDown: PropTypes.func.isRequired,
};

export default CreateLinkTeaserFields;
