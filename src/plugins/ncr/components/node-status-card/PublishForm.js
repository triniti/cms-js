import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import kebabCase from 'lodash-es/kebabCase.js';
import startCase from 'lodash-es/startCase.js';
import NodeRef from '@gdbots/pbj/well-known/NodeRef.js';
import {
  Button,
  Col,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Row,
  UncontrolledButtonDropdown
} from 'reactstrap';
import DatePicker from 'react-datepicker';
import progressIndicator from '@triniti/cms/utils/progressIndicator.js';
import toast from '@triniti/cms/utils/toast.js';
import sendAlert from '@triniti/cms/actions/sendAlert.js';
import getFriendlyErrorMessage from '@triniti/cms/plugins/pbjx/utils/getFriendlyErrorMessage.js';
import usePolicy from '@triniti/cms/plugins/iam/components/usePolicy.js';
import markNodeAsDraft from '@triniti/cms/plugins/ncr/actions/markNodeAsDraft.js';
import markNodeAsPending from '@triniti/cms/plugins/ncr/actions/markNodeAsPending.js';
import publishNode from '@triniti/cms/plugins/ncr/actions/publishNode.js';
import unpublishNode from '@triniti/cms/plugins/ncr/actions/unpublishNode.js';
import noop from 'lodash-es/noop.js';

const actions = {
  'mark-as-draft': markNodeAsDraft,
  'mark-as-pending': markNodeAsPending,
  publish: publishNode,
  schedule: publishNode,
  unpublish: unpublishNode,
};

const allowedActions = {
  archived: {
    'mark-as-draft': true,
  },
  deleted: {
    'mark-as-draft': true,
  },
  draft: {
    'mark-as-pending': true,
    'publish': true,
  },
  expired: {
    'mark-as-draft': true,
  },
  pending: {
    'mark-as-draft': true,
    'publish': true,
  },
  published: {
    'unpublish': true,
  },
  scheduled: {
    'mark-as-draft': true,
    'mark-as-pending': true,
    'publish': true,
  },
  unknown: {
    'mark-as-draft': true,
  },
};

export default function PublishForm(props) {
  const { nodeRef, node, onStatusUpdated } = props;
  const dispatch = useDispatch();
  const policy = usePolicy();

  const [action, setAction] = useState(null);
  const [publishAt, setPublishAt] = useState(node.get('published_at') || new Date());
  const status = `${node.get('status')}`;

  useEffect(() => {
    if (!action) {
      return noop;
    }

    setPublishAt(node.get('published_at') || new Date());
    setAction(null);
  }, [status]);

  const can = a => allowedActions?.[status][a] && policy.isGranted(`${nodeRef}:${a}`);
  const handleApply = async () => {
    if (!action) {
      return;
    }

    const ref = NodeRef.fromString(nodeRef);
    const label = startCase(ref.getLabel());

    try {
      await progressIndicator.show(`Updating ${label} status...`);
      await dispatch(actions[action](nodeRef, publishAt));
      await onStatusUpdated(action, publishAt);
      await progressIndicator.close();
      toast({ title: `${label} status updated.` });
    } catch (e) {
      await progressIndicator.close();
      dispatch(sendAlert({ type: 'danger', message: getFriendlyErrorMessage(e) }));
    }
  };
  const handleCancel = () => setAction(null);
  const handleSelect = evt => setAction(kebabCase(evt.target.innerText));

  return (
    <>
      <Row>
        <Col>
          <UncontrolledButtonDropdown>
            <DropdownToggle color="light" className="me-2" caret>
              {actions[action] ? startCase(action) : 'Publish Options'}
            </DropdownToggle>
            <DropdownMenu className="p-0">
              {can('publish') && (
                <DropdownItem className="status-published" onClick={handleSelect}>Publish</DropdownItem>
              )}

              {can('publish') && (
                <DropdownItem className="status-scheduled" onClick={handleSelect}>Schedule</DropdownItem>
              )}

              {can('unpublish') && (
                <DropdownItem className="status-draft" onClick={handleSelect}>Unpublish</DropdownItem>
              )}

              {can('mark-as-draft') && (
                <DropdownItem className="status-draft" onClick={handleSelect}>Mark As Draft</DropdownItem>
              )}

              {can('mark-as-pending') && (
                <DropdownItem className="status-pending" onClick={handleSelect}>Mark As Pending</DropdownItem>
              )}
            </DropdownMenu>
          </UncontrolledButtonDropdown>
          {action && (
            <>
              <Button color="primary" onClick={handleApply}>Apply</Button>
              <Button color="secondary" onClick={handleCancel}>Cancel</Button>
            </>
          )}
        </Col>
      </Row>

      {action === 'schedule' && (
        <Row>
          <Col>
            <div className="form-group">
              <DatePicker
                selected={publishAt}
                onChange={date => date && setPublishAt(date)}
                inline
                shouldCloseOnSelect
                showTimeInput
              />
            </div>
          </Col>
        </Row>
      )}
    </>
  );
}
