import PropTypes from 'prop-types';
import React from 'react';

import Collaborators from '@triniti/cms/plugins/raven/components/collaborators';
import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';
import UncontrolledTooltip from '@triniti/cms/plugins/common/components/uncontrolled-tooltip';
import { expand } from '@gdbots/pbjx/pbjUrl';
import {
  Button,
  Card,
  Icon,
  RouterLink,
  Table,
} from '@triniti/admin-ui-plugin/components';

const ListAllRoles = ({ roles }) => (
  <Card>
    <Table className="table-stretch" borderless hover responsive>
      <thead>
        <tr>
          <th>Role</th>
          <th />
        </tr>
      </thead>
      <tbody>
        {roles.map((role) => (
          <tr key={role.id}>
            <td>
              {role.id}
              <Collaborators nodeRef={role} />
            </td>
            <td className="td-icons">
              <RouterLink to={expand(`${role.getQName()}.cms`, { _id: role.id })} className="mr-2">
                <Button id={`view-${role.id}`} color="hover" radius="circle" className="mb-0 mr-1">
                  <Icon imgSrc="eye" alt="view" />
                </Button>
                <UncontrolledTooltip placement="auto" target={`view-${role.id}`}>
                  View
                </UncontrolledTooltip>
              </RouterLink>
              <RouterLink
                to={`${expand(`${role.getQName()}.cms`, { _id: role.id })}/edit`}
                className="mr-2"
              >
                <Button id={`edit-${role.id}`} color="hover" radius="circle" className="mb-0 mr-1">
                  <Icon imgSrc="pencil" alt="edit" />
                </Button>
                <UncontrolledTooltip placement="auto" target={`edit-${role.id}`}>
                  Edit
                </UncontrolledTooltip>
              </RouterLink>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  </Card>
);

ListAllRoles.propTypes = {
  roles: PropTypes.arrayOf(PropTypes.instanceOf(NodeRef)).isRequired,
};

export default ListAllRoles;
