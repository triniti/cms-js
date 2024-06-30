import React, { useEffect, useState } from 'react';
import { Badge, Button, ButtonGroup, Card, CardBody, CardFooter, Col, Collapse, Form, InputGroup, Row } from 'reactstrap';
import { Field } from 'react-final-form';
import SchemaCurie from '@gdbots/pbj/SchemaCurie.js';
import SearchNotificationsSort from '@triniti/schemas/triniti/notify/enums/SearchNotificationsSort.js';
import FormMarshaler from '@triniti/cms/utils/FormMarshaler.js';
import { ActionButton, CheckboxField, DatePickerField, Icon, NumberField, useDebounce } from '@triniti/cms/components/index.js';
import { scrollToTop } from '@triniti/cms/components/screen/index.js';
import NotificationSendStatusField from '@triniti/cms/plugins/notify/components/notification-send-status-field/index.js';
import SortField from '@triniti/cms/plugins/ncr/components/sort-field/index.js';
import AppPickerField from '@triniti/cms/plugins/iam/components/app-picker-field/index.js';

export default function SearchForm(props) {
  const { request, form, formState, delegate, handleSubmit, isRunning, run, curies } = props;
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  delegate.handleSubmit = async (values) => {
    form.getRegisteredFields().forEach(field => request.schema().hasField(field) && request.clear(field));
    await FormMarshaler.unmarshal(values, { message: request });
    request.clear('cursor').set('page', 1);
    run();
  };

  delegate.handleChangePage = (page) => {
    request.set('page', page);
    run();
    scrollToTop();
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
      return;
    }

    form.submit();
  }, [q, request]);

  useEffect(() => {
    const sendStatus = formState.values.send_status || '';
    if (!request || `${request.get('send_status', '')}` === sendStatus) {
      return;
    }

    form.submit();
  }, [formState.values.send_status, request]);

  useEffect(() => {
    const types = formState.values.types || [];
    if (!request || request.get('types', []).sort().join('') === types.sort().join('')) {
      return;
    }

    form.submit();
  }, [formState.values.types, request]);

  return (
    <Form onSubmit={handleSubmit} autoComplete="off">
      <Card>
        <CardBody className="position-relative">
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
          <ButtonGroup className="mt-3 flex-wrap">
            {curies.map(str => {
              const curie = SchemaCurie.fromString(str);
              const type = curie.getMessage();
              return (
                <CheckboxField
                  id={type}
                  key={type}
                  name="types"
                  inline
                  button
                  value={type}
                  label={type.replace('-notification', '')}
                />
              );
            })}
          </ButtonGroup>
          {isRunning && (
            <Badge color="light" pill className="badge-searching">
              <span className="badge-animated">Searching</span>
            </Badge>
          )}
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
              <Button color="hover" onClick={toggle} className="mb-0">
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
