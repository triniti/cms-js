import PropTypes from 'prop-types';
import React from 'react';

import convertReadableTime from '@triniti/cms/utils/convertReadableTime';
import Message from '@gdbots/pbj/Message';
import NotificationSendStatus from '@triniti/schemas/triniti/notify/enums/NotificationSendStatus';
import pbjUrl from '@gdbots/pbjx/pbjUrl';
import { Button, Icon, RouterLink } from '@triniti/admin-ui-plugin/components';

const TableRow = ({ node }) => (
  <tr className={`status-${node.get('send_status')}`}>
    <td>{node.schema().getCurie().getMessage()}{node.has('apple_news_operation') ? ` (${node.get('apple_news_operation')})` : ''}</td>
    <td className="text-nowrap">
      {convertReadableTime(node.get('created_at'))}
    </td>
    <td>
      {node.has('send_at')
        ? convertReadableTime(node.get('send_at'))
        : (node.get('send_on_publish') && 'Send On Publish')}
    </td>
    <td>{node.get('send_status').toString()}</td>
    <td className="td-icons">
      <RouterLink to={pbjUrl(node, 'cms')}>
        <Button color="hover" radius="circle" className="mr-1 mb-0">
          <Icon imgSrc="eye" alt="view" />
        </Button>
      </RouterLink>
      {node.has('send_status') && node.get('send_status') !== NotificationSendStatus.SENT && (
        <RouterLink to={`${pbjUrl(node, 'cms')}/edit`}>
          <Button color="hover" radius="circle" className="mr-1 mb-0">
            <Icon imgSrc="pencil" alt="edit" />
          </Button>
        </RouterLink>
      )}
    </td>
  </tr>
);

TableRow.propTypes = {
  node: PropTypes.instanceOf(Message).isRequired,
};

export default TableRow;
