import React, { useEffect, useState } from 'react';
import { Badge, Button, ButtonGroup, Card, CardBody, CardFooter, Col, Collapse, Form, InputGroup, Row } from 'reactstrap';
import { Field } from 'react-final-form';
import SchemaCurie from '@gdbots/pbj/SchemaCurie.js';
import SearchTeasersSort from '@triniti/schemas/triniti/curator/enums/SearchTeasersSort.js';
import FormMarshaler from '@triniti/cms/utils/FormMarshaler.js';
import { ActionButton, CheckboxField, DatePickerField, Icon, NumberField, useDebounce } from '@triniti/cms/components/index.js';
import { scrollToTop } from '@triniti/cms/components/screen/index.js';
import NodeStatusField from '@triniti/cms/plugins/ncr/components/node-status-field/index.js';
import SortField from '@triniti/cms/plugins/ncr/components/sort-field/index.js';
import CategoryPickerField from '@triniti/cms/plugins/taxonomy/components/category-picker-field/index.js';
import ChannelPickerField from '@triniti/cms/plugins/taxonomy/components/channel-picker-field/index.js';
import PersonPickerField from '@triniti/cms/plugins/people/components/person-picker-field/index.js';
import TimelinePickerField from '@triniti/cms/plugins/curator/components/timeline-picker-field/index.js';

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
    values.sort = SearchTeasersSort.ORDER_DATE_DESC.getValue();
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
        <CardBody>
          <div className="position-relative">
            <InputGroup>
              <Button color="light" onClick={toggle} className="text-dark px-2">
                <Icon imgSrc="filter" className="mx-1" />
                <span className="me-1 d-none d-md-block">Filters</span>
              </Button>
              <NodeStatusField />
              <Field name="q" type="search" component="input" className="form-control" placeholder="Search Teasers" />
              <Button color="secondary" disabled={isRunning} type="submit">
                <Icon imgSrc="search" />
              </Button>
            </InputGroup>
            {isRunning && (
              <Badge color="light" pill className="badge-searching">
                <span className="badge-animated">Searching</span>
              </Badge>
            )}
          </div>
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
                  label={type.replace('-teaser', '')}
                />
              );
            })}
          </ButtonGroup>
        </CardBody>

        <Collapse isOpen={isOpen}>
          <CardBody className="pt-1 pb-0">
            <Row>
              <Col sm={6} xl={3}>
                <TimelinePickerField name="timeline_ref" label="Timeline" />
              </Col>
              <Col sm={6} xl={3}>
                <ChannelPickerField name="channel_ref" label="Channel" />
              </Col>
              <Col sm={6} xl={3}>
                <CategoryPickerField name="category_refs" label="Categories" isMulti />
              </Col>
              <Col sm={6} xl={3}>
                <PersonPickerField name="person_refs" label="People" isMulti />
              </Col>
            </Row>

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
                <DatePickerField name="published_after" label="Published After" />
              </Col>
              <Col sm={6} xl={3}>
                <DatePickerField name="published_before" label="Published Before" />
              </Col>
              <Col sm={6} xl={3}>
                <SortField enumClass={SearchTeasersSort} />
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
