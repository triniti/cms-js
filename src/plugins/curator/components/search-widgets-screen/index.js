import React, { lazy } from 'react';
import { Badge, Button, Card, Input, Table } from 'reactstrap';
import { Link, useNavigate } from 'react-router-dom';
import SearchWidgetsSort from '@triniti/schemas/triniti/curator/enums/SearchWidgetsSort.js';
import { CreateModalButton, Icon, Loading, Pager, Screen, withForm } from '@triniti/cms/components/index.js';
import Collaborators from '@triniti/cms/plugins/raven/components/collaborators/index.js';
import nodeUrl from '@triniti/cms/plugins/ncr/nodeUrl.js';
import useCuries from '@triniti/cms/plugins/pbjx/components/useCuries.js';
import useRequest from '@triniti/cms/plugins/pbjx/components/useRequest.js';
import withRequest from '@triniti/cms/plugins/pbjx/components/with-request/index.js';
import formatDate from '@triniti/cms/utils/formatDate.js';
import usePolicy from '@triniti/cms/plugins/iam/components/usePolicy.js';
import SearchForm from '@triniti/cms/plugins/curator/components/search-widgets-screen/SearchForm.js';
import BatchOperationsCard from '@triniti/cms/plugins/ncr/components/batch-operations-card/index.js';
import useBatch from '@triniti/cms/plugins/ncr/components/useBatch.js';
import createRowClickHandler from '@triniti/cms/utils/createRowClickHandler.js';

const CreateWidgetModal = lazy(() => import('@triniti/cms/plugins/curator/components/create-widget-modal/index.js'));

function SearchWidgetsScreen(props) {
  const { request, delegate } = props;
  const { response, run, isRunning, pbjxError } = useRequest(request);
  const policy = usePolicy();
  const canCreate = policy.isGranted(`${APP_VENDOR}:widget:create`);
  const batch = useBatch(response);
  const navigate = useNavigate();

  const curies = useCuries('triniti:curator:mixin:widget:v1');
  if (!curies) {
    return null;
  }

  return (
    <Screen
      header="Widgets"
      activeNav="Structure"
      contentWidth="1200px"
      primaryActions={
        <>
          {canCreate && <CreateModalButton text="Create Widget" icon="plus-outline" modal={CreateWidgetModal} />}
        </>
      }
    >
      <SearchForm {...props} isRunning={isRunning} run={run} curies={curies} />
      {(!response || pbjxError) && <Loading error={pbjxError} />}

      {response && (
        <>
          {batch.size > 0 && (
            <BatchOperationsCard
              batch={batch}
              schema={response.getFromListAt('nodes', 0).schema()}
              onComplete={() => {
                batch.reset();
                run();
              }}
            />
          )}

          <div className="text-dark mb-2">
            Found <strong>{response.get('total').toLocaleString()}</strong> widgets
            in <strong>{response.get('time_taken').toLocaleString()}</strong> milliseconds.
          </div>

          <Card>
            <Table hover responsive>
              <thead>
              <tr>
                <th><Input type="checkbox" checked={batch.hasAll()} onChange={batch.toggleAll} /></th>
                <th>Title</th>
                <th></th>
                <th>Created At</th>
                <th>Updated At</th>
                <th></th>
              </tr>
              </thead>
              <tbody>
              {response.get('nodes', []).map(node => {
                const ref = node.generateNodeRef();
                const canUpdate = policy.isGranted(`${ref.getQName()}:update`);
                const handleRowClick = createRowClickHandler(navigate, node);
                return (
                  <tr key={`${node.get('_id')}`} className={`status-${node.get('status')} cursor-pointer`} onClick={handleRowClick}>
                    <td data-ignore-row-click><Input type="checkbox" onChange={() => batch.toggle(node)} checked={batch.has(node)} /></td>
                    <td>
                      {node.get('title')}
                      <Badge className="ms-1" color="light" pill>
                        {ref.getLabel().replace('-widget', '')}
                      </Badge>
                    </td>
                    <td className="text-nowrap"><Collaborators nodeRef={ref.toString()} /></td>
                    <td className="text-nowrap">{formatDate(node.get('created_at'))}</td>
                    <td className="text-nowrap">{formatDate(node.get('updated_at'))}</td>
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

          <Pager
            disabled={isRunning}
            hasMore={response.get('has_more')}
            page={request.get('page')}
            perPage={request.get('count')}
            total={response.get('total')}
            onChangePage={delegate.handleChangePage}
          />
        </>
      )}
    </Screen>
  );
}

export default withRequest(withForm(SearchWidgetsScreen), 'triniti:curator:request:search-widgets-request', {
  persist: true,
  initialData: {
    sort: SearchWidgetsSort.TITLE_ASC.getValue(),
    track_total_hits: true,
  }
});
