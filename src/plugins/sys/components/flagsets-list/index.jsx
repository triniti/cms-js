import React from 'react';
import PropTypes from 'prop-types';
import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';
import { Button, Card, Icon, Table, RouterLink } from '@triniti/admin-ui-plugin/components';
import UncontrolledTooltip from '@triniti/cms/plugins/common/components/uncontrolled-tooltip';
import Collaborators from '@triniti/cms/plugins/raven/components/collaborators';
import { expand } from '@gdbots/pbjx/pbjUrl';

const FlagsetsList = ({ flagsetRefs }) => (
  <Card>
    <Table className="table-borderless table-stretch" hover responsive>
      <thead>
        <tr>
          <th>Title</th>
          <th />
        </tr>
      </thead>
      <tbody>
        { flagsetRefs.map((flagsetRef) => (
          <tr key={flagsetRef.getId()}>
            <td>
              {flagsetRef.getId()}
              <Collaborators nodeRef={flagsetRef} />
            </td>
            <td className="td-icons">
              <RouterLink to={expand(`${flagsetRef.getQName()}.cms`, { _id: flagsetRef.getId() })} className="mr-2">
                <Button id={`view-${flagsetRef.getId()}`} color="hover" radius="circle" className="mb-0 mr-1">
                  <Icon imgSrc="eye" alt="view" />
                </Button>
                <UncontrolledTooltip placement="auto" target={`view-${flagsetRef.getId()}`}>View</UncontrolledTooltip>
              </RouterLink>
              <RouterLink to={`${expand(`${flagsetRef.getQName()}.cms`, { _id: flagsetRef.getId() })}/edit`} className="mr-2">
                <Button id={`edit-${flagsetRef.getId()}`} color="hover" radius="circle" className="mb-0 mr-1">
                  <Icon imgSrc="pencil" alt="edit" />
                </Button>
                <UncontrolledTooltip placement="auto" target={`edit-${flagsetRef.getId()}`}>Edit</UncontrolledTooltip>
              </RouterLink>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  </Card>
);

FlagsetsList.propTypes = {
  flagsetRefs: PropTypes.arrayOf(PropTypes.instanceOf(NodeRef)),
};

FlagsetsList.defaultProps = {
  flagsetRefs: [],
};

export default FlagsetsList;
