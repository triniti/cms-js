import React from 'react';
import { Card, CardBody, CardHeader, Col, Row } from 'reactstrap';
import { SwitchField } from '@triniti/cms/components';
import useCuries from '@triniti/cms/plugins/pbjx/components/useCuries';
import SearchRequestTypeField from '@triniti/cms/plugins/curator/components/widget-screen/widget-has-search-request-fields/search-request-type-field'

export default function WidgetHasSearchRequestFields() {
  let searchRequestCuries = useCuries('triniti:curator:mixin:widget-search-request:v1');
  if (!searchRequestCuries) {
    return null;
  }

  searchRequestCuries = searchRequestCuries.filter(curie => !curie.includes('triniti'));

  return (
    <>
      <Card>
        <CardHeader>Data Source</CardHeader>
        <CardBody>
          <Row>
            <Col md={4}>
              <SwitchField name="show_pagination" label="Show Pagination" />
              <SwitchField name="show_item_cta_text" label="Show Item CTA Text" />
            </Col>
            <Col md={4}>
              <SwitchField name="show_item_date" label="Show Item Date" />
              <SwitchField name="show_item_duration" label="Show Item Duration" />
            </Col>
            <Col md={4}>
              <SwitchField name="show_item_excerpt" label="Show Item Excerpt" />
              <SwitchField name="show_item_icon" label="Show Item Icon" />
            </Col>
            <Col md={4}>
              <SwitchField name="show_item_media_count" label="Show Item Media Count" />
            </Col>
          </Row>
        </CardBody>
      </Card>
      <Card>
        <CardHeader>Search Request</CardHeader>
        <CardBody>
          <SearchRequestTypeField searchRequestCuries={searchRequestCuries} />
        </CardBody>
      </Card>
    </>
  );
}
