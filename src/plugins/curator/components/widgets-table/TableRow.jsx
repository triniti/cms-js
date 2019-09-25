import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import React from 'react';

import { Button, Icon, RouterLink } from '@triniti/admin-ui-plugin/components';
import Collaborators from '@triniti/cms/plugins/raven/components/collaborators';
import convertReadableTime from '@triniti/cms/utils/convertReadableTime';
import Message from '@gdbots/pbj/Message';
import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';
import UncontrolledTooltip from '@triniti/cms/plugins/common/components/uncontrolled-tooltip';
import pbjUrl from '@gdbots/pbjx/pbjUrl';

import delegate from './delegate';

const TableRow = ({ handleCloneNode, node }) => (
  <tr className={`status-${node.get('status')}`}>
    <td>
      {node.get('title')}
      <Collaborators nodeRef={NodeRef.fromNode(node)} />
    </td>
    <td className="text-nowrap">{convertReadableTime(node.get('created_at'))}</td>
    <td className="text-nowrap">{node.has('updated_at') && convertReadableTime(node.get('updated_at'))}</td>
    <td className="td-icons">
      <RouterLink to={pbjUrl(node, 'cms')}>
        <Button id={`view-${node.get('_id')}`} color="hover" radius="circle" className="mb-0 mr-1">
          <Icon imgSrc="eye" alt="view" />
        </Button>
        <UncontrolledTooltip placement="auto" target={`view-${node.get('_id')}`}>View</UncontrolledTooltip>
      </RouterLink>
      <RouterLink to={`${pbjUrl(node, 'cms')}/edit`}>
        <Button id={`edit-${node.get('_id')}`} color="hover" radius="circle" className="mb-0 mr-1">
          <Icon imgSrc="pencil" alt="edit" />
        </Button>
        <UncontrolledTooltip placement="auto" target={`edit-${node.get('_id')}`}>Edit</UncontrolledTooltip>
      </RouterLink>
      <Button onClick={handleCloneNode} id={`clone-${node.get('_id')}`} color="hover" radius="circle" className="mb-0 mr-1">
        <Icon imgSrc="documents" alt="clone" />
      </Button>
      <UncontrolledTooltip placement="auto" target={`clone-${node.get('_id')}`}>Clone</UncontrolledTooltip>
    </td>
  </tr>
);

TableRow.propTypes = {
  handleCloneNode: PropTypes.func.isRequired,
  node: PropTypes.instanceOf(Message).isRequired,
};

export default connect(null, delegate)(TableRow);
