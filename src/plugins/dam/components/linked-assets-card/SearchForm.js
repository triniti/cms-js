import React, { useEffect, useState } from 'react';
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardFooter,
  Col,
  Collapse,
  Form,
  InputGroup,
  Row
} from 'reactstrap';
import { Field } from 'react-final-form';
import SearchAssetsSort from '@triniti/schemas/triniti/dam/enums/SearchAssetsSort.js';
import FormMarshaler from '@triniti/cms/utils/FormMarshaler.js';
import {
  ActionButton,
  DatePickerField,
  Icon,
  NumberField,
  SelectField,
  useDebounce
} from '@triniti/cms/components/index.js';
import SortField from '@triniti/cms/plugins/ncr/components/sort-field/index.js';
import GalleryPickerField from '@triniti/cms/plugins/curator/components/gallery-picker-field/index.js';
import PersonPickerField from '@triniti/cms/plugins/people/components/person-picker-field/index.js';

const scrollToTop = () => {
  const tabBody = document.getElementById('asset-linker-search-body');
  if (!tabBody) {
    return;
  }

  tabBody.scrollTo({ top: 0, behavior: 'smooth' });
};

// ordered by frequency of use
const assetTypes = [
  { value: 'image-asset', label: 'Image' },
  { value: 'video-asset', label: 'Video' },
  { value: 'document-asset', label: 'Document' },
  { value: 'audio-asset', label: 'Audio' },
  { value: 'archive-asset', label: 'Archive' },
  { value: 'code-asset', label: 'Code' },
];

export default function SearchForm(props) {
  const { request, form, formState, delegate, handleSubmit, isRunning, run } = props;
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  delegate.handleSubmit = async (values) => {
    values.types = values.type ? [values.type] : null;
    form.getRegisteredFields().forEach(field => request.schema().hasField(field) && request.clear(field));
    request.clear('types');
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
    request.clear('types');
    const values = FormMarshaler.marshal(request);
    values.count = 30;
    values.sort = SearchAssetsSort.RELEVANCE.getValue();
    values.types = null;
    values.type = null;
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
    const type = formState.values.type || '';
    if (!request || request.get('types', []).sort().join('') === type) {
      return;
    }

    form.submit();
  }, [formState.values.type, request]);

  return (
    <Form onSubmit={handleSubmit} autoComplete="off" className="sticky-top shadow-depth-2 w-100">
      <Card className="mb-0 p-0">
        <CardBody>
          <div className="position-relative">
            <InputGroup>
              <Button color="light" onClick={toggle} className="text-dark px-2">
                <Icon imgSrc="filter" className="mx-1" />
                <span className="me-1 d-none d-md-block">Filters</span>
              </Button>
              <SelectField name="type" options={assetTypes} placeholder="Select Type:" />
              <Field name="q" type="search" component="input" className="form-control" placeholder="Search Assets" />
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
                <GalleryPickerField name="gallery_ref" label="Gallery" />
              </Col>
              <Col sm={6} xl={3}>
                <PersonPickerField name="person_refs" label="People" isMulti />
              </Col>
              <Col sm={6} xl={3}>
                <SortField enumClass={SearchAssetsSort} />
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
