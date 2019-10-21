import React from 'react';
import PropTypes from 'prop-types';
import Message from '@gdbots/pbj/Message';
import { Card, CardBody, CardHeader } from '@triniti/admin-ui-plugin/components';

const RawContent = ({ pbj, header = 'Raw' }) => (
  <Card>
    {
      header !== '' && <CardHeader>{header}</CardHeader>
    }
    <CardBody indent className="pl-0 pr-0">
      <pre className="pl-5 pr-3">{JSON.stringify(pbj, null, 2)}</pre>
    </CardBody>
  </Card>
);

RawContent.propTypes = {
  pbj: PropTypes.instanceOf(Message).isRequired,
  header: PropTypes.string.isRequired,
};

export default RawContent;
