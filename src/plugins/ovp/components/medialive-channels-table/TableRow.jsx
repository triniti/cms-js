import noop from 'lodash/noop';
import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';

import { Button, Checkbox, Icon, RouterLink } from '@triniti/admin-ui-plugin/components';
import Collaborators from '@triniti/cms/plugins/raven/components/collaborators';
import convertReadableTime from '@triniti/cms/utils/convertReadableTime';
import Message from '@gdbots/pbj/Message';
import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';
import UncontrolledTooltip from '@triniti/cms/plugins/common/components/uncontrolled-tooltip';
import pbjUrl from '@gdbots/pbjx/pbjUrl';
import MediaLiveChannelStatus from '@triniti/cms/plugins/ovp/components/medialive-channel-status';

const TableRow = ({ disabled, hasCheckboxes, isSelected, onSelectRow, node }) => (
  <tr className={`status-${node.get('status')}`}>
    <td>
      {node.get('title')}
      <Collaborators nodeRef={NodeRef.fromNode(node)} />
    </td>
    <td className="text-nowrap">{convertReadableTime(node.get('order_date'))}</td>
    <td className="text-nowrap">{node.has('published_at') && convertReadableTime(node.get('published_at'))}</td>
    <td className="td-icons">
      <MediaLiveChannelStatus node={node} />
    </td>
  </tr>
);

TableRow.propTypes = {
  disabled: PropTypes.bool,
  hasCheckboxes: PropTypes.bool.isRequired,
  isSelected: PropTypes.bool,
  onSelectRow: PropTypes.func.isRequired,
  node: PropTypes.instanceOf(Message).isRequired,
};

TableRow.defaultProps = {
  disabled: false,
  isSelected: false,
};

export default TableRow;
