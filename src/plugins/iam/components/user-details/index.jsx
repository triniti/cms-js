import React from 'react';
import PropTypes from 'prop-types';
import Message from '@gdbots/pbj/Message';
import moment from 'moment';
import { Card, CardBody, CardHeader } from '@triniti/admin-ui-plugin/components';

const convertReadableTime = (timeInMicrosecond = null) => {
  if (!timeInMicrosecond) {
    return '';
  }

  return moment(timeInMicrosecond / 1000).format('dddd, MMMM Do YYYY, h:mm:ss a');
};

const UserDetails = ({ user }) => (
  <Card>
    <CardHeader>Details</CardHeader>
    <CardBody indent>
      <p><strong>Email: </strong> {user.get('email')}</p>
      <p><strong>First Name: </strong> {user.get('first_name')}</p>
      <p><strong>Last Name: </strong> {user.get('last_name')}</p>
      <p><strong>Is Staff: </strong> {user.get('is_staff') ? 'Yes' : 'No'}</p>
      <p><strong>Is Blocked: </strong> {user.get('is_block') ? 'Yes' : 'No'}</p>
      <p><strong>Created At: </strong> {convertReadableTime(user.get('created_at'))}</p>
      <p><strong>Updated At: </strong> {convertReadableTime(user.get('updated_at'))}</p>
    </CardBody>
  </Card>
);

UserDetails.propTypes = {
  user: PropTypes.instanceOf(Message).isRequired,
};

export default UserDetails;
