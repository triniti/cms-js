import React, { useEffect, useState } from 'react';
import { useForm } from 'react-final-form';
import { useDispatch, useSelector } from 'react-redux';
import kebabCase from 'lodash-es/kebabCase';
import startCase from 'lodash-es/startCase';
import NodeRef from '@gdbots/pbj/well-known/NodeRef';
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
import progressIndicator from 'utils/progressIndicator';
import toast from 'utils/toast';
import sendAlert from 'actions/sendAlert';
import getFriendlyErrorMessage from 'plugins/pbjx/utils/getFriendlyErrorMessage';
import getNode from 'plugins/ncr/selectors/getNode';
import usePolicy from 'plugins/iam/components/usePolicy';
import updateNode from 'plugins/ncr/actions/updateNode';
import noop from 'lodash/noop';

export default function SendForm(props) {
  const { nodeRef, node, onStatusUpdated } = props;
  const content = useSelector((state) => {
    const contentRef = node.get('content_ref');
    return contentRef ? getNode(state, contentRef) : null;
  });

  const dispatch = useDispatch();
  const form = useForm();
  const policy = usePolicy();

  const [action, setAction] = useState(null);
  const [sendAt, setSendAt] = useState(node.get('send_at') || new Date());

  const contentIsNotPublished = content && 'published' !== `${content.get('status')}`;
  const sendStatus = `${node.get('send_status')}`;

  const allowedActions = {
    draft: {
      'send-now': true,
      'schedule-send': true,
      'send-on-publish': contentIsNotPublished,
    },
    scheduled: {
      'send-now': true,
      'schedule-send': true,
      'send-on-publish': contentIsNotPublished,
    },
  };

  useEffect(() => {
    if (!action) {
      return noop;
    }

    setSendAt(node.get('send_at') || new Date());
    setAction(null);
  }, [sendStatus]);

  const can = a => allowedActions?.[sendStatus][a] && policy.isGranted(`${nodeRef}:update`);
  const handleApply = async () => {
    if (!action) {
      return;
    }

    const ref = NodeRef.fromString(nodeRef);
    const label = startCase(ref.getLabel());

    try {
      await progressIndicator.show(`Updating ${label} send status...`);

      // todo: needs review
      const values = {};
      values.send_on_publish = false;
      switch (action) {
        case 'send-now':
          values.send_at = new Date();
          break;
        case 'schedule-send':
          values.send_at = sendAt;
          break;
        case 'send-on-publish':
          values.send_at = null;
          values.send_status = 'draft';
          values.send_on_publish = true;
          break;
      }

      await dispatch(updateNode(values, form, node));
      await onStatusUpdated(action, sendAt);
      await progressIndicator.close();
      toast({ title: `${label} send status updated.` });
      setAction(null);
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
              {startCase(action) || 'Send Options'}
            </DropdownToggle>
            <DropdownMenu className="p-0">
              {can('send-now') && (
                <DropdownItem className="status-published" onClick={handleSelect}>Send Now</DropdownItem>
              )}

              {can('schedule-send') && (
                <DropdownItem className="status-scheduled" onClick={handleSelect}>Schedule Send</DropdownItem>
              )}

              {can('send-on-publish') && (
                <DropdownItem className="status-draft" onClick={handleSelect}>Send on Publish</DropdownItem>
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

      {action === 'schedule-send' && (
        <Row>
          <Col>
            <div className="form-group">
              <DatePicker
                selected={sendAt}
                onChange={date => date && setSendAt(date)}
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
