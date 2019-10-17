import React from 'react';
import PropTypes from 'prop-types';
import noop from 'lodash/noop';
import Message from '@gdbots/pbj/Message';
import { Button, Icon } from '@triniti/admin-ui-plugin/components';
import UncontrolledTooltip from '@triniti/cms/plugins/common/components/uncontrolled-tooltip';
import damUrl from '@triniti/cms/plugins/dam/utils/damUrl';
import convertReadableTime from '@triniti/cms/utils/convertReadableTime';

const TableRow = ({
  node,
  isSelected,
  onSelectNode: handleSelectNode,
}) => (
  <tr
    onClick={() => handleSelectNode(node)}
    style={{
      cursor: 'pointer',
      backgroundColor: isSelected ? '#04c5a2' : '',
      color: isSelected ? 'white' : '',
    }}
  >
    <td>{ node.get('title') }</td>
    <td className="text-nowrap">{ convertReadableTime(node.get('created_at')) }</td>
    <td>{ node.get('mime_type') }</td>
    <td className="td-icons text-right">
      <a
        href={damUrl(node)}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Button color="hover" id={node.get('_id').toString()} radius="circle" className="mr-1 mb-0">
          <Icon imgSrc="external" style={{ color: isSelected ? 'white' : '' }} alt="open" />
        </Button>
        <UncontrolledTooltip placement="auto" target={node.get('_id').toString()}>Open in new tab</UncontrolledTooltip>
      </a>
    </td>
  </tr>
);

TableRow.propTypes = {
  node: PropTypes.instanceOf(Message).isRequired,
  isSelected: PropTypes.bool,
  onSelectNode: PropTypes.func,
};

TableRow.defaultProps = {
  isSelected: false,
  onSelectNode: noop,
};

export default TableRow;
