import React, { useEffect, useState } from 'react';
import { Button, Card, CardBody, CardFooter, Col, Collapse, Form, InputGroup, Row } from 'reactstrap';
import { Field } from 'react-final-form';
import SearchNotificationsSort from '@triniti/schemas/triniti/notify/enums/SearchNotificationsSort.js';
import FormMarshaler from '@triniti/cms/utils/FormMarshaler.js';
import { ActionButton, CheckboxField, DatePickerField, Icon, Loading, NumberField, useDebounce } from '@triniti/cms/components/index.js';
import { scrollToTop } from '@triniti/cms/components/screen/index.js';
import AppPickerField from '@triniti/cms/plugins/iam/components/app-picker-field/index.js';
import SortField from '@triniti/cms/plugins/ncr/components/sort-field/index.js';
import NotificationSendStatusField from '@triniti/cms/plugins/notify/components/notification-send-status-field/index.js';
import noop from 'lodash-es/noop.js';
import withRequest from '@triniti/cms/plugins/pbjx/components/with-request/index.js';
import useRequest from '@triniti/cms/plugins/pbjx/components/useRequest.js';
import SearchAppsSort from '@gdbots/schemas/gdbots/iam/enums/SearchAppsSort.js';
import NodeRef from '@gdbots/pbj/well-known/NodeRef.js';

const AppList = withRequest(props => {
  const { request, onClick = noop } = props;
  const { response, pbjxError } = useRequest(request, true);

  return (
    <>
      {(!response || pbjxError) && <Loading error={pbjxError} />}

      {response && response.has('nodes') &&
        response.get('nodes').map(node => (
          <CheckboxField
            id={`${node.get('_id')}`}
            key={`${node.get('_id')}`}
            inline
            name="app_ref"
            label={node.get('title')}
            value={`${NodeRef.fromNode(node)}`}
            onClick={() => onClick(`${NodeRef.fromNode(node)}`)}
            className="form-check--button"
            />
        ))
      }
    </>
  );
}, 'gdbots:iam:request:search-apps-request', {
  persist: true,
  initialData: {
    count: 50,
    sort: SearchAppsSort.TITLE_ASC.getValue(),
  }
});

export default function SearchForm(props) {
  const { request, form, formState, delegate, handleSubmit, isRunning, run } = props;
  const [ isOpen, setIsOpen ] = useState(false);
  const [ checkedAppRef, setCheckedAppRef ] = useState('');

  const toggle = () => setIsOpen(!isOpen);

  useEffect(() => {
    let appRef = checkedAppRef || '';
    if (!formState.values.app_ref?.length) {
      appRef = '';
    }
    if (!request || `${request.get('app_ref', '')}` === appRef) {
      return noop;
    }

    form.change('app_ref', appRef ? [ appRef ] : undefined);
    form.submit();
  }, [formState.values.app_ref, checkedAppRef, request]);

  delegate.handleSubmit = async (values) => {
    form.getRegisteredFields().forEach(field => request.schema().hasField(field) && request.clear(field));
    await FormMarshaler.unmarshal(values, { message: request });
    request.clear('cursor').set('page', 1);
    run();
  };

  delegate.handleResetFilters = (event) => {
    event.stopPropagation();
    event.preventDefault();
    form.getRegisteredFields().forEach(field => request.schema().hasField(field) && request.clear(field));
    const values = FormMarshaler.marshal(request);
    values.count = 25;
    values.sort = SearchNotificationsSort.CREATED_AT_DESC.getValue();
    form.reset(values);
    form.submit();
  };

  delegate.handleSearchFromFilters = (event) => {
    event.stopPropagation();
    event.preventDefault();
    toggle();
    form.submit();
    scrollToTop();
  };

  const q = useDebounce(formState.values.q || '', 500);
  useEffect(() => {
    if (!request || request.get('q', '') === q.trim()) {
      return noop;
    }

    form.submit();
  }, [q, request]);

  useEffect(() => {
    const sendStatus = formState.values.send_status || '';
    if (!request || `${request.get('send_status', '')}` === sendStatus) {
      return noop;
    }

    form.submit();
  }, [formState.values.send_status, request]);

  return (
    <Form onSubmit={handleSubmit} autoComplete="off">
      <Card>
        <CardBody>
          <InputGroup>
            <Button color="light" onClick={toggle} className="text-dark px-2">
              <Icon imgSrc="filter" className="mx-1" />
              <span className="me-1 d-none d-md-block">Filters</span>
            </Button>
            <NotificationSendStatusField />
            <Field name="q" type="search" component="input" className="form-control" placeholder="Search Notifications" />
            <Button color="secondary" disabled={isRunning} type="submit">
              <Icon imgSrc="search" />
            </Button>
          </InputGroup>

          <div className="mt-3">
            <AppList onClick={setCheckedAppRef} />
          </div>

        </CardBody>

        <Collapse isOpen={isOpen}>
          <CardBody className="pt-1 pb-0">
            <Row>
              <Col sm={6} xl={3}>
                <DatePickerField name="created_after" label="Created After" />
              </Col>
              <Col sm={6} xl={3}>
                <DatePickerField name="created_before" label="Created Before" />
              </Col>
              <Col sm={6} xl={3}>
                <DatePickerField name="updated_after" label="Updated After" />
              </Col>
              <Col sm={6} xl={3}>
                <DatePickerField name="updated_before" label="Updated Before" />
              </Col>
            </Row>

            <Row>
              <Col sm={6} xl={3}>
                <AppPickerField name="app_ref" label="App" />
              </Col>
              <Col sm={6} xl={3}>
                <SortField enumClass={SearchNotificationsSort} />
              </Col>
              <Col sm={6} xl={3}>
                <NumberField name="count" label="Count" />
              </Col>
            </Row>

            <hr className="mt-2 mb-0" />
          </CardBody>

          <CardFooter className="d-flex justify-content-between ps-3 border-top-0 mb-0">
            <span>
              <Button color="hover" onClick={toggle} className="mb-0 rounded-circle">
                <Icon imgSrc="close" />
              </Button>
            </span>
            <span>
              <ActionButton
                text="Reset Filters"
                disabled={isRunning}
                onClick={delegate.handleResetFilters}
                color="light"
                className="mb-0"
              />
              <ActionButton
                text="Search"
                disabled={isRunning}
                onClick={delegate.handleSearchFromFilters}
                color="secondary"
                className="mb-0"
              />
            </span>
          </CardFooter>
        </Collapse>
      </Card>
    </Form>
  );
}
