import React from 'react';
import PropTypes from 'prop-types';

import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';
import { Button, Card, Icon, Table, RouterLink } from '@triniti/admin-ui-plugin/components';
import UncontrolledTooltip from '@triniti/cms/plugins/common/components/uncontrolled-tooltip';
import Collaborators from '@triniti/cms/plugins/raven/components/collaborators';
import { expand } from '@gdbots/pbjx/pbjUrl';

const PicklistsList = ({ picklistRefs }) => (
  <Card>
    <Table className="table-borderless table-stretch" hover responsive>
      <thead>
        <tr>
          <th>Title</th>
          <th />
        </tr>
      </thead>
      <tbody>
        { picklistRefs.map((picklistRef) => (
          <tr key={picklistRef.getId()}>
            <td>
              {picklistRef.getId()}
              <Collaborators nodeRef={picklistRef} />
            </td>
            <td className="td-icons">
              <RouterLink to={expand(`${picklistRef.getQName()}.cms`, { _id: picklistRef.getId() })} className="mr-2">
                <Button id={`view-${picklistRef.getId()}`} color="hover" radius="circle" className="mb-0 mr-1">
                  <Icon imgSrc="eye" alt="view" />
                </Button>
                <UncontrolledTooltip placement="auto" target={`view-${picklistRef.getId()}`}>View</UncontrolledTooltip>
              </RouterLink>
              <RouterLink to={`${expand(`${picklistRef.getQName()}.cms`, { _id: picklistRef.getId() })}/edit`} className="mr-2">
                <Button id={`edit-${picklistRef.getId()}`} color="hover" radius="circle" className="mb-0 mr-1">
                  <Icon imgSrc="pencil" alt="edit" />
                </Button>
                <UncontrolledTooltip placement="auto" target={`edit-${picklistRef.getId()}`}>Edit</UncontrolledTooltip>
              </RouterLink>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  </Card>
);

PicklistsList.propTypes = {
  picklistRefs: PropTypes.arrayOf(PropTypes.instanceOf(NodeRef)),
};

PicklistsList.defaultProps = {
  picklistRefs: [],
};

export default PicklistsList;
