import React, { useEffect } from 'react';
import { Field } from 'react-final-form';
import { Button, Form, InputGroup, Table } from 'reactstrap';
import { Icon, Loading, Pager, useDebounce, withForm } from 'components';
import damUrl from 'plugins/dam/damUrl';
import useRequest from 'plugins/pbjx/components/useRequest';
import withRequest from 'plugins/pbjx/components/with-request';
import formatDate from 'utils/formatDate';
import SearchAssetsSort from '@triniti/schemas/triniti/dam/enums/SearchAssetsSort';
import noop from 'lodash-es/noop';

function SelectAudio(props) {
  const {
    delegate,
    form,
    formState,
    handleSubmit,
    request,
    selectedAudioNode,
    setSelectedAudioNode
  } = props;
  const { response, run, isRunning, pbjxError } = useRequest(request, true);

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
          <Field name="q" type="search" component="input" className="form-control" placeholder="Search Audio Assets" />
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
              <th>Created At</th>
              <th></th>
            </tr>
            </thead>
            <tbody>
              {response.get('nodes', []).map(node => {
                return (
                  <tr
                    key={`${node.get('_id')}`}
                    onClick={() => setSelectedAudioNode(node)}
                    className={node.equals(selectedAudioNode) ? 'bg-selected' : ''}
                  >
                    <td>{node.get('title')}</td>
                    <td className="text-nowrap">{formatDate(node.get('created_at'))}</td>
                    <td className="td-icons">
                      <a href={damUrl(node, 'canonical')} target="_blank" rel="noopener noreferrer">
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

export default withRequest(withForm(SelectAudio), 'triniti:dam:request:search-assets-request', {
  channel: 'blocksmith',
  persist: true,
  initialData: {
    sort: SearchAssetsSort.RELEVANCE.getValue(),
    types: ['audio-asset'],
    autocomplete: true,
  }
});
