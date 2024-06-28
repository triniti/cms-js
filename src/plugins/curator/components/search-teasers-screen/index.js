import React, { lazy } from 'react';
import { Badge, Button, Card, Input, Table } from 'reactstrap';
import { Link } from 'react-router-dom';
import SearchTeasersSort from '@triniti/schemas/triniti/curator/enums/SearchTeasersSort.js';
import { CreateModalButton, Icon, Loading, Pager, Screen, withForm } from '@triniti/cms/components/index.js';
import nodeUrl from '@triniti/cms/plugins/ncr/nodeUrl.js';
import useCuries from '@triniti/cms/plugins/pbjx/components/useCuries.js';
import useRequest from '@triniti/cms/plugins/pbjx/components/useRequest.js';
import withRequest from '@triniti/cms/plugins/pbjx/components/with-request/index.js';
import formatDate from '@triniti/cms/utils/formatDate.js';
import usePolicy from '@triniti/cms/plugins/iam/components/usePolicy.js';
import SearchForm from '@triniti/cms/plugins/curator/components/search-teasers-screen/SearchForm.js';
import BatchOperationsCard, { useBatch } from '@triniti/cms/plugins/ncr/components/batch-operations-card/index.js';

const CreateTeaserModal = lazy(() => import('@triniti/cms/plugins/curator/components/create-teaser-modal/index.js'));

function SearchTeasersScreen(props) {
  const { request, delegate } = props;
  const { response, run, isRunning, pbjxError } = useRequest(request, true);
  const policy = usePolicy();
  const canCreate = policy.isGranted(`${APP_VENDOR}:teaser:create`);
  const batch = useBatch(response);

  const curies = useCuries('triniti:curator:mixin:teaser:v1');
  if (!curies) {
    return null;
  }

  return (
    <Screen
      header="Teasers"
      activeNav="Structure"
      contentWidth="1600px"
      primaryActions={
        <>
          {canCreate && <CreateModalButton text="Create Teaser" icon="plus-outline" modal={CreateTeaserModal} />}
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
            Found <strong>{response.get('total').toLocaleString()}</strong> teasers
            in <strong>{response.get('time_taken').toLocaleString()}</strong> milliseconds.
          </div>

          <Card>
            <Table hover responsive>
              <thead>
              <tr>
                <th><Input type="checkbox" checked={batch.hasAll()} onChange={batch.toggleAll} /></th>
                <th>Title</th>
                <th>Slotting</th>
                <th>Order Date</th>
                <th>Published At</th>
                <th></th>
              </tr>
              </thead>
              <tbody>
              {response.get('nodes', []).map(node => {
                const schema = node.schema();
                const canUpdate = policy.isGranted(`${schema.getQName()}:update`);
                return (
                  <tr key={`${node.get('_id')}`} className={`status-${node.get('status')}`}>
                    <td><Input type="checkbox" onChange={() => batch.toggle(node)} checked={batch.has(node)} /></td>
                    <td>
                      {node.get('title')}
                        <Badge className="ms-1" color="light" pill>
                          {schema.getCurie().getMessage().replace('-teaser', '')}
                        </Badge>
                    </td>
                    <td>
                      {node.has('slotting') ? Object.entries(node.get('slotting')).map(([key, slot]) => (
                        <span key={key}>{key}:{slot} </span>
                      )) : null}
                    </td>
                    <td className="text-nowrap">{formatDate(node.get('order_date'))}</td>
                    <td className="text-nowrap">{formatDate(node.get('published_at'))}</td>
                    <td className="td-icons">
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
                      <a href={nodeUrl(node, 'canonical')} target="_blank" rel="noopener noreferrer">
                        <Button color="hover" tag="span">
                          <Icon imgSrc="external" alt="open" />
                        </Button>
                      </a>
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

export default withRequest(withForm(SearchTeasersScreen), 'triniti:curator:request:search-teasers-request', {
  persist: true,
  initialData: {
    sort: SearchTeasersSort.ORDER_DATE_DESC.getValue(),
    track_total_hits: true,
  }
});
