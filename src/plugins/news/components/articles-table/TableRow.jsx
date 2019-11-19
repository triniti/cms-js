import classNames from 'classnames';
import noop from 'lodash/noop';

import Collaborators from '@triniti/cms/plugins/raven/components/collaborators';
import convertReadableTime from '@triniti/cms/utils/convertReadableTime';
import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';
import Message from '@gdbots/pbj/Message';
import PropTypes from 'prop-types';
import React from 'react';
import { Button, Checkbox, Icon, RouterLink } from '@triniti/admin-ui-plugin/components';
import UncontrolledTooltip from '@triniti/cms/plugins/common/components/uncontrolled-tooltip';
import pbjUrl from '@gdbots/pbjx/pbjUrl';

const TableRow = ({ article, disabled, hasCheckboxes, isSelected, onSelectRow }) => {
  const trStyle = {};
  if (!hasCheckboxes) {
    trStyle.cursor = 'pointer';
    if (isSelected) {
      trStyle.backgroundColor = '#04c5a2';
      trStyle.color = 'white';
    }
  }

  return (
    <tr
      className={classNames({
        [`status-${article.get('status')}`]: hasCheckboxes,
      })}
      onClick={hasCheckboxes ? noop : () => onSelectRow(NodeRef.fromNode(article))}
      style={trStyle}
    >
      {
        hasCheckboxes
        && (
          <th scope="row">
            <Checkbox
              disabled={disabled}
              id={article.get('_id')}
              onChange={() => onSelectRow(NodeRef.fromNode(article))}
              checked={isSelected}
              size="sm"
            />
          </th>
        )
      }
      <td>
        {article.get('title')}
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
      <td className="text-nowrap">
        {article.has('published_at') && convertReadableTime(article.get('published_at'))}
      </td>
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
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button color="hover" id={`open-in-new-tab-${article.get('_id')}`} radius="circle" className="mr-1 mb-0">
            <Icon imgSrc="external" alt="open" />
          </Button>
          <UncontrolledTooltip placement="auto" target={`open-in-new-tab-${article.get('_id')}`}>Open in new tab</UncontrolledTooltip>
        </a>
      </td>
    </tr>
  );
};

TableRow.propTypes = {
  article: PropTypes.instanceOf(Message).isRequired,
  disabled: PropTypes.bool,
  hasCheckboxes: PropTypes.bool.isRequired,
  isSelected: PropTypes.bool,
  onSelectRow: PropTypes.func.isRequired,
};

TableRow.defaultProps = {
  disabled: false,
  isSelected: false,
};

export default TableRow;
