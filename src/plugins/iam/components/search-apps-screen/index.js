import React, { lazy } from 'react';
import { Badge, Button, Card, Table } from 'reactstrap';
import { Link, useNavigate } from 'react-router-dom';
import SearchAppsSort from '@gdbots/schemas/gdbots/iam/enums/SearchAppsSort.js';
import { CreateModalButton, Icon, Loading, Screen } from '@triniti/cms/components/index.js';
import Collaborators from '@triniti/cms/plugins/raven/components/collaborators/index.js';
import nodeUrl from '@triniti/cms/plugins/ncr/nodeUrl.js';
import useRequest from '@triniti/cms/plugins/pbjx/components/useRequest.js';
import withRequest from '@triniti/cms/plugins/pbjx/components/with-request/index.js';
import usePolicy from '@triniti/cms/plugins/iam/components/usePolicy.js';
import createRowClickHandler from '@triniti/cms/utils/createRowClickHandler.js';

const CreateAppModal = lazy(() => import('@triniti/cms/plugins/iam/components/create-app-modal/index.js'));

function SearchAppsScreen(props) {
  const { request } = props;
  const { response, pbjxError } = useRequest(request);
  const policy = usePolicy();
  const canCreate = policy.isGranted(`${APP_VENDOR}:app:create`);
  const navigate = useNavigate();

  return (
    <Screen
      header="Apps"
      activeNav="Admin"
      primaryActions={
        <>
          {canCreate && <CreateModalButton text="Create App" icon="plus-outline" modal={CreateAppModal} />}
        </>
      }
    >
      {(!response || pbjxError) && <Loading error={pbjxError} />}

      {response && response.has('nodes') && (
        <Card>
          <Table hover responsive>
            <tbody>
            {response.get('nodes').map(node => {
              const ref = node.generateNodeRef();
              const canUpdate = policy.isGranted(`${ref.getQName()}:update`);
              const handleRowClick = createRowClickHandler(navigate, node);
              return (
                <tr key={`${node.get('_id')}`} className="cursor-pointer" onClick={handleRowClick}>
                  <td className="td-title">
                    {node.get('title')}
                    <Badge className="ms-1" color="light" pill>
                      {ref.getLabel().replace('-app', '')}
                    </Badge>
                  </td>
                  <td className="text-nowrap px-1 py-1"><Collaborators nodeRef={ref.toString()} /></td>
                  <td className="td-icons" data-ignore-row-click>
                    <Link to={nodeUrl(node, 'view')}>
                      <Button color="hover" tag="span">
                        <Icon imgSrc="eye" alt="view" />
                      </Button>
                    </Link>
                    {canUpdate && (
                      <Link to={nodeUrl(node, 'edit')}>
                        <Button color="hover" tag="span">
                          <Icon imgSrc="pencil" alt="edit" />
                        </Button>
                      </Link>
                    )}
                  </td>
                </tr>
              );
            })}
            </tbody>
          </Table>
        </Card>
      )}
    </Screen>
  );
}

export default withRequest(SearchAppsScreen, 'gdbots:iam:request:search-apps-request', {
  persist: true,
  initialData: {
    count: 50,
    sort: SearchAppsSort.TITLE_ASC.getValue(),
  }
});
