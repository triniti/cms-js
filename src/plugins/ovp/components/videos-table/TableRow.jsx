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

const TableRow = ({ disabled, hasCheckboxes, isSelected, onSelectRow, video }) => {
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
        [`status-${video.get('status')}`]: hasCheckboxes || !isSelected,
      })}
      onClick={hasCheckboxes ? noop : () => onSelectRow(NodeRef.fromNode(video))}
      style={trStyle}
    >
      {
        hasCheckboxes
        && (
          <th scope="row">
            <Checkbox
              disabled={disabled}
              id={video.get('_id')}
              onChange={() => onSelectRow(NodeRef.fromNode(video))}
              checked={isSelected}
              size="sm"
            />
          </th>
        )
      }
      <td>
        {video.get('title')}
        <Collaborators nodeRef={NodeRef.fromNode(video)} />
      </td>
      <td className="text-nowrap">{convertReadableTime(video.get('order_date'))}</td>
      <td className="text-nowrap">{video.has('published_at') && convertReadableTime(video.get('published_at'))}</td>
      <td className="td-icons">
        <RouterLink to={pbjUrl(video, 'cms')}>
          <Button id={`view-${video.get('_id')}`} color="hover" radius="circle" className="mb-0 mr-1">
            <Icon imgSrc="eye" alt="view" />
          </Button>
          <UncontrolledTooltip placement="auto" target={`view-${video.get('_id')}`}>View</UncontrolledTooltip>
        </RouterLink>
        <RouterLink to={`${pbjUrl(video, 'cms')}/edit`}>
          <Button id={`edit-${video.get('_id')}`} color="hover" radius="circle" className="mb-0 mr-1">
            <Icon imgSrc="pencil" alt="edit" />
          </Button>
          <UncontrolledTooltip placement="auto" target={`edit-${video.get('_id')}`}>Edit</UncontrolledTooltip>
        </RouterLink>
        <a
          href={pbjUrl(video, 'canonical')}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button color="hover" id={`open-in-new-tab-${video.get('_id')}`} radius="circle" className="mr-1 mb-0">
            <Icon imgSrc="external" alt="open" />
          </Button>
          <UncontrolledTooltip placement="auto" target={`open-in-new-tab-${video.get('_id')}`}>Open in new tab</UncontrolledTooltip>
        </a>
      </td>
    </tr>
  );
};

TableRow.propTypes = {
  disabled: PropTypes.bool,
  hasCheckboxes: PropTypes.bool.isRequired,
  isSelected: PropTypes.bool,
  onSelectRow: PropTypes.func.isRequired,
  video: PropTypes.instanceOf(Message).isRequired,
};

TableRow.defaultProps = {
  disabled: false,
  isSelected: false,
};

export default TableRow;
