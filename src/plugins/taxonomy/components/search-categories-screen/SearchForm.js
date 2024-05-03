import React, { useEffect, useState } from 'react';
import { Button, Card, CardBody, Form, InputGroup } from 'reactstrap';
import { Field } from 'react-final-form';
import SearchCategoriesSort from '@triniti/schemas/triniti/taxonomy/enums/SearchCategoriesSort';
import FormMarshaler from 'utils/FormMarshaler';
import { Icon, useDebounce } from '@triniti/cms/components/index.js';
import { scrollToTop } from 'components/screen';
import NodeStatusField from 'plugins/ncr/components/node-status-field';
import noop from 'lodash-es/noop.js';

export default function SearchForm(props) {
  const { request, form, formState, delegate, handleSubmit, isRunning, run } = props;
  const [isOpen, setIsOpen] = useState(false);

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
    values.sort = SearchCategoriesSort.TITLE_DESC.getValue();
    form.reset(values);
    form.submit();
  };

  delegate.handleSearchFromFilters = (event) => {
    event.stopPropagation();
    event.preventDefault();
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
    const status = formState.values.status || '';
    if (!request || `${request.get('status', '')}` === status) {
      return noop;
    }

    form.submit();
  }, [formState.values.status, request]);

  return (
    <Form onSubmit={handleSubmit} autoComplete="off">
      <Card>
        <CardBody>
          <InputGroup>
            <NodeStatusField preset="minimal" />
            <Field name="q" type="search" component="input" className="form-control" placeholder="Search Categories" />
            <Button color="secondary" disabled={isRunning} type="submit">
              <Icon imgSrc="search" />
            </Button>
          </InputGroup>
        </CardBody>
      </Card>
    </Form>
  );
}
