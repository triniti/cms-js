import PropTypes from 'prop-types';
import React from 'react';

import { Button, Checkbox, Icon, RouterLink, UncontrolledTooltip } from '@triniti/admin-ui-plugin/components';
import convertReadableTime from '@triniti/cms/utils/convertReadableTime';
import Collaborators from '@triniti/cms/plugins/raven/components/collaborators';
import Message from '@gdbots/pbj/Message';
import pbjUrl from '@gdbots/pbjx/pbjUrl';
import { jsonTreeValueRenderer } from '../event-stream/jsonTreeRenderer';

const TableRow = ({ property, idx }) => {
  const data = jsonTreeValueRenderer(property[1]);
  return (<tr><td><strong className="text-black-50 pl-2 pr-2">{property[0]}</strong></td><td>{data}</td></tr>);
};

TableRow.propTypes = {
  property: PropTypes.instanceOf(Object).isRequired, // eslint-disable-line react/forbid-prop-types
  idx: PropTypes.number.isRequired,
};


export default TableRow;
