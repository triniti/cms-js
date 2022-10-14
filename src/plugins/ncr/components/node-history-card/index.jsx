import React, { lazy, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import startCase from 'lodash-es/startCase';
import NodeRef from '@gdbots/pbj/well-known/NodeRef';
import isEqual from 'lodash/isEqual';
import moment from 'moment';
import { Badge, Button, ButtonGroup, Card, CardBody, CardHeader, Spinner } from 'reactstrap';
import { CreateModalButton, Icon, Loading } from 'components';
import { scrollToTop } from 'components/screen';
import usePolicy from 'plugins/iam/components/usePolicy';
import useRequest from 'plugins/pbjx/components/useRequest';
import withRequest from 'plugins/pbjx/components/with-request';
import Event from 'plugins/ncr/components/node-history-card/Event';
import RevertButton from 'plugins/ncr/components/revert-button';
import filterRemoved from 'plugins/ncr/components/node-history-card/filterRemoved';
import filterRevertableData from 'plugins/ncr/components/node-history-card/filterData';
import fullMapsAndLists from 'plugins/ncr/components/node-history-card/fullMapsAndLists';
import findNodeDiff from 'plugins/ncr/components/node-history-card/findNodeDiff';
import UserLink from 'plugins/ncr/components/node-history-card/UserLink';


const RawPbjModal = lazy(() => import('components/raw-pbj-modal'));

function NodeHistoryCard(props) {
  const dispatch = useDispatch();
  const policy = usePolicy();
  const { isFormDirty, nodeRef: nodeRefStr, request } = props;
  const nodeRef = NodeRef.fromString(nodeRefStr);
  request
    .set('node_ref', nodeRef)
    .set('count', 5);

  const { response, run, isRunning, pbjxError } = useRequest(request, true);
  const [lastOccurredAts, setLastOccurredAts] = useState([null]);

  useEffect(scrollToTop, [response]);

  const handleNewer = () => {
    request.set('since', lastOccurredAts[lastOccurredAts.length - 2]);
    lastOccurredAts.pop();
    setLastOccurredAts(lastOccurredAts);
    run();
  };

  const handleOlder = () => {
    setLastOccurredAts(prev => [...prev, response.get('last_occurred_at')]);
    request.set('since', response.get('last_occurred_at'));
    run();
  };

  const handleRefresh = () => {
    request.clear('since');
    setLastOccurredAts([null]);
    run();
  };

  const handleRevert = (selected) => {
    const { node, form, formName, setBlocks } = props;
    console.log('Revert Debug', {
      props,
      selected,
    });
    
    window.y = node;
    window.x = props;
    
    selected.forEach((item) => {
      const { id, value } = item;
      const field = node.schema().getField(id);
      if (id === 'blocks') {
        setBlocks(dispatch, formName, value);
        return;
      }
      form.change(id, value);
      
      // if (field.isASingleValue()) {
      //   updatedNode.set(id, value);
      // }
      // if (field.isASet()) {
      //   updatedNode.addToSet(id, value);
      // }
      // if (field.isAList()) {
      //   updatedNode.addToList(id, value ? Array.from(value) : []);
      // }
      // if (field.isAMap()) {
      //   /* eslint-disable no-restricted-syntax */
      //   for (const [k, v] of Object.entries(value)) {
      //     updatedNode.addToMap(id, k, v);
      //   }
      // }
    });
  }
  
  /**
   * Is Db Value Same As Node Value
   *
   * (For lack of a shorter name.)
   *
   * @param {string} id
   * @param {*} dbValue
   * @returns boolean
   */
  const isDbValueSameAsNodeValue = (id, dbValue) => {
    const nodeValue = props.node.toObject()[id];
    return isEqual(dbValue, nodeValue);
  }

  /**
   * Checks against the current event for different db values.
   * @param {*} event
   * @returns boolean
   */
   const hasDifferentDbValues = (event) => {
    // find properties in node that were removed
    const newNode = event.get('new_node').toObject();
    const oldNode = event.get('old_node').toObject();
    const newNodeKeys = Object.keys(newNode);
    const oldNodeKeys = Object.keys(oldNode);
    const missingKeys = oldNodeKeys.filter((x) => !newNodeKeys.includes(x));

    missingKeys.forEach((key) => {
      newNode[key] = null;
    });

    const diffNode = findNodeDiff(filterRevertableData(newNode), filterRevertableData(oldNode));
    const data = filterRemoved(fullMapsAndLists(filterRevertableData(diffNode), newNode));
    const aDiffField = data[Object.keys(data).find((dbField) => !isDbValueSameAsNodeValue(dbField, data[dbField]))];

    return aDiffField !== undefined;
  }

  return (
    <Card>
      <CardHeader id={`${nodeRefStr}-history`}>
        History
        {response && isRunning && <Spinner />}
        <Button color="light" size="sm" onClick={handleRefresh} disabled={isRunning}>
          <Icon imgSrc="refresh" />
        </Button>
      </CardHeader>
      <CardBody>
        {(!response || pbjxError) && (
          <Loading error={pbjxError}>Loading {startCase(nodeRef.getLabel())} History...</Loading>
        )}
        {response && response.has('events') && (
          <>
            {response.get('events', []).map((event, index) => {
              const date = moment(event.get('occurred_at').toDate());
              const occurredAt = date.format('MMM DD, YYYY hh:mm:ss A');
              const occurredAtAgo = date.fromNow();
              const userRef = event.get('ctx_user_ref');
              const schema = event.schema();
              const pathsLength = event.get('paths', []).length;
              return (
                <div key={event.get('event_id')} className="mb-4">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div className="d-flex flex-column ">
                      <h5>
                        <span className="me-1"><strong>{startCase(schema.getCurie().getMessage())}</strong></span>
                        <span className="me-1">by <strong><UserLink userRef={userRef} /></strong></span>
                      </h5>
                      <small className="d-flex align-items-center">
                        <Badge color="light" className="me-1" pill>{occurredAtAgo}</Badge>
                        <span>{occurredAt}</span>
                      </small>
                    </div>
                    <span>
                      {
                        policy.isGranted('cms-history-revert')
                        && schema.hasMixin('gdbots:ncr:mixin:node-updated')
                        && event.get('new_etag') !== event.get('old_etag')
                        && pathsLength > 0
                        && (
                          <RevertButton
                            disabled={!index || !hasDifferentDbValues(event)}
                            event={event}
                            isDbValueSameAsNodeValue={isDbValueSameAsNodeValue}
                            isFormDirty={isFormDirty}
                            onRevert={handleRevert}
                            className="rounded-pill"
                          />
                        )
                      }
                      <CreateModalButton
                        text="View Raw Data"
                        size="sm"
                        className="rounded-pill"
                        modal={RawPbjModal}
                        modalProps={{
                          pbj: event,
                        }} />
                    </span>
                  </div>
                  <Event event={event} />
                </div>
              );
            })}
          </>
        )}
        <div className="text-center">
          <ButtonGroup className="col-md-6">
            {lastOccurredAts && lastOccurredAts.length > 1 && (
              <Button onClick={handleNewer} outline disabled={isRunning}>Newer</Button>
            )}
            {response && response.get('has_more') && (
              <Button onClick={handleOlder} outline disabled={isRunning}>Older</Button>
            )}
          </ButtonGroup>
        </div>
      </CardBody>
    </Card>
  );
}

export default withRequest(NodeHistoryCard, 'gdbots:ncr:request:get-node-history-request');
