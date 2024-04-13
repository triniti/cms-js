import React from 'react';
import { Col, Row } from 'reactstrap';
import slottingConfig from '@config/slottingConfig';
import { DatePickerField, NumberField, SelectField, TextField } from '@triniti/cms/components';
import SortField from '@triniti/cms/plugins/ncr/components/sort-field';
import SearchArticlesSort from '@triniti/schemas/triniti/news/enums/SearchArticlesSort';

export default function SearchArticlesRequestFields() {
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

      <SelectField name="search_request.slotting_key" label="Slotting Key" options={slottingConfig} />
      <SortField name="search_request.sort" enumClass={SearchArticlesSort} />

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
