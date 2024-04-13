import React, { useEffect } from 'react';
import { Button, Card, CardBody, Form, InputGroup } from 'reactstrap';
import { Field } from 'react-final-form';
import FormMarshaler from '@triniti/cms/utils/FormMarshaler';
import { Icon, useDebounce } from '@triniti/cms/components';
import noop from 'lodash-es/noop';

export default function SearchForm(props) {
  const { request, form, formState, delegate, handleSubmit, isRunning, run } = props;

  delegate.handleSubmit = async (values) => {
    form.getRegisteredFields().forEach(field => request.schema().hasField(field) && request.clear(field));
    await FormMarshaler.unmarshal(values, { message: request });
    request.clear('cursor').set('page', 1);
    run();
  };

  const q = useDebounce(formState.values.q || '', 500);
  useEffect(() => {
    if (!request || request.get('q', '') === q.trim()) {
      return noop;
    }

    form.submit();
  }, [q, request]);

  return (
    <Form onSubmit={handleSubmit} autoComplete="off" className="sticky-top shadow-depth-2">
      <Card className="mb-0">
        <CardBody className="px-4 py-2">
          <InputGroup size="sm">
            <Field name="q" type="search" component="input" className="form-control" placeholder="Search Images" />
            <Button color="secondary" disabled={isRunning} type="submit">
              <Icon imgSrc="search" />
            </Button>
          </InputGroup>
        </CardBody>
      </Card>
    </Form>
  );
}
