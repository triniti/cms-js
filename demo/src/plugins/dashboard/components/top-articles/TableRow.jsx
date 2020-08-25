import PropTypes from 'prop-types';
import React from 'react';
import Collaborators from '@triniti/cms/plugins/raven/components/collaborators';
import convertReadableTime from '@triniti/cms/utils/convertReadableTime';
import Message from '@gdbots/pbj/Message';
import NodeLabels from '@triniti/cms/plugins/ncr/components/node-labels';
import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';
import pbjUrl from '@gdbots/pbjx/pbjUrl';
import UncontrolledTooltip from '@triniti/cms/plugins/common/components/uncontrolled-tooltip';
import { Button, Icon, RouterLink } from '@triniti/admin-ui-plugin/components';

const TableRow = ({ idx, article }) => (
  <tr className={`status-${article.get('status')}`}>
    <td style={{ width: '1px', textAlign: 'right' }}>{idx + 1}.</td>

    <td>
      {article.get('title')}
      <NodeLabels node={article} />
      <Collaborators nodeRef={NodeRef.fromNode(article)} />
    </td>

    <td>
      {article.get('is_locked') && <Icon imgSrc="locked-solid" alt="locked-status" />}
    </td>

    <td>{article.has('slotting')
      ? Object.entries(article.get('slotting')).map(([key, slot]) => (
        <span key={`${key}:${slot}`}>{key}:{slot} </span>
      ))
      : null}
    </td>

    <td className="text-nowrap">{convertReadableTime(article.get('order_date'))}</td>

    <td className="td-icons">
      <RouterLink to={pbjUrl(article, 'cms')}>
        <Button id={`view-${article.get('_id')}`} color="hover" radius="circle" className="mb-0 mr-1">
          <Icon imgSrc="eye" alt="view" />
        </Button>
        <UncontrolledTooltip placement="auto" target={`view-${article.get('_id')}`}>View</UncontrolledTooltip>
      </RouterLink>
      <RouterLink to={`${pbjUrl(article, 'cms')}/edit`}>
        <Button id={`edit-${article.get('_id')}`} color="hover" radius="circle" className="mb-0 mr-1">
          <Icon imgSrc="pencil" alt="edit" />
        </Button>
        <UncontrolledTooltip placement="auto" target={`edit-${article.get('_id')}`}>Edit</UncontrolledTooltip>
      </RouterLink>
      <a
        href={pbjUrl(article, 'canonical')}
        rel="noopener noreferrer"
        target="_blank"
      >
        <Button id={`open-in-new-tab-${article.get('_id')}`} color="hover" radius="circle" className="mr-1 mb-0">
          <Icon imgSrc="external" alt="open" />
        </Button>
        <UncontrolledTooltip placement="auto" target={`open-in-new-tab-${article.get('_id')}`}>Open in new tab</UncontrolledTooltip>
      </a>
    </td>
  </tr>
);

TableRow.propTypes = {
  article: PropTypes.instanceOf(Message).isRequired,
  idx: PropTypes.number.isRequired,
};

export default TableRow;
