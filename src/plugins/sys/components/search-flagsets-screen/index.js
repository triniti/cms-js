import React, { lazy } from 'react';
import { Button, Card, Table } from 'reactstrap';
import { Link, useNavigate } from 'react-router-dom';
import SearchFlagsetsSort from '@triniti/schemas/triniti/sys/enums/SearchFlagsetsSort.js';
import { CreateModalButton, Icon, Loading, Screen } from '@triniti/cms/components/index.js';
import Collaborators from '@triniti/cms/plugins/raven/components/collaborators/index.js';
import nodeUrl from '@triniti/cms/plugins/ncr/nodeUrl.js';
import useRequest from '@triniti/cms/plugins/pbjx/components/useRequest.js';
import withRequest from '@triniti/cms/plugins/pbjx/components/with-request/index.js';
import usePolicy from '@triniti/cms/plugins/iam/components/usePolicy.js';
import createRowClickHandler from '@triniti/cms/utils/createRowClickHandler.js';

const CreateFlagsetModal = lazy(() => import('@triniti/cms/plugins/sys/components/create-flagset-modal/index.js'));

function SearchFlagsetsScreen(props) {
  const { request } = props;
  const { response, pbjxError } = useRequest(request);
  const policy = usePolicy();
  const canCreate = policy.isGranted(`${APP_VENDOR}:flagset:create`);
  const canUpdate = policy.isGranted(`${APP_VENDOR}:flagset:update`);
  const navigate = useNavigate();

  return (
    <Screen
      header="Flagsets"
      activeNav="Admin"
      primaryActions={
        <>
          {canCreate && <CreateModalButton text="Create Flagset" icon="plus-outline" modal={CreateFlagsetModal} />}
        </>
      }
    >
      {(!response || pbjxError) && <Loading error={pbjxError} />}

      {response && response.has('nodes') && (
        <Card>
          <Table hover responsive>
            <tbody>
            {response.get('nodes').map(node => {
              const handleRowClick = createRowClickHandler(navigate, node);
              return (
                <tr key={`${node.get('_id')}`} className="cursor-pointer" onClick={handleRowClick}>
                  <td className="td-title">{node.get('title')}</td>
                  <td className="text-nowrap px-1 py-1"><Collaborators nodeRef={node.generateNodeRef().toString()} /></td>
                  <td className="td-icons" data-ignore-row-click={true}>
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

export default withRequest(SearchFlagsetsScreen, 'triniti:sys:request:search-flagsets-request', {
  persist: true,
  initialData: {
    count: 50,
    sort: SearchFlagsetsSort.TITLE_ASC.getValue(),
  }
});
