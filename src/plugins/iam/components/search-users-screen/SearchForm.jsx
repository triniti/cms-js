import React, { useEffect, useState } from 'react';
import { Button, Card, CardBody, CardFooter, Col, Collapse, Form, InputGroup, Row } from 'reactstrap';
import { Field } from 'react-final-form';
import SearchUsersSort from '@gdbots/schemas/gdbots/iam/enums/SearchUsersSort';
import FormMarshaler from 'utils/FormMarshaler';
import { ActionButton, DatePickerField, Icon, NumberField, TrinaryField, useDebounce } from 'components';
import { scrollToTop } from 'components/screen';
import NodeStatusField from 'plugins/ncr/components/node-status-field';
import SortField from 'plugins/ncr/components/sort-field';

export default function SearchForm(props) {
  const { request, form, formState, delegate, handleSubmit, isRunning, run } = props;
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

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
    values.sort = SearchUsersSort.FIRST_NAME_ASC.getValue();
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
    const status = formState.values.status || '';
    if (!request || `${request.get('status', '')}` === status) {
      return;
    }

    form.submit();
  }, [formState.values.status, request]);

  return (
    <Form onSubmit={handleSubmit} autoComplete="off">
      <Card>
        <CardBody>
          <InputGroup>
            <Button color="light" onClick={toggle} className="text-dark px-2">
              <Icon imgSrc="filter" className="mx-1" />
              <span className="me-1 d-none d-md-block">Filters</span>
            </Button>
            <NodeStatusField preset="minimal" />
            <Field name="q" type="search" component="input" className="form-control" placeholder="Search Users" />
            <Button color="secondary" disabled={isRunning} type="submit">
              <Icon imgSrc="search" />
            </Button>
          </InputGroup>
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
                <TrinaryField name="is_staff" label="Is Staff" unknownLabel="ANY" />
              </Col>
              <Col sm={6} xl={3}>
                <TrinaryField name="is_blocked" label="Is Blocked" unknownLabel="ANY" />
              </Col>
              <Col sm={6} xl={3}>
                <SortField enumClass={SearchUsersSort} />
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