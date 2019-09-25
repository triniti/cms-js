import PropTypes from 'prop-types';
import React from 'react';
import startCase from 'lodash/startCase';

import Collaborators from '@triniti/cms/plugins/raven/components/collaborators';
import convertReadableTime from '@triniti/cms/utils/convertReadableTime';
import Message from '@gdbots/pbj/Message';
import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';
import pbjUrl from '@gdbots/pbjx/pbjUrl';
import UncontrolledTooltip from '@triniti/cms/plugins/common/components/uncontrolled-tooltip';
import { Button, Card, Icon, RouterLink, Table } from '@triniti/admin-ui-plugin/components';

const AppsList = ({ apps }) => (
  <Card>
    <Table className="table-stretch" borderless hover responsive>
      <thead>
        <tr>
          <th>Title</th>
          <th>Type</th>
          <th>Create At</th>
          <th>Updated At</th>
          <th />
        </tr>
      </thead>
      <tbody>
        {apps.map((app) => {
          const type = app.generateMessageRef().getCurie().getMessage();

          return (
            <tr key={app.get('_id')} className={`status-${app.get('status')}`}>
              <td>
                {app.get('title')}
                <Collaborators nodeRef={NodeRef.fromNode(app)} />
              </td>
              <td className="text-nowrap">
                {type.includes('ios') ? 'iOS' : startCase(type).replace(/App$/, '')}
              </td>
              <td className="text-nowrap">
                {convertReadableTime(app.get('created_at'))}
              </td>
              <td className="text-nowrap">
                {app.has('updated_at') && convertReadableTime(app.get('updated_at'))}
              </td>
              <td className="td-icons">
                <RouterLink to={pbjUrl(app, 'cms')} className="mr-2">
                  <Button
                    className="mb-0 mr-1"
                    color="hover"
                    id={`view-${app.get('_id')}`}
                    radius="circle"
                  >
                    <Icon imgSrc="eye" alt="view" />
                  </Button>
                  <UncontrolledTooltip placement="auto" target={`view-${app.get('_id')}`}>
                    View
                  </UncontrolledTooltip>
                </RouterLink>
                <RouterLink to={`${pbjUrl(app, 'cms')}/edit`} className="mr-2">
                  <Button
                    className="mb-0 mr-1"
                    color="hover"
                    id={`edit-${app.get('_id')}`}
                    radius="circle"
                  >
                    <Icon imgSrc="pencil" alt="edit" />
                  </Button>
                  <UncontrolledTooltip
                    placement="auto"
                    target={`edit-${app.get('_id')}`}
                  >
                    Edit
                  </UncontrolledTooltip>
                </RouterLink>
              </td>
            </tr>
          );
        })}
      </tbody>
    </Table>
  </Card>
);

AppsList.propTypes = {
  apps: PropTypes.arrayOf(PropTypes.instanceOf(Message)).isRequired,
};

export default AppsList;
