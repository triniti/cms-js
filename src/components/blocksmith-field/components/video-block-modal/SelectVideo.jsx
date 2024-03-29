import React, { useEffect } from 'react';
import { Field } from 'react-final-form';
import { Link } from 'react-router-dom';
import { Button, Form, InputGroup, Table } from 'reactstrap';
import { Icon, Loading, Pager, useDebounce, withForm } from 'components';
import usePolicy from 'plugins/iam/components/usePolicy';
import nodeUrl from 'plugins/ncr/nodeUrl';
import useRequest from 'plugins/pbjx/components/useRequest';
import withRequest from 'plugins/pbjx/components/with-request';
import formatDate from 'utils/formatDate';
import SearchVideosSort from '@triniti/schemas/triniti/ovp/enums/SearchVideosSort';
import noop from 'lodash/noop';

function SelectVideo(props) {
  const {
    delegate,
    form,
    formState,
    handleSubmit,
    request,
    selectedVideoNode,
    setSelectedVideoNode
  } = props;
  const { response, run, isRunning, pbjxError } = useRequest(request, true);
  const policy = usePolicy();
  const canUpdate = policy.isGranted(`${APP_VENDOR}:video:update`);

  delegate.handleSubmit = (values) => {
    request.set('q', values.q);
    request.clear('cursor').set('page', 1);
    run();
  };

  delegate.handleChangePage = page => {
    request.set('page', page);
    run();
  };

  const q = useDebounce(formState.values.q || '', 500);
  useEffect(() => {
    if (!request || request.get('q', '') === q.trim()) {
      return noop;
    }

    form.submit();
  }, [q, request]);

  return (
    <>
      <Form className="shadow-depth-2 sticky-top" onSubmit={handleSubmit} autoComplete="off">
        <InputGroup className="px-4 py-2">
          <Field name="q" type="search" component="input" className="form-control" placeholder="Search Videos" />
          <Button color="secondary" disabled={isRunning} type="submit">
            <Icon imgSrc="search" />
          </Button>
        </InputGroup>
      </Form>
      {(!response || pbjxError) && <Loading error={pbjxError} />}
      {response && (
        <>
          <Table striped borderless className="shadow-depth-1">
            <thead>
            <tr>
              <th>Title</th>
              <th>Order Date</th>
              <th>Published At</th>
              <th></th>
            </tr>
            </thead>
            <tbody>
              {response.get('nodes', []).map(node => {
                return (
                  <tr
                    key={`${node.get('_id')}`}
                    onClick={() => setSelectedVideoNode(node)}
                    className={node.equals(selectedVideoNode) ? 'bg-selected' : ''}
                  >
                    <td>{node.get('title')}</td>
                    <td className="text-nowrap">{formatDate(node.get('order_date'))}</td>
                    <td className="text-nowrap">{formatDate(node.get('updated_at'))}</td>
                    <td className="td-icons">
                      <Link to={nodeUrl(node, 'view')}>
                        <Button color="hover">
                          <Icon imgSrc="eye" alt="view" />
                        </Button>
                      </Link>
                      {canUpdate && (
                        <Link to={nodeUrl(node, 'edit')}>
                          <Button color="hover">
                            <Icon imgSrc="pencil" alt="edit" />
                          </Button>
                        </Link>
                      )}
                      <a href={nodeUrl(node, 'canonical')} target="_blank" rel="noopener noreferrer">
                        <Button color="hover">
                          <Icon imgSrc="external" alt="open" />
                        </Button>
                      </a>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
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
    </>
  );
}

export default withRequest(withForm(SelectVideo), 'triniti:ovp:request:search-videos-request', {
  channel: 'blocksmith',
  persist: true,
  initialData: {
    sort: SearchVideosSort.ORDER_DATE_DESC.getValue(),
    status: 'published'
  }
});
