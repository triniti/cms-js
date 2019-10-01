import PropTypes from 'prop-types';
import React from 'react';

import Collaborators from '@triniti/cms/plugins/raven/components/collaborators';
import convertReadableTime from '@triniti/cms/utils/convertReadableTime';
import Message from '@gdbots/pbj/Message';
import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';
import NotificationSendStatus from '@triniti/schemas/triniti/notify/enums/NotificationSendStatus';
import pbjUrl from '@gdbots/pbjx/pbjUrl';
import { Button, Icon, RouterLink } from '@triniti/admin-ui-plugin/components';

const TableRow = ({ disabled, node }) => {
  const sendStatus = node.get('send_status', NotificationSendStatus.DRAFT);

  return (
    <tr className={`status-${node.get('send_status')}`}>
      <td>
        {node.get('title')}
        <Collaborators nodeRef={NodeRef.fromNode(node)} />
      </td>
      <td>{node.schema().getCurie().getMessage()}{node.has('apple_news_operation') ? ` (${node.get('apple_news_operation')})` : ''}</td>
      <td>
        {convertReadableTime(node.get('created_at'))}
      </td>
      <td>
        {node.has('send_at')
          ? convertReadableTime(node.get('send_at'))
          : (node.get('send_on_publish') && 'Send On Publish')}
      </td>
      <td>{sendStatus.toString()}</td>
      <td className="td-icons">
        <RouterLink to={pbjUrl(node, 'cms')}>
          <Button disabled={disabled} color="hover" radius="circle" className="mr-1 mb-0">
            <Icon imgSrc="eye" alt="view" />
          </Button>
        </RouterLink>
        {
          sendStatus !== NotificationSendStatus.SENT
          && sendStatus !== NotificationSendStatus.FAILED
          && sendStatus !== NotificationSendStatus.CANCELED
          && (
            <RouterLink to={`${pbjUrl(node, 'cms')}/edit`}>
              <Button disabled={disabled} color="hover" radius="circle" className="mr-1 mb-0">
                <Icon imgSrc="pencil" alt="edit" />
              </Button>
            </RouterLink>
          )
        }
      </td>
    </tr>
  );
};

TableRow.propTypes = {
  disabled: PropTypes.bool,
  node: PropTypes.instanceOf(Message).isRequired,
};

TableRow.defaultProps = {
  disabled: false,
};

export default TableRow;
