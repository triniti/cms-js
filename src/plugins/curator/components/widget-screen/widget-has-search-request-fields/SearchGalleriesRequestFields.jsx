import React from 'react';
import { Col, Row } from 'reactstrap';
import { DatePickerField, NumberField, TextField } from 'components';
import SortField from 'plugins/ncr/components/sort-field';
import SearchGalleriesSort from '@triniti/schemas/triniti/curator/enums/SearchGalleriesSort';

export default function SearchGalleriesRequestFields() {
  return (
    <>
      <TextField name="search_request.q" label="Query" />
      <Row>
        <Col xs={4}>
          <NumberField name="search_request.page" label="Page" />
        </Col>
        <Col xs={4}>
          <NumberField name="search_request.count" label="Count" />
        </Col>
      </Row>

      <SortField name="search_request.sort" enumClass={SearchGalleriesSort} />

      <Row>
        <Col xs={4}>
          <DatePickerField name="search_request.created_before" label="Created Before" />
        </Col>
        <Col xs={4}>
          <DatePickerField name="search_request.created_after" label="Created After" />
        </Col>
      </Row>
      <Row>
        <Col xs={4}>
          <DatePickerField name="search_request.updated_before" label="Updated Before" />
        </Col>
        <Col xs={4}>
          <DatePickerField name="search_request.updated_after" label="Updated After" />
        </Col>
      </Row>
    </>
  );
}
