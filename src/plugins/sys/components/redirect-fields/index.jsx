import React from 'react';
import PropTypes from 'prop-types';
import noop from 'lodash/noop';
import { Field } from 'redux-form';

import { Card, CardBody, CardHeader } from '@triniti/admin-ui-plugin/components';
import Checkbox from '@triniti/cms/components/checkbox-field';
import Message from '@gdbots/pbj/Message';
import TextField from '@triniti/cms/components/text-field';

const normalize = (value) => value.replace(' ', '-').replace(/\/{2,}/g, '/');

const RedirectFields = ({
  isEditMode, onKeyDown: handleKeyDown, redirect,
}) => (
  <Card>
    {redirect && <CardHeader>Details</CardHeader>}
    <CardBody indent>
      <Field onKeyDown={handleKeyDown} readOnly={redirect} name="title" normalize={normalize} component={TextField} label="Request URI" placeholder="Enter Request URI" />
      <Field onKeyDown={handleKeyDown} readOnly={!isEditMode} name="redirectTo" normalize={normalize} component={TextField} label="Redirect URI" placeholder="Enter Redirect URI" />
      {redirect && <Field name="isVanity" component={Checkbox} disabled={!isEditMode} label="Is Vanity URL?" />}
      {redirect && <Field name="isPermanent" component={Checkbox} disabled={!isEditMode} label="Is Permanent?" />}
    </CardBody>
  </Card>
);

RedirectFields.propTypes = {
  isEditMode: PropTypes.bool,
  onKeyDown: PropTypes.func,
  redirect: PropTypes.instanceOf(Message),
};

RedirectFields.defaultProps = {
  isEditMode: false,
  onKeyDown: noop,
  redirect: null,
};

export default RedirectFields;
