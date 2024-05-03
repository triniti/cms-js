import React, { lazy, useEffect, useState } from 'react';
import startCase from 'lodash-es/startCase.js';
import NodeRef from '@gdbots/pbj/well-known/NodeRef.js';
import isEqual from 'lodash-es/isEqual.js';
import moment from 'moment';
import { Badge, Button, ButtonGroup, Card, CardBody, CardHeader, Spinner } from 'reactstrap';
import { CreateModalButton, Icon, Loading } from '@triniti/cms/components/index.js';
import usePolicy from '@triniti/cms/plugins/iam/components/usePolicy.js';
import useRequest from '@triniti/cms/plugins/pbjx/components/useRequest.js';
import withRequest from '@triniti/cms/plugins/pbjx/components/with-request/index.js';
import Event from '@triniti/cms/plugins/ncr/components/node-history-card/Event.js';
import RevertButton from '@triniti/cms/plugins/ncr/components/revert-button/index.js';
import filterRemoved from '@triniti/cms/plugins/ncr/components/node-history-card/filterRemoved.js';
import filterRevertableData from '@triniti/cms/plugins/ncr/components/node-history-card/filterData.js';
import fullMapsAndLists from '@triniti/cms/plugins/ncr/components/node-history-card/fullMapsAndLists.js';
import findNodeDiff from '@triniti/cms/plugins/ncr/components/node-history-card/findNodeDiff.js';
import UserLink from '@triniti/cms/plugins/ncr/components/node-history-card/UserLink.js';


const RawPbjModal = lazy(() => import('@triniti/cms/components/raw-pbj-modal/index.js'));

function NodeHistoryCard(props) {
  const policy = usePolicy();
  const { editMode, isFormDirty, nodeRef: nodeRefStr, request } = props;
  const nodeRef = NodeRef.fromString(nodeRefStr);
  request
    .set('node_ref', nodeRef)
    .set('count', 5);

  const { response, run, isRunning, pbjxError } = useRequest(request, true);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    if (response && response.has('events')) {
      setEvents(prev => {
        if(prev.length === 0){
          return response.get('events',[]);
        }else{
          return [...prev, ...response.get('events', [])];
        }
      });
    }
  }, [response]);

  const handleOlder = () => {
    request.set('since', response.get('last_occurred_at'));
    run();
  };

  const handleRefresh = () => {
    request.clear('since');
    setEvents([]);
    run();
  };

  const handleRevert = async (selected) => {
    const { node, form, formName, setBlocks } = props;
    const { push, pop } = form.mutators;

    for (const item of selected) {
      const { id, value } = item;
      const isKeyValueField = node.schema().fields.get(id).getRule().getName() === 'A_MAP';
      if (id === 'blocks') {
        return form.change(id, value.map(x => x.toJSON()));
      } else if (isKeyValueField) {
        // remove current values
        while(await pop(id) !== undefined) {}

        // insert new values
        for (const key in value) {
          push(id, { key, value: value[key] });
        }
        return;
      }
      form.change(id, value);
    }
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
    //   for (const [k, v] of Object.entries(value)) {
    //     updatedNode.addToMap(id, k, v);
    //   }
    // }
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
            {events.map((event, index) => {
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
                            disabled={!index || !hasDifferentDbValues(event) || !editMode}
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
