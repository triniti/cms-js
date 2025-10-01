import React, { lazy, useEffect, useState } from 'react';
import startCase from 'lodash-es/startCase.js';
import { formatDistanceToNow } from 'date-fns';
import NodeRef from '@gdbots/pbj/well-known/NodeRef.js';
import { Badge, Button, ButtonGroup, Card, CardBody, CardHeader, Spinner } from 'reactstrap';
import { CreateModalButton, Icon, Loading } from '@triniti/cms/components/index.js';
import useRequest from '@triniti/cms/plugins/pbjx/components/useRequest.js';
import withRequest from '@triniti/cms/plugins/pbjx/components/with-request/index.js';
import Event from '@triniti/cms/plugins/ncr/components/node-history-card/Event.js';
import UserLink from '@triniti/cms/plugins/ncr/components/node-history-card/UserLink.js';
import formatDate from '@triniti/cms/utils/formatDate.js';
const RawPbjModal = lazy(() => import('@triniti/cms/components/raw-pbj-modal/index.js'));
function NodeHistoryCard (props) {
  const {
    nodeRef: nodeRefStr,
    request
  } = props;
  const nodeRef = NodeRef.fromString(nodeRefStr);
  request.set('node_ref', nodeRef).set('count', 5);
  const {
    response,
    run,
    isRunning,
    pbjxError
  } = useRequest(request);
  const [events, setEvents] = useState([]);
  useEffect(() => {
    if (response && response.has('events')) {
      const newEvents = [...events, ...response.get('events')];
      setEvents(Array.from(new Set(newEvents.map(e => e.get('event_id'))))
          .map(eventId => {
            return newEvents.find(e => e.get('event_id') === eventId);
          }));
    }
  }, [response]);
  const handleOlder = () => {
    request.set('since', response.get('last_occurred_at'));
    run();
  };
  const handleRefresh = () => {
    request.clear('since');
    run();
  };
  return (
      <Card>
        <CardHeader id={`${nodeRefStr}-history`}>
          History
          {isRunning && <Spinner />}
          <Button color='light' size='sm' onClick={handleRefresh} disabled={isRunning}>
            <Icon imgSrc='refresh' />
          </Button>
        </CardHeader>
        <CardBody>
          {(!response || pbjxError) && <Loading error={pbjxError}>Loading {startCase(nodeRef.getLabel())} History...</Loading>}
          <>
            {events.map((event, index) => {
              const date = event.get('occurred_at').toDate();
              const occurredAt = formatDate(date);
              const occurredAtAgo = formatDistanceToNow(date, {
                suffix: true
              }) + ' ago';
              const userRef = event.get('ctx_user_ref');
              return (
                  <div key={event.get('event_id') + Math.random()} className='mb-4'>
                    <div className='d-flex justify-content-between align-items-start mb-2'>
                      <div className='d-flex flex-column '>
                        <h5>
                          <span className='me-1'><strong>{startCase(event.schema().getCurie().getMessage())}</strong></span>
                          <span className='me-1'>by <strong><UserLink userRef={userRef} /></strong></span>
                        </h5>
                        <small className='d-flex align-items-center'>
                          <Badge color='light' className='me-1' pill>{occurredAtAgo}</Badge>
                          <span>{occurredAt}</span>
                        </small>
                      </div>
                      <CreateModalButton
                          text='View Raw Data' size='sm' className='rounded-pill' modal={RawPbjModal} modalProps={{
                        pbj: event
                      }}
                      />
                    </div>
                    <Event event={event} />
                  </div>
              );
            })}
          </>
          <div className='text-center'>
            <ButtonGroup className='col-md-6'>
              {response && response.get('has_more') && <Button onClick={handleOlder} outline disabled={isRunning}>Older</Button>}
            </ButtonGroup>
          </div>
        </CardBody>
      </Card>
  );
}
export default withRequest(NodeHistoryCard, 'gdbots:ncr:request:get-node-history-request');
